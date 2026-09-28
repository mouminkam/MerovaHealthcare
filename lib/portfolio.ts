/** Portfolio companies — shared by the Portfolio section and the hero sequence. */

export interface PortfolioCompany {
  id: string
  name: string
  logo: string // Will be a monogram for now
  category: 'Generics' | 'CMO' | 'Specialty'
  location: string
  /** Latitude, longitude of the site — plotted on the portfolio map. */
  coordinates: readonly [number, number]
  status: 'Active' | 'Integration' | 'Growth'
  description: string
  metrics: {
    revenue?: string
    employees?: string
    products?: string
    capacity?: string
  }
  year: number
}

export const portfolioCompanies: PortfolioCompany[] = [
  {
    id: 'pharmatech',
    name: 'PharmaTech Industries',
    logo: 'PT',
    category: 'Generics',
    location: 'Mumbai, India',
    coordinates: [19.08, 72.88],
    status: 'Active',
    description: 'Leading manufacturer of generic oral solid dosage forms with FDA-approved facilities and a portfolio of 120+ products.',
    metrics: {
      revenue: '$85M',
      employees: '850',
      products: '120+',
    },
    year: 2023,
  },
  {
    id: 'biomed-contract',
    name: 'BioMed Contract Manufacturing',
    logo: 'BC',
    category: 'CMO',
    location: 'Dublin, Ireland',
    coordinates: [53.35, -6.26],
    status: 'Integration',
    description: 'EU-GMP certified contract manufacturer specializing in sterile injectables and complex formulations.',
    metrics: {
      revenue: '$120M',
      employees: '650',
      capacity: '500M units',
    },
    year: 2024,
  },
  {
    id: 'neurogen',
    name: 'NeuroGen Therapeutics',
    logo: 'NG',
    category: 'Specialty',
    location: 'Boston, USA',
    coordinates: [42.36, -71.06],
    status: 'Growth',
    description: 'Specialty pharmaceutical company focused on CNS disorders with a pipeline of novel delivery systems.',
    metrics: {
      revenue: '$45M',
      products: '8',
      employees: '180',
    },
    year: 2024,
  },
  {
    id: 'generic-plus',
    name: 'Generic Plus Holdings',
    logo: 'G+',
    category: 'Generics',
    location: 'Hyderabad, India',
    coordinates: [17.39, 78.49],
    status: 'Active',
    description: 'High-volume generics manufacturer with vertically integrated API production capabilities.',
    metrics: {
      revenue: '$95M',
      products: '200+',
      employees: '1,200',
    },
    year: 2023,
  },
  {
    id: 'sterile-solutions',
    name: 'Sterile Solutions GmbH',
    logo: 'SS',
    category: 'CMO',
    location: 'Frankfurt, Germany',
    coordinates: [50.11, 8.68],
    status: 'Integration',
    description: 'Specialized CMO for parenteral products with state-of-the-art isolator technology.',
    metrics: {
      revenue: '$75M',
      employees: '420',
      capacity: '200M units',
    },
    year: 2025,
  },
]

/** Group headquarters — the hub every portfolio company connects to. */
export const HEADQUARTERS = { city: 'Zurich', country: 'Switzerland', coordinates: [47.38, 8.54] as const }
