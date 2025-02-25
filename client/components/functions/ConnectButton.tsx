"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { UserInterface } from "@/types";
import { useRole } from "@/app/_contexts/roleContext";
import { useRouter } from "next/navigation";

export default function LoginButton() {
    const [userData, setUserData] = useState<UserInterface | null>(null);
    const { login: roleLogin, roleLogout, role } = useRole();
    const router = useRouter()


    useEffect(() => {
        const email = localStorage.getItem("email")
        if (email) {
            setUserData({ email: email, role: "reader" })
            roleLogin(userData?.role, email)
        }
    }, []);

    const handleLogout = () => {
        roleLogout()
        localStorage.removeItem("email")
        router.push("/");
    };

    useEffect(() => {
        if (userData?.email) {
            getUser();
        }
    }, [userData?.email]);

    const getUser = async () => {
        const response = await fetch(`/api/getUser?email=${userData?.email}`);
        const data = await response.json();
        if (data.user) {
            setUserData(data.user);
            console.log(userData);
        }
    };

    const handleLogin = async () => {
        roleLogin(userData?.role, userData?.email);
        if (!role) {
            router.push("/setup");
        } else {
            router.push("/");
        }
    }

    if (!userData?.email) {
        return (
            <Button 
                onClick={() => handleLogin()}
                className="w-full sm:w-auto text-sm sm:text-base px-2 sm:px-4"
            >
                Get Started
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="default" 
                    className="justify-between w-auto sm:w-auto text-sm sm:text-base px-2 sm:px-4"
                >
                    {userData?.alias}
                    <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 opacity-50 ml-1 sm:ml-2" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                align="end" 
                className="w-auto"
            >
                <DropdownMenuItem className="flex-col items-start sm:px-4 sm:pt-3">
                    <div className="font-bold text-sm sm:text-base">Role: {userData ? userData.role ?? "Error" : "No Role Set"}</div>
                </DropdownMenuItem>
                <DropdownMenuItem 
                    className="cursor-pointer text-sm sm:text-base" 
                >
                    <Button variant="noShadow" onClick={handleLogout} className="text-sm sm:text-base w-full bg-white">
                        Logout
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
