import { cn } from "@/lib/utils"
import { Geist, Geist_Mono } from "next/font/google"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const fontVariable = (className: string) =>
  cn(fontSans.variable, fontMono.variable, className)
