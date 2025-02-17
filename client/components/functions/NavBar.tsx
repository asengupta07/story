"use client";
import type React from "react";
import { NotebookPen } from "lucide-react";
import Link from "next/link";
import LoginButton from "@/components/functions/ConnectButton";
import { ModeToggle } from "@/components/theme/themeSwitcher";

export default function NavBar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b-2 border-border bg-bg h-20 flex items-center">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/">
                    <div className="flex items-center gap-2">
                        <NotebookPen className="h-6 w-6 dark:text-purple-400 text-purple-600" />
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 dark:from-purple-400 to-black dark:to-white bg-clip-text text-transparent">StoryBoard</span>
                    </div>
                </Link>
                <nav className="hidden md:flex gap-6 items-center">
                    <Link
                        href="#features"
                        className="text-lg font-medium hover:text-primary transition duration-300 ease-in-out transform hover:scale-110"
                    >
                        Features
                    </Link>
                    <Link
                        href="#creators"
                        className="text-lg font-medium hover:text-primary transition duration-300 ease-in-out transform hover:scale-110"
                    >
                        Creators
                    </Link>
                    <Link
                        href="#readers"
                        className="text-lg font-medium hover:text-primary transition duration-300 ease-in-out transform hover:scale-110"
                    >
                        Readers
                    </Link>
                    <Link
                        href="#tokens"
                        className="text-lg font-medium hover:text-primary transition duration-300 ease-in-out transform hover:scale-110"
                    >
                        $STORY Tokens
                    </Link>
                </nav>
                <div className="flex items-center gap-3">
                    <ModeToggle />
                    <LoginButton />
                </div>
            </div>
        </header>
    );
}