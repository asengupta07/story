"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Sparkles } from "lucide-react"
import Link from "next/link"
import NavBar from "@/components/functions/NavBar"

interface ReaderDashboardInterface {
    id: string
    title: string
    genre: string
    tone: string
    targetAudience: string
    premise: string
    setting: string
    timePeriod: string
    author: string
    themes: string
    followers: number
}

export default function Dashboard() {
    const [trendingStories, setTrendingStories] = useState<ReaderDashboardInterface[]>([])
    const [followedStories, setFollowedStories] = useState<ReaderDashboardInterface[]>([])

    // Simulated fetch function
    const fetchStories = async () => {
        const response = await fetch("/api/getStories")
        const data = await response.json()
        return data
    }

    const fetchFollowedStories = async (email: string) => {
        const response = await fetch("/api/getFollowedStories?email=" + email)
        const data = await response.json()
        return data
    }

    useEffect(() => {
        const email = localStorage.getItem("email")
        if (!email) return
        fetchStories().then(setTrendingStories)
        fetchFollowedStories(email).then(setFollowedStories)
    }, [])

    return (
        <div className="bg-bg min-h-screen">
            <NavBar />
            <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8">
                <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Story Dashboard</h1>

                {/* Trending Stories Section */}
                <section>
                    <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Trending Stories</h2>
                    {trendingStories.length > 0 ? (
                        <ScrollArea className="w-full">
                            <div className="flex w-max space-x-3 sm:space-x-4 p-2 sm:p-4">
                                {trendingStories.map((story) => (
                                    <Link href={`/reader/story/${story.id}`} key={story.id}>
                                        <Card className="w-[200px] sm:w-[250px] shrink-0 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                            <CardHeader className="p-3 sm:p-4">
                                                <CardTitle className="text-base sm:text-lg overflow-x-hidden text-ellipsis whitespace-nowrap min-h-6 sm:min-h-8">
                                                    {story.title}
                                                    <p className="text-xs sm:text-sm mt-1 text-muted-foreground font-base">by {story.author}</p>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-3 sm:p-4">
                                                <Badge variant="neutral" className="mb-2 text-xs sm:text-sm">
                                                    {story.genre}
                                                </Badge>
                                                <p className="text-xs sm:text-sm truncate">{story.premise}</p>
                                            </CardContent>
                                            <CardFooter className="p-3 sm:p-4">
                                                <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                                                    <Users className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                                                    {story.followers} followers
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    ) : (
                        <div className="text-center dark:text-white text-black py-8">
                            <Sparkles className="mx-auto h-12 w-12 sm:h-16 sm:w-16 mb-3 sm:mb-4" />
                            <h3 className="text-xl sm:text-2xl font-bold mb-2">Stories Are Still Cooking...</h3>
                            <p className="text-base sm:text-lg">Check back soon!</p>
                        </div>
                    )}
                </section>

                {/* Followed Stories Section */}
                <section>
                    <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Followed Stories</h2>
                    {followedStories.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            {followedStories.map((story) => (
                                <Link href={`/story/${story.id}`} key={story.id}>
                                    <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                        <CardHeader className="p-3 sm:p-4">
                                            <CardTitle className="text-base sm:text-lg">{story.title}</CardTitle>
                                            <p className="text-xs sm:text-sm mt-1 text-muted-foreground font-base">by {story.author}</p>
                                        </CardHeader>
                                        <CardContent className="p-3 sm:p-4">
                                            <Badge variant="neutral" className="mb-2 text-xs sm:text-sm">
                                                {story.genre}
                                            </Badge>
                                            <p className="text-xs sm:text-sm line-clamp-2">{story.premise}</p>
                                        </CardContent>
                                        <CardFooter className="p-3 sm:p-4">
                                            <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                                                <Users className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                                                {story.followers} followers
                                            </div>
                                        </CardFooter>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center dark:text-white text-black py-8">
                            <BookOpen className="mx-auto h-12 w-12 sm:h-16 sm:w-16 mb-3 sm:mb-4" />
                            <h3 className="text-xl sm:text-2xl font-bold mb-2">No Followed Stories Yet</h3>
                            <p className="text-base sm:text-lg">Discover and follow stories to see them here!</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}
