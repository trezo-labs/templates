import { StarknetChains, create } from "@trezo/strk";
import { contractAbi, contractAddress } from "./contract.config";

const infuraApiKey = import.meta.env.VITE_INFURA_API_KEY as string;

export const useConfig = create({
  address: contractAddress,
  abi: contractAbi,
  chains: [StarknetChains.sepolia],
  // rpcUrls: {
  //   sepolia: `https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_10/${infuraApiKey}`,
  //   mainnet: `https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_10/${infuraApiKey}`,
  // },
  modalConfig: {
    from: "starknetReact",
    options: {
      includeRecommended: "always",
      recommended: ["argent", "braavos"],
    },
  },
});

export const Provider = useConfig.Provider;
export const ConnectButton = useConfig.ConnectButton;
