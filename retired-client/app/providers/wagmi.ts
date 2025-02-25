"use client";

import { createConfig } from "@privy-io/wagmi";
import { mainnet, sepolia, polygonAmoy } from "viem/chains";
import { http } from "wagmi";

export const config = createConfig({
  chains: [mainnet, sepolia, polygonAmoy], // Pass your required chains as an array
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygonAmoy.id]: http(),
  },
});
