/**
 * The hero's scroll-driven scene.
 *
 * A field of small, isolated manufacturer "islands" (slate = independent) is
 * acquired island by island — each lights up in its vertical's colour — and
 * the islands then stream into one geodesic sphere: the platform. It retells
 * the original hero footage (a network that condenses into a glowing sphere),
 * but every frame is computed from scroll progress, so scrubbing backwards
 * plays it in reverse exactly like an image sequence — with nothing to
 * download and no resolution ceiling.
 */

import { portfolioCompanies } from './portfolio'

export type RGB = readonly [number, number, number]

export const VERTICALS: readonly { label: string; rgb: RGB }[] = [
  { label: 'Generics', rgb: [232, 146, 124] }, // coral
  { label: 'CMO services', rgb: [201, 70, 102] }, // burgundy, lifted so it glows on slate
  { label: 'Specialty', rgb: [247, 190, 168] }, // coral-light
]

/** A manufacturer that isn't part of the platform (yet). */
export const INDEPENDENT: RGB = [124, 131, 148]

export interface Company {
  name: string
  meta: string
  vertical: number
}

/** Scroll progress (0–1 across the pinned distance) at which things happen. */
export const TIMELINE = {
  /** Stage boundaries shown in the UI: Acquire | Integrate | Scale. */
  stages: [0, 0.36, 0.74, 1],
  /** Spaced so each company gets its own moment — one label on screen at a time. */
  companyAcquiredAt: [0.075, 0.13, 0.185, 0.24, 0.295],
  /** How long a company's label stays up after its acquisition. */
  labelHold: 0.052,
} as const

const VERTICAL_INDEX = { Generics: 0, CMO: 1, Specialty: 2 } as const

/**
 * The portfolio companies (lib/portfolio.ts), in order of acquisition. The
 * sequence has a staged moment for each of the first five.
 */
export const COMPANIES: readonly Company[] = [...portfolioCompanies]
  .sort((a, b) => a.year - b.year)
  .slice(0, TIMELINE.companyAcquiredAt.length)
  .map((c) => ({
    name: c.name,
    meta: `${c.category} · ${c.location.split(',')[0]} · ${c.year}`,
    vertical: VERTICAL_INDEX[c.category],
  }))

const SPHERE_Z = 12
const CAMERA_START = -1.2
const CAMERA_END = SPHERE_Z - 3.5
const NEAR = 0.12
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))

/** Where each company island sits, relative to the camera, when it is acquired. */
const COMPANY_OFFSETS: readonly (readonly [number, number])[] = [
  [-1.15, 0.5],
  [1.2, -0.35],
  [-1.05, -0.55],
  [1.1, 0.55],
  [-0.35, 0.8],
]
const COMPANY_DISTANCE = 3.6

