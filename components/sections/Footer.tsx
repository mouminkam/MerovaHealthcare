'use client'

import { ArrowUp } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'

const columns = [
  {
    title: 'Explore',
    links: [
      { label: 'Platform', href: '#platform' },
      { label: 'Thesis', href: '#thesis' },
      { label: 'Market', href: '#market' },
      { label: 'Portfolio', href: '#portfolio' },
    ],
  },
  {
    title: 'Investors',
    links: [
      { label: 'Returns', href: '#returns' },
      { label: 'Operating model', href: '#rova' },
      { label: 'Leadership', href: '#leadership' },
      { label: 'Contact', href: '#contact' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] section-padding pt-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo />
            <p className="mt-6 max-w-sm leading-7 text-slate-400">
              Building the future of pharmaceutical manufacturing through strategic acquisition, integration, and operational
              excellence.
            </p>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500">Zurich, Switzerland</p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 lg:col-span-5 lg:col-start-8">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500">{col.title}</p>
                <ul className="mt-5 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="text-slate-300 transition-colors hover:text-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-white/[0.06] py-8 md:flex-row md:items-start md:justify-between">
          <p className="max-w-3xl text-xs leading-5 text-slate-600">
            This website is for informational purposes only and does not constitute an offer to sell or a solicitation of an offer to buy
            any securities. Past performance is not indicative of future results. Investments involve risk and possible loss of principal
            capital.
          </p>
          <div className="flex shrink-0 items-center gap-6 text-sm text-slate-500">
            <span>&copy; {new Date().getFullYear()} Merova Healthcare Holding Ltd.</span>
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-slate-300 transition-colors hover:text-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
            >
              Back to top
              <ArrowUp className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* The wordmark, set at architectural scale and cropped by the page edge. */}
      <p
        aria-hidden="true"
        className="pointer-events-none -mb-[0.2em] select-none text-center font-display text-[14.5vw] font-extrabold leading-[0.8] tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.09)]"
      >
        Merova
      </p>
    </footer>
  )
}
