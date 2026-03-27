import { Metadata } from "next"

import "./globals.css"
import Provider from "./provider"
import { fontVariable } from "@/fonts"

export const metadata: Metadata = {
  title: "Trezo Next App",
  icons: {
    shortcut: "/favicon_dark/favicon.ico",
    icon: [
      {
        url: "/favicon_light/favicon.ico",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon_dark/favicon.ico",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: [
      {
        url: "/favicon_light/apple-touch-icon.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon_dark/apple-touch-icon.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={fontVariable("font-sans antialiased")}>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
