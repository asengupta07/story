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

1. **Title:** ${title}
2. **Genre:** ${genre}
3. **Tone:** ${tone}
4. **Target Audience:** ${targetAudience}
5. **Premise:** ${premise}
6. **Setting:** ${setting}
7. **Time Period:** ${timePeriod}
8. **Characters:** ${characters}
9. **Themes:** ${themes}
10. **Moral/Message:** ${moral}
11. **Writing Style:** ${writingStyle}
12. **Word Count:** ${wordCount}
13. **Content Warnings:** ${contentWarnings}
14. **Additional Instructions:** ${additionalInstructions}

Writing Instructions:

1. **Hook the Reader:** Start with an engaging opening line or scene to immediately capture attention.
2. **Establish the Setting:** Immerse the reader in the world by vividly describing the environment, time period, and atmosphere.
3. **Introduce Key Characters:** Present the main characters with distinct traits, motivations, and voices. Use dialogue and action to reveal personality.
4. **Set Up the Conflict:** Subtly hint at or directly introduce the central conflict or mystery to build intrigue and momentum.
5. **Maintain Genre and Tone:** Ensure the storytelling style stays consistent with the specified genre and tone.
6. **Weave in Themes and Morals:** Organically incorporate the story’s themes and moral lessons through character choices and narrative events.
7. **Balance Pacing and Word Count:** Develop the chapter at a steady pace, respecting the word count while allowing room for emotional beats and narrative flow.
8. **Follow Content Guidelines:** Adhere to any content warnings or restrictions, and be mindful of the target audience.
9. **Refine for Quality:** Use rich, evocative language, and ensure clarity, coherence, and polished prose.

Output Format:

Please return the generated chapter in the following JSON format:

{
  "chapterName": <generated chapter name>,
  "chapterContent": <generated chapter content>
}

Deliver the first chapter as a cohesive, immersive, and polished draft that aligns with the provided details and instructions.`;
        const chap = await generate(prompt);

        const chapter=JSON.parse(chap)
        
        const recapPrompt = `
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
        
        Chapter: ${chapter.chapterContent}
        `
        const rec = await generate(recapPrompt);

        const recap=JSON.parse(rec).recap


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

    Output Format (in JSON):
    {
      "chapterName": <generated chapter name>,
      "chapterContent": <generated chapter content>
    }

    Please generate the next chapter, ensuring it fits seamlessly within the existing story framework.
`;


    const newChap = await generate(prompt);

    const newChapterContent = JSON.parse(newChap)

    const newChapterData = {
        story: storyId,
        number: chapter.number + 1,
        title: newChapterContent.chapterName,
        content: newChapterContent.chapterContent,
        user: userData._id
    }

    const newChapter = await Chapter.create(newChapterData);

    return NextResponse.json({ success: true, chapter: newChapter }, { status: 200 });
}

export {
    postHandler as POST
}