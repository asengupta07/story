"use client"

import { Book, Clock, Tag, Target, Calendar, MapPin, Layers, Gamepad2, Trophy, Newspaper, Quote, Info, Bell, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import NavBar from "@/components/functions/NavBar"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"



interface Story {
    title: string
    genre: string
    tone: string
    targetAudience: string
    premise: string
    setting: string
    timePeriod: string
    themes: string
    numChaps: number
    lastEdited: string
    status: string
    reviews: {
        source: string
        quote: string
    }[]
    readerQuotes: string[]
}

export default function StoryDetails() {
    const params = useParams()
    const storyId = params.storyId as string
    const [story, setStory] = useState<Story | null>(null)
    const [isFollowing, setIsFollowing] = useState(false)

    useEffect(() => {
        const email = localStorage.getItem("email")
        if (!email) return

        const fetchStory = async () => {
            const response = await fetch(`/api/getStory/${storyId}`)
            const data = await response.json()
            const res = await fetch(`/api/generate/reviews?storyId=${storyId}`)
            const reviews = await res.json()
            setStory({
                ...data,
                reviews: reviews.newsReviews,
                readerQuotes: reviews.reviews
            })
        }
        const checkFollow = async () => {
            const response = await fetch(`/api/follow?storyId=${storyId}&email=${email}`)
            const data = await response.json()
            setIsFollowing(data.follow)
        }
        checkFollow()
        fetchStory()
    }, [storyId])

    const handleFollow = async () => {
        const email = localStorage.getItem("email")
        if (!email) return
        const response = await fetch(`/api/follow?storyId=${storyId}&email=${email}`,
            {
                method: isFollowing ? "DELETE" : "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
        const data = await response.json()
        setIsFollowing(data.follow)
    }

    if (!story) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
                <div className="relative w-24 h-24">
                    <div className="absolute inset-0 border-4 border-main rounded-full animate-[spin_3s_linear_infinite]" />
                    <div className="absolute inset-2 border-4 border-sec rounded-full animate-[spin_2s_linear_infinite_reverse]" />
                    <div className="absolute inset-4 border-4 border-main rounded-full animate-[spin_1.5s_linear_infinite]" />
                    <BookOpen className="absolute inset-0 m-auto w-8 h-8 text-sec animate-pulse" />
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                        Loading Story
                    </h2>
                    <p className="text-muted-foreground text-sm">Preparing your reading experience...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-bg">
            <NavBar />
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-4 sm:py-8">
                <div className="text-center space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    <div className="flex items-center justify-center gap-4">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">{story.title}</h1>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
                        <span className="flex items-center gap-1">
                            <Book className="w-3 h-3 sm:w-4 sm:h-4" />
                            {story.numChaps?.toLocaleString()} chapters
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                            Last edited {new Date(story.lastEdited).getTime() > 0 ? (() => {
                                const diffMs = Date.now() - new Date(story.lastEdited).getTime();
                                const diffMins = Math.floor(diffMs / (1000 * 60));
                                const diffHours = Math.floor(diffMins / 60);
                                const diffDays = Math.floor(diffHours / 24);
                                
                                if (diffDays > 0) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
                                if (diffHours > 0) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
                                return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
                            })() : 'just now'}
                        </span>
                    </div>
                    
                    <Badge variant="default" className="bg-[#d385af] text-black hover:bg-[#d385af] text-xs sm:text-sm">
                        {story.status}
                    </Badge>
                    <div className="flex items-center justify-center gap-4">
                        <Button 
                            variant={isFollowing ? "reverse" : "default"}
                            onClick={handleFollow}
                            className="flex items-center gap-1 text-sm px-3 py-1"
                        >
                            <Bell className="w-3 h-3" />
                            {isFollowing ? "Following" : "Follow Story"}
                        </Button>
                    </div>
                </div>

                {/* Story Details */}
                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 h-full">
                            {/* Left Column */}
                            <div className="space-y-4 sm:space-y-6 h-full">
                                <Card className="bg-[#d385af] backdrop-blur-sm shadow-none transform hover:scale-[1.02] transition-transform duration-200">
                                    <CardContent className="p-4 sm:p-6">
                                        <span className="flex items-center text-base font-extrabold sm:text-lg mb-2">
                                            <Info className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-pulse" />About
                                        </span>
                                        <div className="relative">
                                            <div className="absolute -left-2 top-0 w-1 h-full bg-secondary/40 rounded"></div>
                                            <p className="text-sm sm:text-base text-muted-foreground pl-4">{story.premise}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <Card className="bg-[#d385af]/80 backdrop-blur-sm shadow-none hover:bg-[#d385af] transition-colors duration-200 p-4">
                                        <h3 className="font-medium mb-2 text-sm sm:text-base text-foreground flex items-center">
                                            <Tag className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                            Genre
                                        </h3>
                                        <p className="text-xs sm:text-sm text-muted-foreground bg-secondary/20 p-2 rounded-md">{story.genre}</p>
                                    </Card>
                                    
                                    <Card className="bg-[#d385af]/80 backdrop-blur-sm shadow-none hover:bg-[#d385af] transition-colors duration-200 p-4">
                                        <h3 className="font-medium mb-2 text-sm sm:text-base text-foreground flex items-center">
                                            <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                            Target Audience
                                        </h3>
                                        <p className="text-xs sm:text-sm text-muted-foreground bg-secondary/20 p-2 rounded-md">{story.targetAudience}</p>
                                    </Card>

                                    <Card className="bg-[#d385af]/80 backdrop-blur-sm shadow-none hover:bg-[#d385af] transition-colors duration-200 p-4">
                                        <h3 className="font-medium mb-2 text-sm sm:text-base text-foreground flex items-center">
                                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                            Time Period
                                        </h3>
                                        <p className="text-xs sm:text-sm text-muted-foreground bg-secondary/20 p-2 rounded-md">{story.timePeriod}</p>
                                    </Card>

                                    <Card className="bg-[#d385af]/80 backdrop-blur-sm shadow-none hover:bg-[#d385af] transition-colors duration-200 p-4">
                                        <h3 className="font-medium mb-2 text-sm sm:text-base text-foreground flex items-center">
                                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                            Setting
                                        </h3>
                                        <p className="text-xs sm:text-sm text-muted-foreground bg-secondary/20 p-2 rounded-md">{story.setting}</p>
                                    </Card>
                                </div>

                                <Card className="bg-[#d385af]/90 backdrop-blur-sm shadow-none hover:bg-[#d385af] transition-colors duration-200 p-4">
                                    <h3 className="font-medium mb-3 text-sm sm:text-base text-foreground flex items-center">
                                        <Layers className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                        Themes
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {story.themes.split(',').map((theme, index) => (
                                            <Badge key={index} variant="neutral" className="bg-secondary/20 hover:bg-secondary/30 text-xs">
                                                {theme.trim()}
                                            </Badge>
                                        ))}
                                    </div>
                                </Card>
                            </div>

                            {/* Right Column - Reviews and Quotes */}
                            <div className="h-full">
                                <ScrollArea className="h-[33rem] lg:h-[35rem]">
                                    <div className="space-y-4 pr-4 pb-4">
                                        <Card className="bg-[#d385af] backdrop-blur-sm shadow-none mx-2">
                                            <CardHeader className="px-6 pt-6 pb-0">
                                                <CardTitle className="flex items-center text-base sm:text-lg">
                                                    <Newspaper className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                                    Newspaper Reviews
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="px-6 pb-3 pt-6">
                                                {story.reviews.map((review, index) => (
                                                    <div key={index} className="px-3 sm:px-4 pb-3 sm:pb-4 bg-secondary/20 rounded-lg mb-3">
                                                        <p className="text-xs sm:text-sm text-muted-foreground italic">&quot;{review.quote}&quot;</p>
                                                        <p className="text-xs sm:text-sm text-foreground font-medium mt-2">- {review.source}</p>
                                                    </div>
                                                ))}
                                            </CardContent>
                                        </Card>
                                        <Card className="bg-[#d385af] backdrop-blur-sm shadow-none mx-2">
                                            <CardHeader className="px-6 pt-6 pb-0">
                                                <CardTitle className="flex items-center text-base sm:text-lg">
                                                    <Quote className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                                    Readers&apos; Quotes
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="px-6 pb-6">
                                                {story.readerQuotes.map((quote, index) => (
                                                    <div key={index} className="px-3 sm:px-4 py-2 sm:py-3 bg-secondary/20 rounded-lg">
                                                        <p className="text-xs sm:text-sm text-muted-foreground italic">&quot;{quote}&quot;</p>
                                                    </div>
                                                ))}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </ScrollArea>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Read Story Button */}
                <div className="text-center mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                    <Link href={`/reader/story/read/${storyId}`}>
                        <Button size="lg" className="w-full sm:w-auto text-sm sm:text-base">
                            <Book className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            Read Story
                        </Button>
                    </Link>
                    <Link href={`/reader/story/games/${storyId}`}>
                        <Button size="lg" className="w-full sm:w-auto text-sm sm:text-base">
                            <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            Play Games
                        </Button>
                    </Link>
                    <Link href={`/reader/perks/${storyId}`}>
                        <Button size="lg" className="w-full sm:w-auto text-sm sm:text-base">
                            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            Perks
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
