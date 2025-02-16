"use client";

import { usePrivy } from '@privy-io/react-auth';
import { useAccount, useDisconnect } from 'wagmi';

export default function LoginButton() {
    const { ready, authenticated, login, logout } = usePrivy();
    const { address } = useAccount();
    const { disconnect } = useDisconnect();
    let enableLogout = !ready || (ready && authenticated);

    function handleLogout() {
        logout();
        disconnect();
        enableLogout = false;
    }

    return (
        <>
            <button onClick={!enableLogout ? login : handleLogout}>
                {!enableLogout ? "Log in": "Disconnect"}
            </button>
            <button onClick={() => console.log('address', address)}>
                Log address
            </button>
        </>
    );
}