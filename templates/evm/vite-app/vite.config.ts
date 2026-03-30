import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { trezoVitePlugin } from "@trezo/evm"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), trezoVitePlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
