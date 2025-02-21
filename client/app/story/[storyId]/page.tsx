"use client"

import { Book, Clock, User, UsersRound, Sticker, Info, Tag, Target, Calendar, MapPin, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import NavBar from "@/components/functions/NavBar"
import { useParams } from "next/navigation"
import { useEffect } from "react"
import { useState } from "react"
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
    characters: {
        name: string
        role: string
        description: string
    }[]
    numChaps: number
    lastEdited: string
    status: string
}

export default function StoryDetails() {
    const params = useParams()
    const storyId = params.storyId as string
    const [story, setStory] = useState<Story | null>(null)

    useEffect(() => {
        const fetchStory = async () => {
            const response = await fetch(`/api/getStory/${storyId}`)
            console.log(response)
            const data = await response.json()
            setStory(data)
        }
        fetchStory()
        console.log("HEHERE")
        console.log(story)
    }, [storyId])

    if (!story) {
        return <div>Loading...</div>
    }

    return (
        <div className="min-h-screen bg-bg">
            <NavBar />
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-8">
                <div className="text-center space-y-4 mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold">{story.title}</h1>
                    <div className="flex items-center justify-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                            <Book className="w-4 h-4" />
                            {story.numChaps?.toLocaleString()} words
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Last edited {story.lastEdited}
                        </span>
                    </div>
                    <Badge variant="default" className="bg-purple-800 text-white hover:bg-purple-700">
                        {story.status}
                    </Badge>
                </div>

                {/* Story Details */}
                <Card >
                    <CardContent className="p-6">
                        <div className="grid gap-8 md:grid-cols-2">
                            {/* Left Column */}
                            <div className="space-y-6">
                                <Card className="bg-violet-600 backdrop-blur-sm shadow-none">
                                    <CardHeader>
                                        <CardTitle className="flex items-center"><Info className="w-5 h-5 mr-2" />About</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div>
                                            <p className="text-muted-foreground">{story.premise}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="grid grid-cols-2 gap-4 ms-8">
                                    <div>
                                        <h3 className="font-medium mb-1 text-foreground flex items-center"><Tag className="w-4 h-4 mr-1" />Genre</h3>
                                        <p className="text-muted-foreground">{story.genre}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium mb-1 text-foreground flex items-center"><Sticker className="w-4 h-4 mr-1" />Tone</h3>
                                        <p className="text-muted-foreground">{story.tone}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium mb-1 text-foreground flex items-center"><Target className="w-4 h-4 mr-1" />Target Audience</h3>
                                        <p className="text-muted-foreground">{story.targetAudience}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium mb-1 text-foreground flex items-center"><Calendar className="w-4 h-4 mr-1" />Time Period</h3>
                                        <p className="text-muted-foreground">{story.timePeriod}</p>
                                    </div>
                                </div>
                                <div className="ms-8 pr-12">
                                    <div>
                                        <h3 className="font-medium mb-1 text-foreground flex items-center"><MapPin className="w-4 h-4 mr-1" />Setting</h3>
                                        <p className="text-muted-foreground">{story.setting}</p>
                                    </div>
                                    <br />
                                    <div>
                                        <h3 className="font-medium mb-1 text-foreground flex items-center"><Layers className="w-4 h-4 mr-1" />Themes</h3>
                                        <p className="text-muted-foreground">{story.themes}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div>


                                <ScrollArea className="h-[400px] pr-4">
                                    <div className="space-y-4">
                                        <Card className="bg-violet-600 backdrop-blur-sm shadow-none">
                                            <CardHeader>
                                                <CardTitle className="flex items-center"><UsersRound className="w-5 h-5 mr-2" />Characters</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                {story.characters.map((character, index) => (
                                                    <div key={index} className="px-4 pb-4 bg-secondary/20 rounded-lg">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <User className="w-5 h-5" />
                                                            <h3 className="font-medium text-foreground">{character.name}</h3>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">{character.role}</p>
                                                        <br />
                                                        <h3 className="font-extrabold text-foreground">Character Description</h3>
                                                        <p className="text-sm text-muted-foreground mt-2" dangerouslySetInnerHTML={{ __html: character.description.replace(/\n/g, '<br />') }}></p>
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
                <div className="text-center mt-8">
                    <Link href={`/read/${storyId}`}>
                        <Button size="lg">
                            <Book className="w-5 h-5 mr-2" />
                            Read Story
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
