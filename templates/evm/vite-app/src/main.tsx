import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { TrezoProvider } from "./config/evm.config.ts"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <TrezoProvider>
        <App />
      </TrezoProvider>
    </ThemeProvider>
  </StrictMode>
)