/** Fly fast through the field, then ease in on the sphere. */
export function cameraZ(p: number) {
  return CAMERA_START + (CAMERA_END - CAMERA_START) * (1 - Math.pow(1 - p, 2.2))
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

export function smoothstep(a: number, b: number, v: number) {
  const t = clamp01((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface Island {
  x: number
  y: number
  z: number
  vertical: number
  acquireAt: number
  integrateAt: number
  integrateDur: number
  phase: number
}

export interface Scene {
  count: number
  island: Uint16Array
  vertical: Uint8Array
  isHub: Uint8Array
  size: Float32Array
  twinkle: Float32Array
  /** Position in the fragmented field. */
  nx: Float32Array
  ny: Float32Array
  nz: Float32Array
  /** Position on the unit sphere (before rotation). */
  sx: Float32Array
  sy: Float32Array
  sz: Float32Array
  /** The first COMPANIES.length islands are the portfolio companies. */
  islands: Island[]
  islandEdges: Uint16Array
  sphereEdges: Uint16Array
  /** Hub node of each company island, indexed like COMPANIES. */
  companyHubs: number[]
}

/**
 * Deterministic, so the composition is identical on every load. `aspect` is the
 * viewport's height / width: tall phone screens get a taller field so it fills
 * the frame instead of sitting in a strip across the middle.
 */
export function buildScene(target: number, aspect = 0.625, seed = 20260929): Scene {
  const rnd = mulberry32(seed)
  const range = (a: number, b: number) => a + rnd() * (b - a)
  const fieldHeight = 3.2 * Math.min(2.6, Math.max(1, aspect / 0.62))

  // Island sizes; company islands are a little larger so they read as anchors.
  const sizes: number[] = COMPANIES.map(() => 13)
  let total = sizes.reduce((s, n) => s + n, 0)
  while (total < target) {
    const n = 6 + Math.floor(rnd() * 8)
    sizes.push(n)
    total += n
  }

  const islands: Island[] = []
  const place = (x: number, y: number, z: number, vertical: number, acquireAt: number) =>
    islands.push({ x, y, z, vertical, acquireAt, integrateAt: 0, integrateDur: 0, phase: rnd() * Math.PI * 2 })

  COMPANIES.forEach((company, k) => {
    const at = TIMELINE.companyAcquiredAt[k]
    const [ox, oy] = COMPANY_OFFSETS[k]
    place(ox, oy, cameraZ(at) + COMPANY_DISTANCE, company.vertical, at)
  })

  const tooClose = (x: number, y: number, z: number) =>
    islands.some((i) => (i.x - x) ** 2 + (i.y - y) ** 2 + (i.z - z) ** 2 < 1.25)

  while (islands.length < sizes.length) {
    let x = 0
    let y = 0
    let z = 0
    for (let tries = 0; tries < 60; tries++) {
      x = range(-6.5, 6.5)
      y = range(-fieldHeight, fieldHeight)
      z = range(1.5, 21)
      const inCameraPath = Math.abs(x) < 0.75 && Math.abs(y) < 0.5
      const inAssemblyZone = x * x + y * y + (z - SPHERE_Z) ** 2 < 2.6
      if (!inCameraPath && !inAssemblyZone && !tooClose(x, y, z)) break
    }
    const r = rnd()
    place(x, y, z, r < 0.4 ? 0 : r < 0.75 ? 1 : 2, 0)
  }

  // Acquisition rolls away from the camera like a wave; companies keep their fixed moments.
  const others = islands.slice(COMPANIES.length).sort((a, b) => a.z - b.z)
  others.forEach((isl, i) => {
    isl.acquireAt = 0.02 + 0.32 * (i / Math.max(1, others.length - 1)) + range(-0.012, 0.012)
  })

  // Integration starts with the islands nearest the sphere; the ones the camera
  // already flew past come last, rushing in from behind the viewer.
  const byDistance = [...islands].sort(
    (a, b) => a.x ** 2 + a.y ** 2 + (a.z - SPHERE_Z) ** 2 - (b.x ** 2 + b.y ** 2 + (b.z - SPHERE_Z) ** 2),
  )
  byDistance.forEach((isl, i) => {
    const at = 0.34 + 0.3 * (i / Math.max(1, byDistance.length - 1)) + range(-0.015, 0.015)
    isl.integrateAt = Math.max(at, isl.acquireAt + 0.05)
    isl.integrateDur = range(0.13, 0.2)
  })

  const count = sizes.reduce((s, n) => s + n, 0)
  const scene: Scene = {
    count,
    island: new Uint16Array(count),
    vertical: new Uint8Array(count),
    isHub: new Uint8Array(count),
    size: new Float32Array(count),
    twinkle: new Float32Array(count),
    nx: new Float32Array(count),
    ny: new Float32Array(count),
    nz: new Float32Array(count),
    sx: new Float32Array(count),
    sy: new Float32Array(count),
    sz: new Float32Array(count),
    islands,
    islandEdges: new Uint16Array(0),
    sphereEdges: new Uint16Array(0),
    companyHubs: [],
  }

  const edgeKeys = new Set<number>()
  const addEdge = (list: number[], a: number, b: number) => {
    const key = a < b ? a * 65536 + b : b * 65536 + a
    if (edgeKeys.has(key)) return
    edgeKeys.add(key)
    list.push(a, b)
  }

  // Nodes: a hub at each island's centre, the rest scattered in a flattened ellipsoid.
  const islandEdges: number[] = []
  let idx = 0
  islands.forEach((isl, k) => {
    const n = sizes[k]
    const spread = 0.32 + n * 0.028
    const first = idx
    for (let j = 0; j < n; j++, idx++) {
      let dx = 0
      let dy = 0
      let dz = 0
      if (j > 0) {
        do {
          dx = range(-1, 1)
          dy = range(-1, 1)
          dz = range(-1, 1)
        } while (dx * dx + dy * dy + dz * dz > 1)
      }
      scene.nx[idx] = isl.x + dx * spread
      scene.ny[idx] = isl.y + dy * spread * 0.65
      scene.nz[idx] = isl.z + dz * spread
      scene.island[idx] = k
      scene.vertical[idx] = isl.vertical
      scene.isHub[idx] = j === 0 ? 1 : 0
      scene.size[idx] = j === 0 ? 0.04 : range(0.013, 0.026)
      scene.twinkle[idx] = rnd() * Math.PI * 2
    }
    if (k < COMPANIES.length) scene.companyHubs.push(first)

    // Spokes to the hub, plus each node to its nearest neighbour: a small, self-contained network.
    for (let a = first + 1; a < idx; a++) {
      if (rnd() < 0.65) addEdge(islandEdges, first, a)
      let best = -1
      let bestD = Infinity
      for (let b = first + 1; b < idx; b++) {
        if (b === a) continue
        const d = (scene.nx[a] - scene.nx[b]) ** 2 + (scene.ny[a] - scene.ny[b]) ** 2 + (scene.nz[a] - scene.nz[b]) ** 2
        if (d < bestD) {
          bestD = d
          best = b
        }
      }
      if (best >= 0) addEdge(islandEdges, a, best)
    }
  })
  scene.islandEdges = Uint16Array.from(islandEdges)

  // Sphere: a Fibonacci lattice sorted top to bottom, split into latitude bands —
  // Specialty on top, Generics in the middle, CMO at the bottom — so the finished
  // platform reads as a peach → coral → burgundy planet. Inside a band, islands
  // take consecutive longitudes in the order they arrive, so the band wraps
  // around the sphere as integration progresses.
  const lattice = Array.from({ length: count }, (_, i) => {
    const y = 1 - ((i + 0.5) / count) * 2
    const r = Math.sqrt(1 - y * y)
    const t = i * GOLDEN_ANGLE
    return { x: Math.cos(t) * r, y, z: Math.sin(t) * r, lon: t % (Math.PI * 2) }
  })
  const arrivalOrder = islands.map((_, k) => k).sort((a, b) => islands[a].integrateAt - islands[b].integrateAt)
  let cursor = 0
  for (const v of [2, 0, 1]) {
    const members: number[] = []
    for (const k of arrivalOrder) {
      if (islands[k].vertical !== v) continue
      for (let i = 0; i < count; i++) if (scene.island[i] === k) members.push(i)
    }
    const band = lattice.slice(cursor, cursor + members.length).sort((a, b) => a.lon - b.lon)
    members.forEach((node, j) => {
      const pt = band[j]
      const jitter = 1 + range(-0.04, 0.04) // a slightly irregular, low-poly shell
      scene.sx[node] = pt.x * jitter
      scene.sy[node] = pt.y * jitter
      scene.sz[node] = pt.z * jitter
    })
    cursor += members.length
  }

  // Geodesic-looking mesh: link every point to its three nearest neighbours on the sphere.
  const sphereEdges: number[] = []
  edgeKeys.clear()
  for (let a = 0; a < count; a++) {
    const best = [-1, -1, -1]
    const bestDot = [-2, -2, -2]
    for (let b = 0; b < count; b++) {
      if (b === a) continue
      const d = scene.sx[a] * scene.sx[b] + scene.sy[a] * scene.sy[b] + scene.sz[a] * scene.sz[b]
      if (d <= bestDot[2]) continue
      let slot = 2
      while (slot > 0 && d > bestDot[slot - 1]) {
        bestDot[slot] = bestDot[slot - 1]
        best[slot] = best[slot - 1]
        slot--
      }
      bestDot[slot] = d
      best[slot] = b
    }
    for (const b of best) if (b >= 0) addEdge(sphereEdges, a, b)
  }
  scene.sphereEdges = Uint16Array.from(sphereEdges)

  return scene
}

// ── Rendering ────────────────────────────────────────────────────────────────

const PALETTE: readonly RGB[] = [VERTICALS[0].rgb, VERTICALS[1].rgb, VERTICALS[2].rgb, INDEPENDENT]
const IND = 3
const ALPHA_LEVELS = 6
const BUCKETS = PALETTE.length * ALPHA_LEVELS * 2
/** x0, y0, x1, y1, alpha, width, palette */
const STREAK_STRIDE = 7

function sprite(rgb: RGB, kind: 'glow' | 'bokeh' | 'core') {
  const size = kind === 'core' ? 256 : 64
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const g = canvas.getContext('2d')!
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  const [r, gr, b] = rgb
  const col = (a: number) => `rgba(${r},${gr},${b},${a})`
  // tinted, not pure white, so small nodes keep their colour
  const hot = `rgba(${Math.round(r * 0.45 + 140)},${Math.round(gr * 0.45 + 140)},${Math.round(b * 0.45 + 140)},1)`
  if (kind === 'glow') {
    grad.addColorStop(0, hot)
    grad.addColorStop(0.08, col(1))
    grad.addColorStop(0.2, col(0.5))
    grad.addColorStop(0.45, col(0.1))
    grad.addColorStop(1, col(0))
  } else if (kind === 'bokeh') {
    // a soft lens disc with a slightly brighter rim
    grad.addColorStop(0, col(0.14))
    grad.addColorStop(0.72, col(0.18))
    grad.addColorStop(0.88, col(0.3))
    grad.addColorStop(1, col(0))
  } else {
    grad.addColorStop(0, 'rgba(255,255,255,1)')
    grad.addColorStop(0.05, 'rgba(255,239,230,0.95)')
    grad.addColorStop(0.16, 'rgba(247,190,168,0.5)')
    grad.addColorStop(0.38, 'rgba(201,70,102,0.18)')
    grad.addColorStop(0.7, 'rgba(123,31,53,0.05)')
    grad.addColorStop(1, 'rgba(123,31,53,0)')
  }
  g.fillStyle = grad
  g.fillRect(0, 0, size, size)
  return canvas
}

export class HeroSceneRenderer {
  private readonly ctx: CanvasRenderingContext2D
  private w = 1
  private h = 1
  private dpr = 1
  private f = 1
  private cx = 0
  private cy = 0

  /** Projected screen position, depth and in-front flag for every node (read by the label overlay). */
  readonly px: Float32Array
  readonly py: Float32Array
  readonly pz: Float32Array
  readonly front: Uint8Array
  private readonly pa: Float32Array
  private readonly pe: Float32Array
  private readonly pacq: Float32Array
  private readonly prevX: Float32Array
  private readonly prevY: Float32Array
  private readonly hasPrev: Uint8Array

  private readonly glow = PALETTE.map((c) => sprite(c, 'glow'))
  private readonly bokeh = PALETTE.map((c) => sprite(c, 'bokeh'))
  private readonly core = sprite([255, 255, 255], 'core')
  private readonly solid = PALETTE.map(([r, g, b]) => `rgb(${r},${g},${b})`)
  private readonly edgeStyle: string[] = []

  private readonly edgeCount: number
  private readonly bucketOf: Int16Array
  private readonly bucketCount = new Int32Array(BUCKETS)
  private readonly bucketStart = new Int32Array(BUCKETS)
  private readonly segs: Float32Array
  private readonly streaks: Float32Array
  private readonly hubs: Int32Array

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly scene: Scene,
  ) {
    this.ctx = canvas.getContext('2d')!
    const n = scene.count
    this.px = new Float32Array(n)
    this.py = new Float32Array(n)
    this.pz = new Float32Array(n)
    this.front = new Uint8Array(n)
    this.pa = new Float32Array(n)
    this.pe = new Float32Array(n)
    this.pacq = new Float32Array(n)
    this.prevX = new Float32Array(n)
    this.prevY = new Float32Array(n)
    this.hasPrev = new Uint8Array(n)
    this.edgeCount = (scene.islandEdges.length + scene.sphereEdges.length) / 2
    this.bucketOf = new Int16Array(this.edgeCount)
    this.segs = new Float32Array(this.edgeCount * 4)
    this.streaks = new Float32Array(n * STREAK_STRIDE)
    this.hubs = new Int32Array(n)
    PALETTE.forEach(([r, g, b]) => {
      for (let lvl = 1; lvl <= ALPHA_LEVELS; lvl++) this.edgeStyle.push(`rgba(${r},${g},${b},${(lvl / ALPHA_LEVELS).toFixed(3)})`)
    })
  }

  resize(w: number, h: number, dpr: number) {
    this.w = w
    this.h = h
    this.dpr = dpr
    this.canvas.width = Math.max(1, Math.round(w * dpr))
    this.canvas.height = Math.max(1, Math.round(h * dpr))
    this.f = Math.min(h * 0.9, w * 1.1)
    this.cx = w / 2
    this.cy = h * 0.46
    this.hasPrev.fill(0)
  }

  /**
   * Draw the scene at scroll progress `p`. `time` (seconds) only drives ambient
   * motion — drift, twinkle, slow rotation — so an idle page still breathes.
   */
  render(p: number, time: number, pointerX = 0, pointerY = 0) {
    const { ctx, scene, w, h, f, cx, cy } = this
    const n = scene.count

    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)
    ctx.globalCompositeOperation = 'lighter'

    // Camera: flies down the field toward the sphere, always looking at it.
    const settle = 1 - p * 0.6
    const camX = (pointerX * 0.3 + Math.sin(time * 0.21) * 0.06) * settle
    const camY = (pointerY * 0.18 + Math.cos(time * 0.17) * 0.05) * settle
    const camZ = cameraZ(p)
    const vx = -camX
    const vy = -camY
    const vz = SPHERE_Z - camZ
    const yaw = Math.atan2(vx, vz)
    const pitch = Math.atan2(vy, Math.hypot(vx, vz))
    const cyw = Math.cos(yaw)
    const syw = Math.sin(yaw)
    const cpt = Math.cos(pitch)
    const spt = Math.sin(pitch)

    // Sphere pose: scroll spins it, time keeps it turning slowly.
    const theta = time * 0.09 + p * 2.4
    const tilt = 0.38
    const cth = Math.cos(theta)
    const sth = Math.sin(theta)
    const ctl = Math.cos(tilt)
    const stl = Math.sin(tilt)
    const grow = smoothstep(0.78, 1, p)
    const radius = 1 + 0.06 * grow + 0.012 * Math.sin(time * 1.3)

    let integrated = 0
    let streakCount = 0
    let hubCount = 0

    for (let i = 0; i < n; i++) {
      const isl = scene.islands[scene.island[i]]
      const acq = clamp01((p - isl.acquireAt) / 0.035)
      const e = easeInOutCubic(clamp01((p - isl.integrateAt) / isl.integrateDur))
      this.pacq[i] = acq
      this.pe[i] = e

      // Position in the fragmented field, drifting a little.
      const drift = time * 0.25 + isl.phase
      let x = scene.nx[i] + Math.sin(drift) * 0.06
      let y = scene.ny[i] + Math.cos(drift * 0.8) * 0.05
      let z = scene.nz[i] + Math.sin(drift * 0.6) * 0.05

      if (e > 0) {
        // Target on the rotating sphere.
        const x1 = scene.sx[i] * cth + scene.sz[i] * sth
        const z1 = -scene.sx[i] * sth + scene.sz[i] * cth
        const tx = x1 * radius
        const ty = (scene.sy[i] * ctl - z1 * stl) * radius
        const tz = (scene.sy[i] * stl + z1 * ctl) * radius + SPHERE_Z
        if (e >= 1) {
          x = tx
          y = ty
          z = tz
          integrated++
        } else {
          // Curve in around the sphere's axis, so the islands arrive as a vortex.
          const ox = x
          const oz = z - SPHERE_Z
          const len = Math.hypot(ox, oz) || 1
          const reach = Math.hypot(ox, y, oz) * 0.35
          const kx = (x + tx) / 2 - (oz / len) * reach
          const ky = (y + ty) / 2
          const kz = (z + tz) / 2 + (ox / len) * reach
          const a = 1 - e
          x = a * a * x + 2 * a * e * kx + e * e * tx
          y = a * a * y + 2 * a * e * ky + e * e * ty
          z = a * a * z + 2 * a * e * kz + e * e * tz
        }
      }

      // World → camera space.
      const dx = x - camX
      const dy = y - camY
      const dz = z - camZ
      const x3 = dx * cyw - dz * syw
      const zy = dx * syw + dz * cyw
      const y3 = dy * cpt - zy * spt
      const z3 = dy * spt + zy * cpt
      if (z3 < NEAR) {
        this.front[i] = 0
        this.hasPrev[i] = 0
        continue
      }
      const inv = f / z3
      const X = cx + x3 * inv
      const Y = cy - y3 * inv
      this.front[i] = 1
      this.px[i] = X
      this.py[i] = Y
      this.pz[i] = z3

      // Brightness: independents are dim; acquisition flashes; arrival pops.
      let alpha = (0.42 + 0.58 * acq) * (0.82 + 0.18 * Math.sin(time * 1.7 + scene.twinkle[i]))
      const flash = (p - isl.acquireAt - 0.02) / 0.014
      alpha *= 1 + 1.4 * Math.exp(-flash * flash)
      if (e > 0) {
        const arrive = (p - isl.integrateAt - isl.integrateDur) / 0.02
        // pop on arrival; settled sphere nodes sit a touch lower so the bands keep their colour
        alpha *= (1 + 1.2 * Math.exp(-arrive * arrive)) * (1 - 0.18 * e)
      }
      if (z3 > 5) alpha *= Math.max(0.15, 1 - (z3 - 5) / 15) // fog
      if (z3 < 0.9) alpha *= (z3 - NEAR) / (0.9 - NEAR) // don't smash into the lens
      this.pa[i] = alpha

      const r = scene.size[i] * inv * (1 - 0.38 * e)
      const pal = scene.vertical[i]
      const near = z3 < 1.6
      const d = Math.min(near ? r * 16 : Math.max(1.6, r * 9), 300)
      if (X + d > 0 && X - d < w && Y + d > 0 && Y - d < h) {
        const sprites = near ? this.bokeh : this.glow
        const a = near ? alpha * 0.5 * clamp01((z3 - NEAR) / 1.0) : alpha
        if (acq < 1) {
          ctx.globalAlpha = Math.min(1, a * (1 - acq))
          ctx.drawImage(sprites[IND], X - d / 2, Y - d / 2, d, d)
        }
        if (acq > 0) {
          ctx.globalAlpha = Math.min(1, a * acq)
          ctx.drawImage(sprites[pal], X - d / 2, Y - d / 2, d, d)
        }
        const companyHub = scene.isHub[i] && scene.island[i] < COMPANIES.length
        if (companyHub && acq > 0.5 && e < 0.5 && r > 2.2) this.hubs[hubCount++] = i
      }

      // Motion streaks for nodes in flight — longer when you scroll faster.
      if (e > 0 && e < 1 && this.hasPrev[i]) {
        const mx = X - this.prevX[i]
        const my = Y - this.prevY[i]
        if (mx * mx + my * my > 4) {
          const o = streakCount++ * STREAK_STRIDE
          this.streaks[o] = this.prevX[i]
          this.streaks[o + 1] = this.prevY[i]
          this.streaks[o + 2] = X
          this.streaks[o + 3] = Y
          this.streaks[o + 4] = Math.min(1, alpha * 0.55)
          this.streaks[o + 5] = Math.min(3, Math.max(0.6, r * 1.2))
          this.streaks[o + 6] = pal
        }
      }
      this.prevX[i] = X
      this.prevY[i] = Y
      this.hasPrev[i] = 1
    }

    // The core: the point everything converges on. A distant beacon at first.
    {
      const dz = SPHERE_Z - camZ
      const zy = -camX * syw + dz * cyw
      const z3 = -camY * spt + zy * cpt
      const X = cx + (-camX * cyw - dz * syw) * (f / z3)
      const Y = cy - (-camY * cpt - zy * spt) * (f / z3)
      const intensity = 0.28 + 0.72 * (integrated / n) + 0.35 * grow
      const d = ((1.6 + 0.8 * intensity) * f) / z3
      ctx.globalAlpha = Math.min(1, intensity * (0.9 + 0.1 * Math.sin(time * 2)))
      ctx.drawImage(this.core, X - d / 2, Y - d / 2, d, d)
    }

    // Edges, batched into (colour × alpha × width) buckets: two passes, one stroke per bucket.
    ctx.globalAlpha = 1
    const maxLen2 = (w * 0.45) ** 2
    const classify = (a: number, b: number, sphere: boolean) => {
      if (!this.front[a] || !this.front[b]) return -1
      let alpha: number
      let pal: number
      if (sphere) {
        const factor = smoothstep(0.95, 1, Math.min(this.pe[a], this.pe[b]))
        if (factor <= 0) return -1
        alpha = Math.min(this.pa[a], this.pa[b]) * 0.62 * factor
        pal = scene.vertical[a]
      } else {
        const factor = 1 - Math.max(this.pe[a], this.pe[b])
        if (factor <= 0) return -1
        alpha = Math.min(this.pa[a], this.pa[b]) * 0.55 * factor
        pal = this.pacq[a] >= 0.5 ? scene.vertical[a] : IND
      }
      const lx = this.px[a] - this.px[b]
      const ly = this.py[a] - this.py[b]
      if (lx * lx + ly * ly > maxLen2) return -1
      const lvl = Math.min(ALPHA_LEVELS, Math.ceil(alpha * ALPHA_LEVELS))
      if (lvl < 1) return -1
      const wide = this.pz[a] < 2.4 || this.pz[b] < 2.4 ? 1 : 0
      return (pal * ALPHA_LEVELS + lvl - 1) * 2 + wide
    }

    this.bucketCount.fill(0)
    const E1 = scene.islandEdges
    const E2 = scene.sphereEdges
    let k = 0
    for (let j = 0; j < E1.length; j += 2, k++) {
      const bk = classify(E1[j], E1[j + 1], false)
      this.bucketOf[k] = bk
      if (bk >= 0) this.bucketCount[bk]++
    }
    for (let j = 0; j < E2.length; j += 2, k++) {
      const bk = classify(E2[j], E2[j + 1], true)
      this.bucketOf[k] = bk
      if (bk >= 0) this.bucketCount[bk]++
    }
    let acc = 0
    for (let b = 0; b < BUCKETS; b++) {
      this.bucketStart[b] = acc
      acc += this.bucketCount[b]
      this.bucketCount[b] = 0
    }
    k = 0
    const write = (a: number, b: number, bk: number) => {
      const o = (this.bucketStart[bk] + this.bucketCount[bk]++) * 4
      this.segs[o] = this.px[a]
      this.segs[o + 1] = this.py[a]
      this.segs[o + 2] = this.px[b]
      this.segs[o + 3] = this.py[b]
    }
    for (let j = 0; j < E1.length; j += 2, k++) if (this.bucketOf[k] >= 0) write(E1[j], E1[j + 1], this.bucketOf[k])
    for (let j = 0; j < E2.length; j += 2, k++) if (this.bucketOf[k] >= 0) write(E2[j], E2[j + 1], this.bucketOf[k])
    for (let b = 0; b < BUCKETS; b++) {
      const c = this.bucketCount[b]
      if (!c) continue
      ctx.strokeStyle = this.edgeStyle[b >> 1]
      ctx.lineWidth = b & 1 ? 1.3 : 0.7
      ctx.beginPath()
      for (let s = this.bucketStart[b] * 4, end = s + c * 4; s < end; s += 4) {
        ctx.moveTo(this.segs[s], this.segs[s + 1])
        ctx.lineTo(this.segs[s + 2], this.segs[s + 3])
      }
      ctx.stroke()
    }

    // Streaks.
    ctx.lineCap = 'round'
    for (let s = 0; s < streakCount; s++) {
      const o = s * STREAK_STRIDE
      ctx.strokeStyle = this.solid[this.streaks[o + 6]]
      ctx.globalAlpha = this.streaks[o + 4]
      ctx.lineWidth = this.streaks[o + 5]
      ctx.beginPath()
      ctx.moveTo(this.streaks[o], this.streaks[o + 1])
      ctx.lineTo(this.streaks[o + 2], this.streaks[o + 3])
      ctx.stroke()
    }

    // Company hubs get a ring and a pharmacy cross while they're still standalone.
    ctx.lineWidth = 1
    for (let s = 0; s < hubCount; s++) {
      const i = this.hubs[s]
      const r = (scene.size[i] * f) / this.pz[i]
      const X = this.px[i]
      const Y = this.py[i]
      ctx.globalAlpha = Math.min(1, this.pa[i] * 0.8)
      ctx.strokeStyle = this.solid[scene.vertical[i]]
      ctx.beginPath()
      ctx.arc(X, Y, r * 2.6, 0, Math.PI * 2)
      ctx.stroke()
      ctx.strokeStyle = 'rgb(255,244,238)'
      ctx.beginPath()
      ctx.moveTo(X - r * 0.9, Y)
      ctx.lineTo(X + r * 0.9, Y)
      ctx.moveTo(X, Y - r * 0.9)
      ctx.lineTo(X, Y + r * 0.9)
      ctx.stroke()
    }

    // Scale: two pulse rings radiate from the finished platform's equator.
    ctx.strokeStyle = this.solid[2]
    ctx.lineWidth = 1.2
    for (const start of [0.79, 0.86]) {
      const t = clamp01((p - start) / 0.16)
      if (t <= 0 || t >= 1) continue
      const R = radius * (1.02 + t * 0.9)
      ctx.globalAlpha = Math.pow(1 - t, 1.6) * 0.55
      ctx.beginPath()
      let pen = false
      for (let s = 0; s <= 96; s++) {
        const ang = (s / 96) * Math.PI * 2
        const rx = Math.cos(ang) * R
        const rz0 = Math.sin(ang) * R
        const wy = -rz0 * stl
        const wz = rz0 * ctl + SPHERE_Z
        const dx = rx - camX
        const dy = wy - camY
        const dz = wz - camZ
        const x3 = dx * cyw - dz * syw
        const zy = dx * syw + dz * cyw
        const y3 = dy * cpt - zy * spt
        const z3 = dy * spt + zy * cpt
        if (z3 < 0.4) {
          pen = false
          continue
        }
        const X = cx + (x3 * f) / z3
        const Y = cy - (y3 * f) / z3
        if (pen) ctx.lineTo(X, Y)
        else ctx.moveTo(X, Y)
        pen = true
      }
      ctx.stroke()
    }

    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
  }
}
