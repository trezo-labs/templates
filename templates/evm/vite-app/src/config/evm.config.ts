import { Chains, create } from "@trezo/evm";
import { contractAbi, contractAddress } from "./contract.config";

export const evmConfig = create({
  address: contractAddress,
  abi: contractAbi,
  chains: [Chains.optimismSepolia, Chains.optimism],
  rpcUrls: {
    11155420: "https://optimism-sepolia-public.nodies.app", // optimismSepolia chainId
  },
  wallet: {
    from: "family",
    options: {
      projectId: import.meta.env.VITE_WC_PROJECT_ID as string,
      appInfo: {
        name: "Trezo",
      },
    },
  },
});
