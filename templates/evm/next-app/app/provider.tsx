"use client"
import { Provider as TrezoProvider } from "@trezo/evm/react"

import { evmConfig } from "@/config/evm.config"
import { ThemeProvider } from "@/components/theme-provider"

export default function Provider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ThemeProvider>
      <TrezoProvider config={evmConfig}>{children}</TrezoProvider>
    </ThemeProvider>
  )
}
