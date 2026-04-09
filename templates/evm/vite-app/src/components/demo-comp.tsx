import { ConnectButton } from "@trezo/evm/react";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Kbd } from "./ui/kbd";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { useConfig } from "@/config/evm.config";
import { AnimatedNumber } from "./ui/animated-number";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Field, FieldGroup, FieldLabel, FieldSet } from "./ui/field";

type LogType = "error" | "success" | "event" | "info";
type FormattedLog = {
  id: string;
  message: string;
  timestamp: string;
  type: LogType;
};

type ExecuteOptions<T = unknown> = {
  type: "read" | "write";
  fn: string;
  args?: unknown[];
  loadingKey?: "increment" | "incrementBy" | "reset";
  onSuccess?: (data: T) => void;
  successMessage?: string;
};

export const DemoComponent = () => {
  const { call, wallet } = useConfig();

  const [value, setValue] = useState<number>(0);
  const [incrementInput, setIncrementInput] = useState("");
  const [increment, setIncrement] = useState<number>(0);

  const [ownerAddress, setOwnerAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<
    "increment" | "incrementBy" | "reset" | null
  >(null);
  const [logs, setLogs] = useState<FormattedLog[]>([]);
  const [maxCount, setMaxCount] = useState<number>(0);

  /* ---------------- EXECUTE ---------------- */

  async function execute<T = unknown>({
    type,
    fn,
    args = [],
    loadingKey,
    onSuccess,
    successMessage,
  }: ExecuteOptions<T>) {
    if (loadingKey) setIsLoading(loadingKey);

    try {
      const res =
        type === "read"
          ? await call.queryFn(
              fn as
                | "MAX_CALLS"
                | "MAX_COUNT"
                | "WINDOW"
                | "callCount"
                | "getCount"
                | "lastReset"
                | "owner",
              args as unknown as readonly [],
            )
          : await call.mutateFn(
              fn as "increment" | "incrementBy" | "reset",
              args as unknown as readonly [bigint],
            );

      if (res.error) {
        addLog("error", `${res.error.raw}`);
        console.log(res.error.raw);
        return;
      }

      if (successMessage) addLog("success", successMessage);

      onSuccess?.(res.data as T);
    } catch {
      addLog("error", "Unexpected error occurred");
    } finally {
      if (loadingKey) setIsLoading(null);
    }
  }

  /* ---------------- LOG ---------------- */

  function addLog(type: LogType, message: string) {
    setLogs((prev) =>
      [
        {
          id: crypto.randomUUID(),
          message,
          timestamp: new Date().toLocaleTimeString(),
          type,
        },
        ...prev,
      ].slice(0, 50),
    );
  }

  /* ---------------- DERIVED ---------------- */

  const remaining = Math.max(0, maxCount - value);

  /* ---------------- ACTIONS ---------------- */

  function handleIncrement() {
    execute({
      type: "write",
      fn: "increment",
      loadingKey: "increment",
    });
  }

  function handleIncrementBy(e?: React.FormEvent) {
    e?.preventDefault();

    execute({
      type: "write",
      fn: "incrementBy",
      args: [BigInt(increment)],
      loadingKey: "incrementBy",
      onSuccess: () => {
        setIncrementInput("");
        setIncrement(0);
      },
    });
  }

  function handleReset() {
    execute({
      type: "write",
      fn: "reset",
      loadingKey: "reset",
    });
  }

  /* ---------------- INPUT VALIDATION ---------------- */

  useEffect(() => {
    const timer = setTimeout(() => {
      const parsed = Number(incrementInput);
      if (isNaN(parsed)) return;

      if (parsed <= 0) {
        setIncrement(0);
        return;
      }

      if (parsed > remaining) {
        setIncrement(remaining);
        return;
      }

      setIncrement(parsed);
    }, 100);

    return () => clearTimeout(timer);
  }, [incrementInput, remaining]);

  /* ---------------- FETCH ---------------- */

  function fetchAll() {
    execute<bigint>({
      type: "read",
      fn: "getCount",
      onSuccess: (d) => setValue(Number(d)),
    });

    execute<string>({
      type: "read",
      fn: "owner",
      onSuccess: setOwnerAddress,
    });

    execute<bigint>({
      type: "read",
      fn: "MAX_COUNT",
      onSuccess: (d) => setMaxCount(Number(d)),
    });
  }

  useEffect(() => {
    fetchAll();
  }, []);

  /* ---------------- EVENTS ---------------- */

  useEffect(() => {
    const short = (a: string) => `${a.slice(0, 6)}...${a.slice(-4)}`;

    const offReset = call.listenFn("CountReset", (caller, prev) => {
      addLog(
        "event",
        `${short(caller)} reset (${Number(prev).toLocaleString()})`,
      );
      setValue(0);
    });

    const offInc = call.listenFn("Incremented", (caller, amt, next) => {
      addLog(
        "success",
        `${short(caller)} +${Number(amt).toLocaleString()} → ${Number(next).toLocaleString()}`,
      );
      setValue(Number(next));
    });

    return () => {
      offReset();
      offInc();
    };
  }, []);

  /* ---------------- UI ---------------- */

  return (
    <React.Fragment>
      <header className="px-6 py-8 sticky top-0 left-0 w-full z-50 flex flex-col gap-6 backdrop-blur-2xl">
        <nav className="flex items-center max-w-7xl mx-auto w-full size-full justify-between">
          <a
            href="https://trezosite.vercel.app"
            target="_blank"
            className="flex items-center gap-3"
          >
            <p className="text-xs uppercase font-medium">[ Trezo Demo ]</p>
            <Badge>@trezo/evm</Badge>
          </a>

          <ConnectButton>
            {(props) => {
              const isLoading = !props.isConnected && props.isConnecting;

              return (
                <Button
                  isLoading={isLoading}
                  loadingText="Connecting..."
                  onClick={() => props.open()}
                >
                  {props.isConnected ? props.truncatedAddress : "Connect"}
                </Button>
              );
            }}
          </ConnectButton>
        </nav>

        <section className="flex flex-wrap gap-2 mx-auto w-full justify-between max-w-5xl">
          <a
            href="https://console.optimism.io/faucet"
            target="_blank"
            className="text-xs uppercase font-medium text-muted-foreground hover:text-foreground hover:underline transition-colors"
          >
            [ Click to get test tokens ]
          </a>

          <p className="text-xs uppercase text-muted-foreground font-medium">
            [ Toggle theme with letter <Kbd className="text-[10px]">d</Kbd> key
            ]
          </p>
        </section>
      </header>

      <main className="py-10 px-6 grid md:grid-cols-2 gap-16 md:gap-4 max-w-4xl w-full mx-auto">
        <div className="flex flex-col h-max md:max-h-[630px] justify-between gap-4 md:sticky md:top-40">
          {/* Count */}
          <Card className="h-max md:mt-4 bg-background!">
            <CardHeader>
              <div className="bg-background -mt-10 md:-mt-12 w-max">
                <AnimatedNumber
                  className="text-4xl md:text-5xl font-medium origin-bottom-left"
                  value={value}
                />
              </div>
            </CardHeader>
          </Card>

          {/* Increment */}
          <Card>
            <CardHeader>
              <form onSubmit={handleIncrementBy}>
                <FieldGroup>
                  <FieldSet>
                    <Field>
                      <FieldLabel htmlFor="increment">
                        Increment Count
                      </FieldLabel>

                      <div className="flex items-center gap-2">
                        <Input
                          id="increment"
                          type="number"
                          value={incrementInput}
                          onChange={(e) => setIncrementInput(e.target.value)}
                          placeholder="Enter amount"
                          min={0}
                          disabled={
                            !wallet.account.isConnected ||
                            isLoading === "incrementBy"
                          }
                        />

                        <Button
                          variant="outline"
                          type="submit"
                          isLoading={isLoading === "incrementBy"}
                          disabled={!wallet.account.isConnected}
                        >
                          <span>Increment</span>
                        </Button>

                        <Separator
                          orientation="vertical"
                          className="mx-2 h-5 mt-1.5!"
                        />

                        <Button
                          type="button"
                          isLoading={isLoading === "increment"}
                          disabled={!wallet.account.isConnected}
                          onClick={handleIncrement}
                        >
                          <span>+ 1</span>
                        </Button>
                      </div>
                    </Field>
                  </FieldSet>
                </FieldGroup>
              </form>
            </CardHeader>
          </Card>

          {/* Code note */}
          <Card className="py-4!">
            <CardHeader>
              <div className="flex flex-col gap-1.5">
                <p className="font-medium text-foreground mb-2">
                  How this works
                </p>
                <p className="text-xs text-muted-foreground">
                  <code className="text-primary">
                    <a
                      target="_blank"
                      className="hover:underline text-primary"
                      href="https://trezosite.vercel.app/docs/packages/evm#read-from-contract-queryfn"
                    >
                      call.queryFn
                    </a>
                  </code>{" "}
                  reads <strong className="text-foreground">getCount</strong>{" "}
                  and <strong className="text-foreground">owner</strong>
                </p>
                <p className="text-xs text-muted-foreground">
                  <code className="text-primary">
                    <a
                      target="_blank"
                      className="hover:underline text-primary"
                      href="https://trezosite.vercel.app/docs/packages/evm#write-to-contract-mutatefn"
                    >
                      call.mutateFn
                    </a>
                  </code>{" "}
                  pre-sims before opening MetaMask
                </p>
                <p className="text-xs text-muted-foreground">
                  <code className="text-primary">
                    <a
                      target="_blank"
                      className="hover:underline text-primary"
                      href="https://trezosite.vercel.app/docs/packages/evm#listen-to-events-listenfn"
                    >
                      call.listenFn
                    </a>
                  </code>{" "}
                  streams{" "}
                  <strong className="text-foreground">Incremented</strong> and{" "}
                  <strong className="text-foreground">CountReset</strong> events
                  live
                </p>
              </div>
            </CardHeader>
          </Card>

          <div className="flex items-center gap-6">
            <Separator className="flex-1" />
            <span className="text-sm text-muted-foreground">
              Contract Owner
            </span>
            <Separator className="flex-1" />
          </div>

          {/* Owner */}
          <Card className="py-4!">
            <CardHeader>
              <p className="text-foreground text-sm truncate">
                <span>{ownerAddress ?? "0x.."}</span>
              </p>
            </CardHeader>
          </Card>

          {/* Reset counter */}
          <Card className="py-4!">
            <CardHeader>
              <Button
                size="lg"
                variant="destructive"
                onClick={handleReset}
                disabled={!wallet.account.isConnected}
                isLoading={isLoading === "reset"}
                loadingText="Resetting, please wait..."
              >
                <span>Reset counter (owner only)</span>
              </Button>
            </CardHeader>
          </Card>
        </div>

        <Card className="max-h-[532px] flex-1">
          <CardContent className="h-full overflow-y-auto">
            <motion.div
              layout
              transition={{
                layout: { type: "spring", stiffness: 260, damping: 25 },
              }}
              className="flex flex-col gap-[7px] font-mono"
            >
              <AnimatePresence initial={false}>
                {logs.length === 0 ? (
                  <motion.p
                    layout
                    transition={{
                      layout: { type: "spring", stiffness: 260, damping: 25 },
                    }}
                    className="text-xs font-medium text-muted-foreground uppercase"
                  >
                    [ Events and results will appear here... ]
                  </motion.p>
                ) : (
                  logs.map((entry) => (
                    <motion.div
                      key={entry.id}
                      layout="position"
                      initial={{ opacity: 0, y: -10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                      className={cn(
                        "flex gap-3 rounded-sm px-3 py-2 border-l-2",
                        {
                          "bg-[rgba(248,113,113,0.08)] border-destructive":
                            entry.type === "error",
                          "bg-[rgba(74,222,128,0.08)] border-green-500":
                            entry.type === "success",
                          "bg-[rgba(124,111,247,0.08)] border-violet-500":
                            entry.type === "event",
                          "bg-secondary border-foreground":
                            entry.type === "info",
                        },
                      )}
                    >
                      <span className="text-[11px] text-muted-foreground mt-px">
                        {entry.timestamp}
                      </span>
                      <span
                        className={cn("text-xs break-all", {
                          "text-destructive": entry.type === "error",
                          "text-green-500": entry.type === "success",
                          "text-violet-500": entry.type === "event",
                          "text-foreground": entry.type === "info",
                        })}
                      >
                        {entry.message}
                      </span>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </motion.div>
          </CardContent>
        </Card>
      </main>
    </React.Fragment>
  );
};
