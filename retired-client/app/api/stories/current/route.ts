import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongo";
import { Chapter, Story, StorySettings, StoryStatus, User } from "@/models/schema";


async function getHandler(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");

    await connectToDatabase();
    try {
        const user = await User.findOne({ publicKey: address });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const stories = await Story.find({ user: user._id });
        const storiesWithStatuses = await Promise.all(stories.map(async (story) => {
            const status = await StoryStatus.findOne({ story: story._id });
            const storySettings = await StorySettings.findOne({ storyId: story._id });
            let lastEdited = await Chapter.findOne({ story: story._id }).sort({ createdAt: -1 })
            if (!lastEdited) {
                lastEdited = {
                    createdAt: story.createdAt
                }
            }
            return {
                id: story._id,
                title: story.title,
                status: status?.status,
                premise: story.premise,
                hasAgent: storySettings?.agentWriter,
                readers: status?.numReaders,
                lastEdited: lastEdited.createdAt
            };
        }));
        const currentStories = storiesWithStatuses.filter((story) => story.status === "active");
        return NextResponse.json(currentStories, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 });
    }
}

export { getHandler as GET };