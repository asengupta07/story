import type { PrivyClientConfig } from '@privy-io/react-auth';

// Replace this with your Privy config
export const privyConfig: PrivyClientConfig = {
    embeddedWallets: {
        createOnLogin: 'users-without-wallets',
        requireUserPasswordOnCreate: true,
        showWalletUIs: true,
    },
    loginMethods: ['wallet', 'email', 'google'],
    appearance: {
        showWalletLoginFirst: true,
        walletList: ['metamask', 'rainbow', 'wallet_connect'],
        walletChainType: 'ethereum-only',
        theme: 'dark',
    },
};