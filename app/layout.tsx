import type { Metadata } from "next"
import { B612, B612_Mono, Big_Shoulders, Big_Shoulders_Stencil } from "next/font/google"
import "./globals.css"

// Body: B612, designed for cockpit-display legibility.
const body = B612({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--f-body",
})

// Data, labels, code: its monospaced sibling.
const label = B612_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--f-label",
})

// Headings: industrial condensed.
const display = Big_Shoulders({
  subsets: ["latin"],
  variable: "--f-display",
})

// Wordmark only: the lettering you find stencilled on machinery.
const stencil = Big_Shoulders_Stencil({
  subsets: ["latin"],
  weight: ["800", "900"],
  variable: "--f-stencil",
})

export const metadata: Metadata = {
  title: "MACHINE MINDS | Parivartan 2026 CTF",
  description:
    "THINK. DECODE. CONQUER. — Capture The Flag competition at Parivartan 2026",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${body.variable} ${label.variable} ${display.variable} ${stencil.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
