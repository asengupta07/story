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
                <div className="flex items-center gap-2">
                    <NotebookPen className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold">StoryBoard</span>
                </div>
                <nav className="hidden md:flex gap-6 items-center">
                    <Link
                        href="#features"
                        className="text-sm font-medium hover:text-primary"
                    >
                        Features
                    </Link>
                    <Link
                        href="#creators"
                        className="text-sm font-medium hover:text-primary"
                    >
                        Creators
                    </Link>
                    <Link
                        href="#readers"
                        className="text-sm font-medium hover:text-primary"
                    >
                        Readers
                    </Link>
                    <Link
                        href="#tokens"
                        className="text-sm font-medium hover:text-primary"
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