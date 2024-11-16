import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
  arbitrumSepolia,
} from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "BooMarket",
  projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID as string,
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [sepolia, arbitrumSepolia] : []),
  ],
  ssr: true,
});
