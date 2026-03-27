"use client"
import { ThemeProvider } from "@/components/theme-provider"
import { TrezoProvider } from "@/config/evm.config"

export default function Provider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ThemeProvider>
      <TrezoProvider>{children}</TrezoProvider>
    </ThemeProvider>
  )
}
