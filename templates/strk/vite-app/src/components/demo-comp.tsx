import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ConnectButton, useConfig } from "@/config/strk.config";
import { Info } from "lucide-react";

export const DemoComponent = () => {
  const { call, wallet } = useConfig();
  const [count, setCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const fetchCount = async () => {
    try {
      const { data, error } = await call.queryFn("get_counter", []);
      if (error) {
        console.log(error.raw);
        setError(error.message);
        throw new Error(error.message);
      }
      setCount(Number(data));
    } catch (error) {
      console.error(error);
    }
  };

  const incCount = async () => {
    try {
      const { data, error } = await call.mutateFn("increase_counter", [
        BigInt(1),
      ]);
      if (error) {
        console.log(error.raw);
        setError(error.message);
        throw new Error(error.message);
      }
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const decCount = async () => {
    try {
      const { data, error } = await call.mutateFn("decrease_counter", [
        BigInt(1),
      ]);
      if (error) {
        console.log(error.raw);
        setError(error.message);
        throw new Error(error.message);
      }
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  // ===== Effects =====

  useEffect(() => {
    // Don't fetch if wallet is still reconnecting
    if (wallet.account.isConnecting) return;

    queueMicrotask(() => {
      fetchCount();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet.account.address, wallet.account.isConnecting]);

  return (
    <div className="space-y-2">
      <ConnectButton>
        {({ isConnected, truncatedAddress, open, isConnecting }) => (
          <Button
            onClick={() => open()}
            isLoading={!isConnected ? isConnecting : false}
            loadingText="Please wait..."
          >
            {isConnected ? truncatedAddress : "Connect"}
          </Button>
        )}
      </ConnectButton>
      <hr />

      <div className="flex items-center gap-4">
        <Button onClick={incCount}>Increment by 1</Button>
        <p>{count}</p>
        <Button onClick={decCount}>Decrement by 1</Button>
      </div>

      {error && (
        <>
          <hr />
          <div className="flex items-center gap-1.5 text-xs text-destructive">
            <Info size={14} />
            {error}
          </div>
        </>
      )}
    </div>
  );
};
