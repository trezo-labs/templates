import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { Provider } from "@trezo/evm/react";
import { evmConfig } from "./config/evm.config.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <Provider config={evmConfig}>
        <App />
      </Provider>
    </ThemeProvider>
  </StrictMode>,
);
