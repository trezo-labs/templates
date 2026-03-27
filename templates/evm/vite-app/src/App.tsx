import { DemoComponent } from "./components/demo-comp"

function App() {
  return (
    <section className="flex min-h-svh w-full max-w-sm flex-col gap-6 p-6 text-sm leading-loose">
      <header className="space-y-1">
        <h1 className="text-lg leading-normal font-semibold">
          Project is ready!
        </h1>
        <a
          href="https://console.optimism.io/faucet"
          target="_blank"
          className="text-muted-foreground hover:text-foreground hover:underline"
        >
          Click here to get OP Sepolia faucet to demo dApp.
        </a>
      </header>

      <main className="max-w-xs border-y py-6">
        <DemoComponent />
      </main>

      <footer className="space-y-1">
        <p className="font-mono text-xs text-muted-foreground">
          [ Press <kbd>d</kbd> to toggle dark mode ]
        </p>
      </footer>
    </section>
  )
}

export default App
