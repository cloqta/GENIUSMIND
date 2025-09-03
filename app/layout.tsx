import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { QueryProvider } from "@/providers/query-provider"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Marcal — Marketing Calendar",
  description: "Plan, collaborate, and execute your marketing campaigns across month, week, day, and year views.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <QueryProvider>{children}</QueryProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
