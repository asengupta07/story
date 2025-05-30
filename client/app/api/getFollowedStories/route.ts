import { NextRequest, NextResponse } from "next/server";
import { Story, StoryStatus, User } from "@/models/schema";
import connectToDatabase from "@/lib/mongo";

async function getHandler(request: NextRequest) {
    await connectToDatabase();
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const storyStatuses = await StoryStatus.find({ readers: { $in: [user._id] } });

    const storyIds = storyStatuses.map((status) => status.story);

    const stories = await Story.find({ _id: { $in: storyIds } });

    const storiesWithStatuses = await Promise.all(stories.map(async (story) => {
        const status = await StoryStatus.findOne({ story: story._id });
        const author = await User.findById(story.user);
        return {
            id: story._id,
            title: story.title,
            genre: story.genre,
            tone: story.tone,
            targetAudience: story.targetAudience,
            premise: story.premise,
            setting: story.setting,
            timePeriod: story.timePeriod,
            author: author.alias,
            themes: story.themes,
            followers: status?.numReaders || 0
        };
    }));

        return NextResponse.json(storiesWithStatuses, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 });
    }
}

export { getHandler as GET }