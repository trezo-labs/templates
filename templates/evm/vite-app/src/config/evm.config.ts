import { Chains, create } from "@trezo/evm";
import { contractAbi, contractAddress } from "./contract.config";

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
      projectId: import.meta.env.VITE_WC_PROJECT_ID as string,
      appInfo: {
        name: "Trezo",
      },
    },
  },
});

export const Provider = useConfig.Provider;
export const ConnectButton = useConfig.ConnectButton;
