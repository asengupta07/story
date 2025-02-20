"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Sparkles } from "lucide-react"
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

    const fetchFollowedStories = async () => {
        const response = await fetch("/api/getFollowedStories")
        const data = await response.json()
        return data
    }

    useEffect(() => {
        fetchStories().then(setTrendingStories)
        fetchFollowedStories().then(setFollowedStories)
    }, [])

    return (
        <>
            <NavBar />
            <div className="container mx-auto p-4 space-y-8">
                <h1 className="text-3xl font-bold mb-6">Story Dashboard</h1>

                {/* Trending Stories Section */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Trending Stories</h2>
                    {trendingStories.length > 0 ?
                        (
                            <ScrollArea className="w-full">
                                <div className="flex w-max space-x-4 p-4">
                                    {trendingStories.map((story) => (
                                        <Card key={story.id} className="w-[250px] shrink-0 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                            <CardHeader>
                                                <CardTitle className="overflow-x-hidden text-ellipsis whitespace-nowrap min-h-8">{story.title}
                                                <p className="text-sm mt-1 text-muted-foreground font-base">by {story.author}</p>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <Badge variant="neutral" className="mb-2">
                                                    {story.genre}
                                                </Badge>
                                                <p className="text-sm truncate">{story.premise}</p>
                                            </CardContent>
                                            <CardFooter>
                                                <div className="flex items-center text-sm text-muted-foreground">
                                                    <Users className="mr-1 h-4 w-4" />
                                                    {story.followers} followers
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        ) : (
                            <div className="text-center dark:text-white text-black">
                                <Sparkles className="mx-auto h-16 w-16 mb-4" />
                                <h3 className="text-2xl font-bold mb-2">Stories Are Still Cooking...</h3>
                                <p className="text-lg">Check back soon!</p>
                            </div>
                        )}
                </section>

                {/* Followed Stories Section */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Followed Stories</h2>
                    {followedStories.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {followedStories.map((story, index) => (
                                <Card key={index} className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                    <CardHeader>
                                        <CardTitle>{story.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground mb-2">by {story.author}</p>
                                        <Badge variant="neutral" className="mb-2">
                                            {story.genre}
                                        </Badge>
                                        <p className="text-sm">{story.premise}</p>
                                    </CardContent>
                                    <CardFooter>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Users className="mr-1 h-4 w-4" />
                                            {story.followers} followers
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        // <Card className="w-full h-64 flex items-center justify-center">
                        <div className="text-center dark:text-white text-black">
                            <BookOpen className="mx-auto h-16 w-16 mb-4" />
                            <h3 className="text-2xl font-bold mb-2">No Followed Stories Yet</h3>
                            <p className="text-lg">Discover and follow stories to see them here!</p>
                        </div>
                        // </Card>
                    )}
                </section>
            </div>
        </>
    )
}

