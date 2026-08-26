import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import RouteProgress from './components/RouteProgress'
import './globals.css'

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-plex-sans',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-plex-mono',
})

const SITE = 'https://tradersatwisconsin.com'
const DESCRIPTION =
  'Traders at Wisconsin is a student-led quantitative finance club at UW–Madison, ' +
  'covering probability, statistics, programming, and market structure.'

export const metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'Traders at Wisconsin — Quantitative Finance at UW–Madison',
    template: '%s — Traders at Wisconsin',
  },
  description: DESCRIPTION,
  keywords: [
    'quantitative finance', 'trading', 'UW-Madison', 'quant club',
    'University of Wisconsin', 'probability', 'market structure',
  ],
  openGraph: {
    type: 'website',
    url: SITE,
    siteName: 'Traders at Wisconsin',
    title: 'Traders at Wisconsin — Quantitative Finance at UW–Madison',
    description: DESCRIPTION,
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: SITE },
}

export const viewport = {
  themeColor: '#0a0a0b',
  colorScheme: 'light',
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${plexSans.variable} ${plexMono.variable}`}
    >
      <body className="bg-paper text-body font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[300]
                     focus:bg-ink focus:text-paper focus:px-5 focus:py-3 focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>

        <RouteProgress />
        <NavBar />

        <main id="main">{children}</main>

        <Footer />
      </body>
    </html>
  )
}
