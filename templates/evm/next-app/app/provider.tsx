"use client"
import { EvmProvider } from "@trezo/evm/react"

import { evmConfig } from "@/config/evm.config"
import { ThemeProvider } from "@/components/theme-provider"

export default function Provider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ThemeProvider>
      <EvmProvider config={evmConfig}>{children}</EvmProvider>
    </ThemeProvider>
  )
}
