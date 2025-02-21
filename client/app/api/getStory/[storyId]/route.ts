import { NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongo"
import { Chapter, Story, StoryStatus } from "@/models/schema"

interface Response {
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


export async function GET(request: NextRequest, { params }: { params: Promise<{ storyId: string }> }) {
    try {
        const { storyId } = await params
        await connectToDatabase()
        const story = await Story.findOne({ _id: storyId })
        const status = await StoryStatus.findOne({ story: storyId })
        const chapters = await Chapter.find({ story: storyId })
        let lastEdited = await Chapter.findOne({ story: storyId }).sort({ createdAt: -1 })
        if (!lastEdited) {
            lastEdited = {
                createdAt: story.createdAt
            }
        }
        console.log("Last edited:", lastEdited)
        const response: Response = {
            title: story.title,
            genre: story.genre,
            tone: story.tone,
            targetAudience: story.targetAudience,
            premise: story.premise,
            setting: story.setting,
            timePeriod: story.timePeriod,
            themes: story.themes,
            characters: story.characters.map((character: any) => ({
                name: character.name,
                role: character.role,
                description: `${character.description}\n\n${character.backstory}`
            })),
            numChaps: chapters.length,
            lastEdited: lastEdited.createdAt,
            status: status.status
        }
        return NextResponse.json(response, { status: 200 })
    } catch (error) {
        console.log("Error fetching story:", error)
        return NextResponse.json({ error: "Failed to fetch story" }, { status: 500 })
    }
}
