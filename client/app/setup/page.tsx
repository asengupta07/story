"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import { Sparkles, Pencil, Book, Building2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
// import { toast, Toaster } from "@/components/ui/sonner"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import NavBar from "@/components/functions/NavBar"
export default function FunUserRegistration() {
    const { toast } = useToast();
    const [username, setUsername] = useState("")
    const [selectedRole, setSelectedRole] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const roles = [
        { name: "Creator", icon: Pencil, description: "Creators are the imaginative minds behind captivating stories and innovative ideas. They are the storytellers and ideators who bring narratives to life, engaging audiences with their creativity and vision." },
        { name: "Reader", icon: Book, description: "Readers are the enthusiastic audience who immerse themselves in the world of stories. They are the storyreaders who enjoy exploring different narratives, making choices, and experiencing the journey crafted by creators." },
        { name: "Brand", icon: Building2, description: "Brands are entities looking to collaborate with engaging writers for promotional opportunities. They propose brand deals to creators, aiming to leverage the storytelling platform to reach a wider audience and create impactful marketing campaigns." },
    ]

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setTimeout(() => {
            setIsSubmitting(false)
            toast({
                title: "Registration successful!",
                description: `Welcome, ${username}! You're now registered as a ${selectedRole}.`,
                action: <ToastAction altText="Close">Close</ToastAction>
            })
        }, 2000)
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <NavBar />
            <div className="flex items-center justify-center p-4">
                <Card className="w-full my-11 max-w-3xl">
                    <CardContent className="p-6">
                    <h1 className="text-3xl font-bold text-center mb-6">Join the Fun!</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                            {isSubmitting ? (
                                <motion.div
                                    className="h-5 w-5 rounded-full border-t-2 border-white"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                />
                            ) : (
                                "Let the adventure begin!"
                            )}
                        </Button>
                    </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

