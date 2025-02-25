"use client";
import type React from "react";
import { NotebookPen, Menu, X } from "lucide-react";
import Link from "next/link";
import LoginButton from "@/components/functions/ConnectButton";
import { ModeToggle } from "@/components/theme/themeSwitcher";
import { useState, useEffect } from "react";
import { UserInterface } from "@/types";

export default function NavBar() {
    const [role, setRole] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [userData, setUserData] = useState<UserInterface | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const email = localStorage.getItem("email")
        if (email) {
            setUserEmail(email);
        }
    }, []);

    useEffect(() => {
        if (userEmail) {
            getUser();
        }
    }, [userEmail]);

    const getUser = async () => {
        const response = await fetch(`/api/getUser?email=${userEmail}`);
        const data = await response.json();
        if (data.user) {
            setUserData(data.user);
            setRole(data.user.role);
            console.log(userData);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b-8 dark:border-b-4 border-border dark:bg-bg bg-violet-200 min-h-20 flex items-center">
            <div className="container px-4 py-2 flex items-center justify-between">
                <Link href="/" className="hidden md:block">
                    <div className="flex items-center gap-2">
                        <NotebookPen className="h-6 w-6 dark:text-purple-400 text-purple-600" />
                        <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 dark:from-purple-400 to-black dark:to-white bg-clip-text text-transparent">StoryBoard</span>
                    </div>
                </Link>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 pr-0"
                    onClick={toggleMenu}
                    aria-label="Toggle Menu"
                >
                    {isMenuOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>
                <Link href="/" className="md:hidden">
                    <div className="flex items-center gap-2">
                        <NotebookPen className="h-6 w-6 dark:text-purple-400 text-purple-600" />
                        <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 dark:from-purple-400 to-black dark:to-white bg-clip-text text-transparent">StoryBoard</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex gap-10 items-center">
                    <Link
                        href="/creator/dashboard"
                        className="text-lg font-bold hover:text-primary transition duration-300 ease-in-out transform hover:scale-110"
                    >
                        Your Stories
                    </Link>
                    <Link
                        href="/creator/create"
                        className="text-lg font-bold hover:text-primary transition duration-300 ease-in-out transform hover:scale-110"
                    >
                        Create a Story
                    </Link>
                    <Link
                        href="/reader/dashboard"
                        className="text-lg font-bold hover:text-primary transition duration-300 ease-in-out transform hover:scale-110"
                    >
                        Read Stories
                    </Link>
                    <Link
                        href="/upcoming"
                        className="text-lg font-bold hover:text-primary transition duration-300 ease-in-out transform hover:scale-110"
                    >
                        Upcoming Features
                    </Link>
                    {/* <Link
                        href="/brand/dashboard"
                        className="text-lg font-bold hover:text-primary transition duration-300 ease-in-out transform hover:scale-110"
                    >
                        Brands
                    </Link>
                    <Link
                        href="/token"
                        className="text-lg font-bold hover:text-primary transition duration-300 ease-in-out transform hover:scale-110"
                    >
                        $STORY Tokens
                    </Link> */}
                </nav>

                {/* Mobile Navigation */}
                <div 
                    className={`absolute top-20 left-0 right-0 bg-violet-200 dark:bg-bg md:hidden border-b-2 border-border transform transition-all duration-300 ease-in-out ${
                        isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0 pointer-events-none'
                    }`}
                >
                    <nav className="flex flex-col items-center p-4 gap-6">
                        <Link
                            href="/creator/dashboard"
                            className="w-full text-lg font-bold relative active:scale-95 transition-transform px-4 py-3 rounded-lg bg-gradient-to-r from-transparent to-transparent bg-[size:200%] bg-right hover:bg-left active:bg-left duration-300"
                            onClick={toggleMenu}
                            style={{
                                backgroundImage: 'linear-gradient(to right, rgba(147, 51, 234, 0.1), transparent)'
                            }}
                        >
                            <span className="relative z-10">Your Stories</span>
                        </Link>
                        <Link
                            href="/creator/create"
                            className="w-full text-lg font-bold relative active:scale-95 transition-transform px-4 py-3 rounded-lg bg-gradient-to-r from-transparent to-transparent bg-[size:200%] bg-right hover:bg-left active:bg-left duration-300"
                            onClick={toggleMenu}
                            style={{
                                backgroundImage: 'linear-gradient(to right, rgba(147, 51, 234, 0.1), transparent)'
                            }}
                        >
                            <span className="relative z-10">Create a Story</span>
                        </Link>
                        <Link
                            href="/reader/dashboard"
                            className="w-full text-lg font-bold relative active:scale-95 transition-transform px-4 py-3 rounded-lg bg-gradient-to-r from-transparent to-transparent bg-[size:200%] bg-right hover:bg-left active:bg-left duration-300"
                            onClick={toggleMenu}
                            style={{
                                backgroundImage: 'linear-gradient(to right, rgba(147, 51, 234, 0.1), transparent)'
                            }}
                        >
                            <span className="relative z-10">Read Stories</span>
                        </Link>
                        <Link
                            href="/upcoming"
                            className="w-full text-lg font-bold relative active:scale-95 transition-transform px-4 py-3 rounded-lg bg-gradient-to-r from-transparent to-transparent bg-[size:200%] bg-right hover:bg-left active:bg-left duration-300"
                            onClick={toggleMenu}
                        >
                            <span className="relative z-10">Upcoming Features</span>
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    {/* <ModeToggle /> */}
                    <LoginButton />
                </div>
            </div>
        </header>
    );
}
