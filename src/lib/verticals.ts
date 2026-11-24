/**
 * The three verticals and their colours — one vocabulary for the whole site.
 * The hero scene, the platform explorer, the portfolio map and every legend
 * read from here, so "coral" always means Generics, everywhere.
 */

export type RGB = readonly [number, number, number]
export type VerticalKey = 'Generics' | 'CMO' | 'Specialty'

export interface Vertical {
  key: VerticalKey
  label: string
  rgb: RGB
}

export const VERTICALS: readonly Vertical[] = [
  { key: 'Generics', label: 'Generics', rgb: [232, 146, 124] }, // coral
  { key: 'CMO', label: 'CMO services', rgb: [201, 70, 102] }, // burgundy, lifted so it glows on slate
  { key: 'Specialty', label: 'Specialty', rgb: [247, 190, 168] }, // coral-light
]

/** A manufacturer that isn't part of the platform (yet). */
export const INDEPENDENT: RGB = [124, 131, 148]

export const VERTICAL_INDEX: Record<VerticalKey, number> = { Generics: 0, CMO: 1, Specialty: 2 }

export const rgb = (c: readonly number[], alpha?: number) =>
  alpha === undefined ? `rgb(${c.join(',')})` : `rgba(${c.join(',')},${alpha})`

export const verticalColor = (key: VerticalKey, alpha?: number) => rgb(VERTICALS[VERTICAL_INDEX[key]].rgb, alpha)
