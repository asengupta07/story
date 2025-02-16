import { NextRequest, NextResponse } from "next/server";
import { User, Story, Chapter } from "@/app/models/schema";
import { generate } from "@/functions/generate";

async function postHandler(request: NextRequest) {
    const body = await request.json();
    const { storyId } = body;

    const story = await Story.findById(storyId);

    if (!story) {
        return NextResponse.json({ success: false, error: "Story not found" }, { status: 404 });
    }

    const { title, genre, tone, targetAudience, premise, setting, timePeriod, characters, guidelines, themes, moral, writingStyle, wordCount, contentWarnings, additionalInstructions, user } = story;

    const userData = await User.findById(user);

    if (!userData) {
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const chapters = await Chapter.find({ story: storyId }).sort({ number: -1 }).limit(1);

    if (!chapters) {
        const prompt = `
        You are a professional story writer.
        You are given a story with the following details:
        
        Title: ${title}
        Genre: ${genre}
        Tone: ${tone}
        Target Audience: ${targetAudience}
        Premise: ${premise}
        Setting: ${setting}
        Time Period: ${timePeriod}
        Characters: ${characters}
        Guidelines: ${guidelines}
        Themes: ${themes}
        Moral: ${moral}
        Writing Style: ${writingStyle}
        Word Count: ${wordCount}
        Content Warnings: ${contentWarnings}
        Additional Instructions: ${additionalInstructions}

        You are tasked with generating the first chapter for the story.
        `
        const chapter = await generate(prompt);
        
        const recapPrompt = `
        You are a professional recap writer.
        You are given a chapter for a story with the following details:
        
        Chapter: ${chapter}

        You are tasked with generating a recap for the chapter.
        `
        const recap = await generate(recapPrompt);

        const chapterData = {
            story: storyId,
            number: 1,
            title: title,
            content: chapter,
            recap: recap,
            user: userData._id
        }

        const newChapter = await Chapter.create(chapterData);

        return NextResponse.json({ success: true, chapter: newChapter }, { status: 200 });
    }

    const chapter = chapters[0];

    const prompt = `
    You are a professional story writer.
    You are given a story with the following details:
    
    Title: ${title}
    Genre: ${genre}
    Tone: ${tone}
    Target Audience: ${targetAudience}
    Premise: ${premise}
    Setting: ${setting}
    Time Period: ${timePeriod}
    Characters: ${characters}
    Guidelines: ${guidelines}
    Themes: ${themes}
    Moral: ${moral}
    Writing Style: ${writingStyle}
    Word Count: ${wordCount}
    Content Warnings: ${contentWarnings}
    Additional Instructions: ${additionalInstructions}

    The story is currently at chapter ${chapter.number}.

    Last Chapter: ${chapter.content}

    Recap of all previous chapters: ${chapter.recap}

    You are tasked with generating the next chapter for the story.
    `

    const newChapterContent = await generate(prompt);

    const newChapterData = {
        story: storyId,
        number: chapter.number + 1,
        title: title,
        content: newChapterContent,
        user: userData._id
    }

    const newChapter = await Chapter.create(newChapterData);

    return NextResponse.json({ success: true, chapter: newChapter }, { status: 200 });
}

export {
    postHandler
}