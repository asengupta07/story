import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/mongo";
import { User, Story } from "@/app/models/schema";

interface Character {
    name: string;
    description: string;
    role: string;
    backstory: string;
}


interface UserInterface {
    name: string;
    publicKey: string;
}


interface StoryInterface {
    title: string;
    genre: string;
    tone: string;
    targetAudience: string;
    premise: string;
    setting: string;
    timePeriod: string;
    characters: Character[];
    guidelines: string;
    themes: string;
    moral: string;
    writingStyle: string;
    wordCount: number;
    contentWarnings: string[];
    additionalInstructions: string;
    user: UserInterface;
}

async function postHandler(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, genre, tone, targetAudience, premise, setting, timePeriod, characters, guidelines, themes, moral, writingStyle, wordCount, contentWarnings, additionalInstructions, user }: StoryInterface = body;


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
            guidelines,
            themes,
            moral,
            writingStyle,
            wordCount,
            contentWarnings,
            additionalInstructions,
            user: userData._id
        });

        const storyId = story._id;

        return NextResponse.json({ success: true, storyId }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: "Failed to create story" }, { status: 500 });
    }
}

export { postHandler };
