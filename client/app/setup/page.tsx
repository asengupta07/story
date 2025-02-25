"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import { Sparkles, Pencil, Book, Building2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NavBar from "@/components/functions/NavBar"
import { useRouter } from "next/navigation"

export default function UserAuth() {
    const [username, setUsername] = useState("")
    const [selectedRole, setSelectedRole] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const [password, setPassword] = useState<string | null>(null)
    const router = useRouter()

    const roles = [
        { name: "Creator", icon: Pencil, description: "Creators are the imaginative minds behind captivating stories and innovative ideas. They are the storytellers and ideators who bring narratives to life, engaging audiences with their creativity and vision." },
        { name: "Reader", icon: Book, description: "Readers are the enthusiastic audience who immerse themselves in the world of stories. They are the storyreaders who enjoy exploring different narratives, making choices, and experiencing the journey crafted by creators." },
        { name: "Brand", icon: Building2, description: "Brands are entities looking to collaborate with engaging writers for promotional opportunities. They propose brand deals to creators, aiming to leverage the storytelling platform to reach a wider audience and create impactful marketing campaigns." },
    ]

    useEffect(() => {
        const email = localStorage.getItem("email")
        if (email) {
            setUserEmail(email)
            getUser(email);
        }
    }, [])

    const getUser = async (email: string) => {
        const response = await fetch(`/api/getUser?email=${email}`);
        const data = await response.json();
        if (data.user) {
            if (data.user.role) {
                router.push(`/${data.user.role.toLowerCase()}/dashboard`);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        const send = {
            email: userEmail,
            alias: username,
            role: selectedRole,
            password: password
        }

        const res = await fetch("/api/createUser", {
            method: "POST",
            body: JSON.stringify(send),
            headers: {
                "Content-Type": "application/json",
            },
        })
        const data = await res.json()
        console.log(data)
        if (data.success) {
            setTimeout(() => {
                getUser(data.user.email);
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                })
            }, 2000)
            localStorage.setItem("email", data.user.email)
        }
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        const send = {
            email: userEmail,
            password: password
        }

        const res = await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify(send),
            headers: {
                "Content-Type": "application/json",
            },
        })
        const data = await res.json()
        if (data.success) {
            localStorage.setItem("email", data.user.email)
            router.push(`/${data.user.role.toLowerCase()}/dashboard`)
        }
        setIsSubmitting(false)
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <NavBar />
            <div className="flex items-center justify-center p-4 w-full">
                <Card className="w-full my-11 max-w-3xl mx-4 sm:mx-auto">
                    <CardContent className="p-2 sm:p-6">
                        <Tabs defaultValue="register" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="register">Register</TabsTrigger>
                                <TabsTrigger value="login">Login</TabsTrigger>
                            </TabsList>

                            <TabsContent value="register">
                                <h1 className="text-3xl font-bold text-center mb-6">Join the Fun!</h1>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label htmlFor="register-email" className="text-sm font-medium">
                                            Create your email
                                        </label>
                                        <div className="relative">
                                            <Input
                                                id="register-email"
                                                type="email"
                                                placeholder="yourname@email.com"
                                                value={userEmail || ""}
                                                onChange={(e) => setUserEmail(e.target.value)}
                                                className="pr-10"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="username" className="text-sm font-medium">
                                            Create your awesome username
                                        </label>
                                        <div className="relative">
                                            <Input
                                                id="username"
                                                type="text"
                                                placeholder="SuperCoolUser123"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                className="pr-10"
                                                required
                                            />
                                            <Sparkles className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-500" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="register-password" className="text-sm font-medium">
                                            Create your password
                                        </label>
                                        <div className="relative">
                                            <Input
                                                id="register-password"
                                                type="password"
                                                placeholder="********"
                                                value={password || ""}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="pr-10"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Choose your role</label>
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                            {roles.map((role) => (
                                                <motion.div key={role.name} className="flex" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                    <Card
                                                        className={`cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex-1 ${selectedRole === role.name ? "dark:bg-purple-900 dark:border-purple-100 bg-purple-100 border-purple-900" : "dark:bg-violet-600 dark:hover:bg-purple-600 bg-violet-400  hover:bg-purple-400"}`}
                                                        onClick={() => {
                                                            if (selectedRole === role.name) {
                                                                setSelectedRole(null)
                                                            } else {
                                                                setSelectedRole(role.name)
                                                            }
                                                        }}
                                                    >
                                                        <CardContent className="p-4 text-center">
                                                            <role.icon className="mx-auto mb-2" />
                                                            <h3 className="font-semibold">{role.name}</h3>
                                                            <p className="text-xs">{role.description}</p>
                                                        </CardContent>
                                                    </Card>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105"
                                        disabled={!username || !selectedRole || isSubmitting}
                                    >
                                        {isSubmitting ? "Submitting..." : "Let the adventure begin!"}
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="login">
                                <h1 className="text-3xl font-bold text-center mb-6">Welcome Back!</h1>
                                <form onSubmit={handleLogin} className="space-y-6">
                                    <div className="space-y-2">
                                        <label htmlFor="login-email" className="text-sm font-medium">
                                            Email
                                        </label>
                                        <Input
                                            id="login-email"
                                            type="email"
                                            placeholder="yourname@email.com"
                                            value={userEmail || ""}
                                            onChange={(e) => setUserEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="login-password" className="text-sm font-medium">
                                            Password
                                        </label>
                                        <Input
                                            id="login-password"
                                            type="password"
                                            placeholder="********"
                                            value={password || ""}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Logging in..." : "Login"}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
