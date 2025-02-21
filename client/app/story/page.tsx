"use client"

import { Book, Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import NavBar from "@/components/functions/NavBar"

export default function StoryDetails() {
    // Hardcoded story data for now
    const story = {
        title: "The Forgotten Realm",
        genre: "Fantasy",
        tone: "Mysterious",
        targetAudience: "Young Adult",
        premise:
            "In a world where memories can be traded like currency, a young archivist discovers an ancient realm that holds the key to humanity's forgotten past.",
        setting: "A dystopian metropolis with hidden magical elements",
        timePeriod: "Near Future",
        themes: "Memory, Identity, Power of Knowledge",
        characters: [
            {
                name: "Aria Chen",
                role: "Protagonist",
                description: "A skilled memory archivist with a mysterious past",
            },
            {
                name: "Marcus Vale",
                role: "Mentor",
                description: "Guardian of the forgotten realm",
            },
        ],
        wordCount: 120000,
        lastEdited: "1 month ago",
        status: "Completed",
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
                            {story.wordCount.toLocaleString()} words
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
                                <div>
                                    <h2 className="text-lg font-semibold mb-2 text-foreground">About</h2>
                                    <p className="text-muted-foreground">{story.premise}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-medium mb-1 text-foreground">Genre</h3>
                                        <p className="text-muted-foreground">{story.genre}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium mb-1 text-foreground">Tone</h3>
                                        <p className="text-muted-foreground">{story.tone}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium mb-1 text-foreground">Target Audience</h3>
                                        <p className="text-muted-foreground">{story.targetAudience}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium mb-1 text-foreground">Time Period</h3>
                                        <p className="text-muted-foreground">{story.timePeriod}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-1 text-foreground">Setting</h3>
                                    <p className="text-muted-foreground">{story.setting}</p>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-1 text-foreground">Themes</h3>
                                    <p className="text-muted-foreground">{story.themes}</p>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div>
                                <h2 className="text-lg font-semibold mb-4 text-foreground">Characters</h2>
                                <ScrollArea className="h-[400px] pr-4">
                                    <div className="space-y-4">
                                        {story.characters.map((character, index) => (
                                            <div key={index} className="p-4 bg-secondary/20 rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <User className="w-5 h-5" />
                                                    <h3 className="font-medium text-foreground">{character.name}</h3>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{character.role}</p>
                                                <p className="text-sm text-muted-foreground mt-2">{character.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Read Story Button */}
                <div className="text-center mt-8">
                    <Button size="lg">
                        <Book className="w-5 h-5 mr-2" />
                        Read Story
                    </Button>
                </div>
            </div>
        </div>
    )
}

