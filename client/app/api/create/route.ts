import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/mongo";
import { User, Story, StorySettings } from "@/app/models/schema";
import { StoryInterface } from "@/types";

interface createStoryInterface extends StoryInterface {
    agentWriter: boolean;
    interval: number;
    moral?: string;
    writingStyle?: string;
    wordCount?: number;
    contentWarnings?: string[];
    additionalInstructions?: string;
    guidelines?: string;
}


async function postHandler(request: NextRequest) {
    try {
        const body = await request.json();
        console.log(body)
        const { title, genre, tone, targetAudience, premise, setting, timePeriod, characters, guidelines, themes, moral, writingStyle, wordCount, contentWarnings, additionalInstructions, user, agentWriter, interval }: createStoryInterface = body;


        await connectToDatabase();

        const userData = await User.findOne({ publicKey: user.publicKey });

        if (!userData) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        const story = await Story.create({
            title,
            genre,
            tone,
            targetAudience,
            premise,
            setting,
            timePeriod,
            characters,
            themes,
            user: userData._id
        });

        const storyId = story._id;

        const storySettings = await StorySettings.create({
            agentWriter,
            storyId,
            interval,
            moral,
            writingStyle,
            wordCount,
            contentWarnings,
            additionalInstructions,
            guidelines
        });

        const storySettingsId = storySettings._id;

        return NextResponse.json({ success: true, storyId, storySettingsId }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: "Failed to create story" }, { status: 500 });
    }
}

export {
    postHandler as POST
};
