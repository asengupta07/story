"use client"

import { useState, useEffect } from "react"
import { usePrivy } from "@privy-io/react-auth"
import { useAccount, useDisconnect } from "wagmi"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { useBalance } from 'wagmi'
import { polygonAmoy } from "viem/chains";
import { formatEther } from "viem"

export default function LoginButton() {
    const { ready, authenticated, login, logout } = usePrivy()
    const [userAddress, setUserAddress] = useState<string | null>(null)
    const { address } = useAccount()
    const { disconnect } = useDisconnect()
    const balance = useBalance({
        address: address,
        chainId: polygonAmoy.id,
    })

    useEffect(() => {
        if (address) {
            setUserAddress(address)
        }
    }, [address])

    const handleLogout = () => {
        logout()
        disconnect()
        setUserAddress(null)
    }

    const truncateAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`
    }

    if (!ready || !authenticated || !userAddress) {
        return <Button onClick={login}>Connect Wallet</Button>
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="default" className="justify-between">
                    {truncateAddress(userAddress)}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex-col items-start">
                    <div className="font-medium">Balance</div>
                    <div className="text-xs text-muted-foreground">{balance.data?.value ? Number(formatEther(balance.data.value)).toFixed(3) : 0} {balance.data?.symbol}</div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex-col items-start">
                    <div className="font-medium">Role</div>
                    <div className="text-xs text-muted-foreground">User</div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>Disconnect</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

