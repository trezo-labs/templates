import { Chains, create } from "@trezo/evm"
import { contractAbi, contractAddress } from "./contract.config"

export const useConfig = create({
  address: contractAddress,
  abi: contractAbi,
  chains: [Chains.optimismSepolia, Chains.optimism, Chains.mainnet],
  rpcUrls: {
    11155420: "https://optimism-sepolia-public.nodies.app", // optimismSepolia chainId
  },
  modalConfig: {
    from: "family",
    options: {
      projectId: process.env.NEXT_APP_WC_PROJECT_ID as string,
      appInfo: {
        name: "Trezo",
      },
    },
  },
})

export const TrezoProvider = useConfig.Provider
export const ConnectButton = useConfig.ConnectButton
