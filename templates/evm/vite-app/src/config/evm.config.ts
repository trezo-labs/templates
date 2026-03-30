import { create, Chains } from "@trezo/evm"
import { contractAbi, contractAddress } from "./contract.config"

export const config = create({
  address: contractAddress,
  abi: contractAbi,
  chains: [Chains.optimismSepolia, Chains.optimism, Chains.mainnet],
  rpcUrls: {
    11155420: "https://optimism-sepolia-public.nodies.app", // optimismSepolia chainId
  },
  modalConfig: {
    from: "family",
    options: {
      projectId: import.meta.env.VITE_WC_PROJECT_ID as string,
      appInfo: {
        name: "Trezo",
      },
    },
  },
  // modalConfig: {
  //   from: "reown",
  //   options: {
  //     projectId: import.meta.env.VITE_WC_PROJECT_ID as string,
  //     metadata: {
  //       name: "Trezo",
  //       description: "",
  //       icons: [""],
  //       url: "",
  //     },
  //   },
  // },
})

export const TrezoProvider = config.Provider
export const ConnectButton = config.ConnectButton
