import { NextRequest, NextResponse } from "next/server";
import { User, Story, Chapter } from "@/models/schema";
import { generate } from "@/functions/generate";

async function postHandler(request: NextRequest) {
    const body = await request.json();
    const { storyId, direction } = body;

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

    console.log("Chapters: ", chapters)

    if (chapters.length === 0) {
        console.log("No chapters found")
        const prompt = `You are a professional story writer, tasked with crafting the first chapter of a compelling story. Follow the detailed guidelines below to ensure the narrative aligns with the vision.

Story Details:

Title: ${title}
Genre: ${genre}
Tone: ${tone}
Target Audience: ${targetAudience}
Premise: ${premise}
Setting: ${setting}
Time Period: ${timePeriod}
Characters: ${characters}
Themes: ${themes}
Moral/Message: ${moral}
Writing Style: ${writingStyle}
Word Count: ${wordCount}
Content Warnings: ${contentWarnings}
Additional Instructions: ${additionalInstructions}

Writing Instructions:

1. Start with an engaging opening line or scene to immediately capture attention.
2. Immerse the reader in the world by vividly describing the environment, time period, and atmosphere.
3. Present the main characters with distinct traits, motivations, and voices. Use dialogue and action to reveal personality.
4. Subtly hint at or directly introduce the central conflict or mystery to build intrigue and momentum.
5. Ensure the storytelling style stays consistent with the specified genre and tone.
6. Organically incorporate the story’s themes and moral lessons through character choices and narrative events.
7. Develop the chapter at a steady pace, respecting the word count while allowing room for emotional beats and narrative flow.
8. Adhere to any content warnings or restrictions, and be mindful of the target audience.
9. Add a cliffhanger at the end of the chapter to keep the reader engaged.
10. Make sure this first chapter is not a complete story, but an inital setup for the rest of the story, and there is a lot of creative potential for the story to grow.

Output Format:

Please return the generated chapter in the following JSON format:

{
  "chapterName": <generated chapter name>,
  "chapterContent": <generated chapter content>
}

Deliver the first chapter as a cohesive, immersive, and polished draft that aligns with the provided details and instructions.`;
        const chap = await generate(prompt);
        console.log("First Chapter: ", chap)
        const chapter=JSON.parse(chap?? "{}")
        
        const recapPrompt = `
        You are a professional recap writer. Your task is to generate a clear, engaging, a  nd concise recap for a given chapter of a story. 
        
        Please follow these guidelines:
        
        1. **Understand the Chapter**: Carefully read and analyze the content of the chapter to grasp its key events, character developments, and plot progression.
        
        2. **Identify Core Elements**: Focus on summarizing the main events, conflicts, and resolutions. Highlight pivotal moments that drive the narrative forward.
        
        3. **Maintain Tone and Style**: Match the recap’s tone to the story's genre (e.g., suspenseful for a thriller, whimsical for a fantasy). Keep the language immersive and captivating.
        
        4. **Be Concise Yet Comprehensive**: Aim for a balance between brevity and detail. Avoid unnecessary information but ensure critical points are covered.
        
        5. **Output Format**: Return the recap in the following JSON format:
        
        {
          "recap": "<generated recap>"
        }
        
        Here’s the chapter content:
        
        Chapter: ${chapter.chapterContent}
        `
        const rec = await generate(recapPrompt);

        const recap = JSON.parse(rec ?? "{}").recap


        const chapterData = {
            story: storyId,
            number: 1,
            title: chapter.chapterName,
            content: chapter.chapterContent,
            recap: recap,
            user: userData._id
        }

        const newChapter = await Chapter.create(chapterData);

        return NextResponse.json({ success: true, chapter: newChapter }, { status: 200 });
    }

    const chapter = chapters[0];

    const prompt = `
    You are a professional story writer with expertise in crafting engaging and immersive narratives. Your task is to generate the next chapter for an ongoing story, based on the provided details and previous content. Please follow the instructions carefully and output the result in JSON format.

    Story Details:
    1. Title: ${title}
    2. Genre: ${genre}
    3. Tone: ${tone}
    4. Target Audience: ${targetAudience}
    5. Premise: ${premise}
    6. Setting: ${setting}
    7. Time Period: ${timePeriod}
    8. Characters: ${characters}
    9. Themes: ${themes}
    10. Moral: ${moral}
    11. Writing Style: ${writingStyle}
    12. Word Count: ${wordCount}
    13. Content Warnings: ${contentWarnings}
    14. Guidelines: ${guidelines}
    15. Additional Instructions: ${additionalInstructions}

    Previous Content:
    16. Last Chapter: ${chapter.content}
    17. Recap of all previous chapters: ${chapter.recap}

    Instructions for generating the next chapter:
    1. Create a compelling chapter that aligns with the story details and adheres to the tone, style, and guidelines provided.
    2. Build on the previous chapter's events and ensure continuity with the recap of earlier chapters.
    3. Develop character arcs, plot progression, and thematic elements as appropriate for the narrative.
    4. Respect the content warnings and any sensitive material specified.
    5. Aim for the specified word count, balancing dialogue, description, and action for a well-rounded chapter.
    6. Make sure the special characters are escaped in the output, i.e. " -> \\"

    Output Format (in JSON):
    {
      "chapterName": <generated chapter name>,
      "chapterContent": <generated chapter content>
    }

    Please generate the next chapter, ensuring it fits seamlessly within the existing story framework.
`;


    const newChap = await generate(prompt);
    console.log("New Chapter: ", newChap)
    const newChapterContent = JSON.parse(newChap?? "{}")

    const recPrompt = `
        You are a professional recap writer. Your task is to generate a clear, engaging, and concise recap for a given chapter of a story. 
        
        Please follow these guidelines:
        
        1. **Understand the Chapter**: Carefully read and analyze the content of the chapter to grasp its key events, character developments, and plot progression.
        
        2. **Identify Core Elements**: Focus on summarizing the main events, conflicts, and resolutions. Highlight pivotal moments that drive the narrative forward.
        
        3. **Maintain Tone and Style**: Match the recap’s tone to the story's genre (e.g., suspenseful for a thriller, whimsical for a fantasy). Keep the language immersive and captivating.
        
        4. **Be Concise Yet Comprehensive**: Aim for a balance between brevity and detail. Avoid unnecessary information but ensure critical points are covered.
        
        5. **Output Format**: Return the recap in the following JSON format:
        
        {
          "recap": "<generated recap>"
        }
        
        Here’s the chapter content:
        
        Chapter: ${chapter}
        `
    const rc = await generate(recPrompt);

    const recP = JSON.parse(rc ?? "{}").recap

    const newChapterData = {
        story: storyId,
        number: chapter.number + 1,
        title: newChapterContent.chapterName,
        content: newChapterContent.chapterContent,
        recap: recP,
        user: userData._id
    }

    const newChapter = await Chapter.create(newChapterData);

    return NextResponse.json({ success: true, chapter: newChapter }, { status: 200 });
}

export {
    postHandler as POST
}