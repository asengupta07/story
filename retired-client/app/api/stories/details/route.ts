import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongo";
import { Chapter, Story, StorySettings, StoryStatus, User } from "@/models/schema";


async function getHandler(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const storyId = searchParams.get("storyId");

    await connectToDatabase();
    try {
        const story = await Story.findOne({ _id: storyId });
        const user = await User.findOne({ _id: story.user });
        const status = await StoryStatus.findOne({ story: storyId });
        const chapters = await Chapter.find({ story: storyId });
        const storySettings = await StorySettings.findOne({ storyId: storyId });

        const data = {
            title: story.title,
            description: story.description,
            details: {
                genre: story.genre,
                tone: story.tone,
                targetAudience: story.targetAudience,
                setting: story.setting,
                timePeriod: story.timePeriod,
                themes: story.themes,
                totalFollowers: status.numReaders,
            },
            characters: story.characters,
            writingSettings: {
                chapterInterval: storySettings.interval,
                writingStyle: storySettings.writingStyle,
                targetWordCount: storySettings.wordCount,
                contentWarnings: storySettings.contentWarnings.join(", "),
            },
            chapters: chapters.map((chapter) => ({
                number: chapter.number,
                title: chapter.title,
                recap: chapter.recap,
                author: user.alias,
            })),
            readers: {
                total: status.numReaders,
                topReaders: ["Arjun", "Shreya", "Ash", "Maya", "Nishanth", "Kavya", "Sneha", "Raj"],
            },
            aiEnabled: storySettings.agentWriter,
            status: status.status,
        };
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch story" }, { status: 500 });
    }
}

export { getHandler as GET };