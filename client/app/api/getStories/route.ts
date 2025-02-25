import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongo";
import { Story, StoryStatus, User } from "@/models/schema";


async function getHandler(request: NextRequest) {
    await connectToDatabase();
    try {
        const stories = await Story.find({});


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

        const response = storiesWithStatuses.sort((a, b) => b.followers - a.followers);

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 });
    }
}

export {
    getHandler as GET
};