"use client";

import { Button } from "@/components/ui/button";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";

export default function LoginButton() {
  const { ready, authenticated, login, logout } = usePrivy();
  const [userAddress, setUserAddress] = useState<string | null>("");
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  let enableLogout = !ready || (ready && authenticated);

  function handleLogout() {
    logout();
    disconnect();
    enableLogout = false;
  }

  useEffect(() => {
    if (address) {
      console.log("address", userAddress);
    }
  }, [userAddress, address]);

  return (
    <>
      <Button
        onClick={() => {
          if (!enableLogout) {
            login();
          } else {
            handleLogout();
          }
          setUserAddress(address ?? null);
        }}
      >
        {!enableLogout ? "Connect Wallet" : "Disconnect"}
      </Button>
      {/* <Button onClick={() => console.log("address", address)}>
        Log address
      </Button> */}
    </>
  );
}
