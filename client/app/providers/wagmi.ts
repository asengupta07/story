"use client";

import { createConfig } from '@privy-io/wagmi';
import { mainnet, sepolia, polygonAmoy } from 'viem/chains';
import { http } from 'wagmi';

// const isClient = typeof window !== "undefined";

// export const config = createConfig({
//   chains,
//   connectors: [
//     coinbaseWallet({
//       appName: 'AltNode',
//     }),
//   ],
//   storage: createStorage({
//     storage: isClient ? window.localStorage : undefined,
//   }),
//   transports: {
//     [sepolia.id]: http(),
//     [mainnet.id]: http(),
//     [baseSepolia.id]: http(),
//     [polygonAmoy.id]: http(),
//     [arbitrumSepolia.id]: http(),
//   },
//   ssr: false,
// });

export const config = createConfig({
    chains: [mainnet, sepolia, polygonAmoy], // Pass your required chains as an array
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        [polygonAmoy.id]: http(),
    },
});
