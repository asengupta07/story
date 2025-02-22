import { NextRequest, NextResponse } from "next/server"
import { Story, Chapter } from "@/models/schema"
import connectToDatabase from "@/lib/mongo"


async function getHandler(request: NextRequest, { params }: { params: Promise<{ storyId: string }> }) {
    const { storyId } = await params
    await connectToDatabase()
    const story = await Story.findById(storyId)
    const chapters = await Chapter.find({ story: storyId })
    const response = {
        title: story.title,
        chapters: chapters.map((chapter) => ({
            title: chapter.title,
            content: chapter.content
        }))
    }
    return NextResponse.json(response)
}

export { getHandler as GET }