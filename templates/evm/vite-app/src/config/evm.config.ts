import { create, EvmChains } from "@trezo/evm"
import { contractAbi, contractAddress } from "./contract.config"

const { optimismSepolia } = EvmChains

export const config = create({
  address: contractAddress,
  abi: contractAbi,
  chains: [optimismSepolia],
  rpcUrl: "https://optimism-sepolia-public.nodies.app",
  kit: {
    name: "connectkit",
    config: {
      projectId: import.meta.env.VITE_WC_PROJECT_ID as string,
      metadata: {
        appName: "Trezo",
        appUrl: "http://trezosite.vercel.app",
      },
    },
  },
})

export const TrezoProvider = config.Provider
export const ConnectButton = config.ConnectButton
