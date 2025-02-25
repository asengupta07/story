import { NextRequest, NextResponse } from "next/server";
import { User, Story, Chapter, Brand } from "@/models/schema";
import { generate } from "@/functions/generate";
import { parseUntilJson } from "@/functions/parseUntilJson";


async function reflectBrandDeals(deals: string, chapter: string) {
    const prompt = `You are a professional story editor. Your task is to review the following brand promotions in the story chapter and ensure they are present while adhering to the guidelines. Follow the instructions below:

    1. Verify that all brand promotions are included in the chapter.
    2. Make sure that each brand promotion is namedropped only once in the chapter, and that too in a very subtle and natural way.
    3. The brand promotions should never feel forced or unnatural, and definitely should not feel like an advertisement.
    4. Ensure the brand promotions are subtle and do not disrupt the flow of the story.
    5. Make sure the brand promotions do not distract from the main plot.
    6. Make sure the output is in JSON format, and there is no text or backticks before or after the JSON object.

    Here are the brand promotions:
    ${deals}

    Here is the chapter:
    ${chapter}

    Return the output in the following format:
    {
        "chapterContent": "<unchanged chapter content if all brand promotions are present and subtle, otherwise return the chapter content with the brand promotions properly integrated as per the guidelines>",
        "changed": "<true if the chapter content has been changed, otherwise false>"
    }`
    let response = await generate(prompt);
    if (response?.startsWith("```json")) {
        response = response.slice(7);
    }
    if (response?.endsWith("```")) {
        response = response.slice(0, -3);
    }    
    let output;
    try {
        output = JSON.parse(response ?? "{}")
    } catch (error) {
        console.log("Error: ", error)
        output = parseUntilJson(response ?? "");
    }
    return output;
}

async function checkForNewCharacters(oldCharacters: string, chapter: string) {
    const prompt = `You are a professional story editor. Your task is to review the following chapter and check if it introduces any new major or noteworthy characters. Follow the instructions below:

    Here are the old characters:
    ${oldCharacters}

    Here is the chapter:
    ${chapter}

    Return the output in the following format:
    {
        "newCharacters": [
            {
                "name": "<name of the character>",
                "description": "<description of the character>",
                "role": "<role of the character>",
                "backstory": "<backstory of the character, if any>"
            }
        ]
    }`
    let response = await generate(prompt);
    if (response?.startsWith("```json")) {
        response = response.slice(7);
    }
    if (response?.endsWith("```")) {
        response = response.slice(0, -3);
    }
    let output;
    try {
        output = JSON.parse(response ?? "{}")
    } catch (error) {
        console.log("Error: ", error)
        output = parseUntilJson(response ?? "");
    }
    return output;
}
    
    

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
    const bDeals = await Brand.find({ storyId: storyId });
    const brandDeals = bDeals.filter(deal => deal.status === "approved");

    console.log("Brand Deals: ", brandDeals)
    if (chapters.length === 0) {
        console.log("No chapters found")
        let prompt = "";
        if (brandDeals.length > 0) {
            const deals = brandDeals.map(deal => `${deal.name} - ${deal.product} - ${deal.description}`).join("\n");
            console.log("Brand Deals found")
            prompt = `You are a professional story writer, tasked with crafting the first chapter of a compelling story. Follow the detailed guidelines below to ensure the narrative aligns with the vision.

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

### IMPORTANT:
Direction for the first chapter: ${direction ?? "No direction provided by the author"}

Brand Deals: 
${deals}

Writing Instructions:

1. Make sure the chapter follows the direction provided by the author.
2. Incorporate the brand deal promotions subtly into the chapter by namedropping the brand name and product in a way that is natural to the story.
3. Make sure that the brand promotion is not too obvious and does not disrupt the flow of the story or distract from the main plot, at all.
4. Start with an engaging opening line or scene to immediately capture attention.
5. Immerse the reader in the world by vividly describing the environment, time period, and atmosphere.
6. Present the main characters with distinct traits, motivations, and voices. Use dialogue and action to reveal personality.
7. Subtly hint at or directly introduce the central conflict or mystery to build intrigue and momentum.
8. Ensure the storytelling style stays consistent with the specified genre and tone.
9. Organically incorporate the story's themes and moral lessons through character choices and narrative events.
10. Develop the chapter at a steady pace, respecting the word count while allowing room for emotional beats and narrative flow.
11. Adhere to any content warnings or restrictions, and be mindful of the target audience.
12. Add a cliffhanger at the end of the chapter to keep the reader engaged.
13. Make sure this first chapter is not a complete story, but an inital setup for the rest of the story, and there is a lot of creative potential for the story to grow.

Output Format:

Please return the generated chapter in the following JSON format:

{
  "chapterName": <generated chapter name>,
  "chapterContent": <generated chapter content>
}

Deliver the first chapter as a cohesive, immersive, and polished draft that aligns with the provided details and instructions.`;
            await Brand.updateMany({ storyId: storyId, status: "approved" }, { $set: { status: "completed" } });
        } else {
            console.log("No Brand Deals found")
            prompt = `You are a professional story writer, tasked with crafting the first chapter of a compelling story. Follow the detailed guidelines below to ensure the narrative aligns with the vision.

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

### IMPORTANT:
Direction for the first chapter: ${direction ?? "No direction provided by the author"}

Writing Instructions:

1. Make sure the chapter follows the direction provided by the author.
2. Start with an engaging opening line or scene to immediately capture attention.
3. Immerse the reader in the world by vividly describing the environment, time period, and atmosphere.
4. Present the main characters with distinct traits, motivations, and voices. Use dialogue and action to reveal personality.
5. Subtly hint at or directly introduce the central conflict or mystery to build intrigue and momentum.
6. Ensure the storytelling style stays consistent with the specified genre and tone.
7. Organically incorporate the story's themes and moral lessons through character choices and narrative events.
8. Develop the chapter at a steady pace, respecting the word count while allowing room for emotional beats and narrative flow.
9. Adhere to any content warnings or restrictions, and be mindful of the target audience.
10. Add a cliffhanger at the end of the chapter to keep the reader engaged.
11. Make sure this first chapter is not a complete story, but an inital setup for the rest of the story, and there is a lot of creative potential for the story to grow.

Output Format:

Please return the generated chapter in the following JSON format:

{
  "chapterName": <generated chapter name>,
  "chapterContent": <generated chapter content>
}

Deliver the first chapter as a cohesive, immersive, and polished draft that aligns with the provided details and instructions.`;
        }

        let chap = await generate(prompt);
        if (chap?.startsWith("```json")) {
            chap = chap.slice(7);
        }
        if (chap?.endsWith("```")) {
            chap = chap.slice(0, -3);
        }
        const chapter = JSON.parse(chap ?? "{}")
        
        let finalChapterContent = chapter.chapterContent;

        if (brandDeals.length > 0) {
            const deals = brandDeals.map(deal => `${deal.name} - ${deal.product} - ${deal.description}`).join("\n");
            const reflectedContent = await reflectBrandDeals(deals, chapter.chapterContent);
            if (reflectedContent.changed) {
                finalChapterContent = reflectedContent.chapterContent;
            }
        }

        const recapPrompt = `
        You are a professional recap writer. Your task is to generate a clear, engaging, and concise recap for a given chapter of a story. 
        
        Please follow these guidelines:
        
        1. **Understand the Chapter**: Carefully read and analyze the content of the chapter to grasp its key events, character developments, and plot progression.
        
        2. **Identify Core Elements**: Focus on summarizing the main events, conflicts, and resolutions. Highlight pivotal moments that drive the narrative forward.
        
        3. **Maintain Tone and Style**: Match the recap's tone to the story's genre (e.g., suspenseful for a thriller, whimsical for a fantasy). Keep the language immersive and captivating.
        
        4. **Be Concise Yet Comprehensive**: Aim for a balance between brevity and detail. Avoid unnecessary information but ensure critical points are covered.
        
        5. **Output Format**: Return the recap in the following JSON format:
        
        {
          "recap": "<generated recap>"
        }
        
        Here's the chapter content:
        
        Chapter: ${finalChapterContent}
        `
        let rec = await generate(recapPrompt);
        if (rec?.startsWith("```json")) {
            rec = rec.slice(7);
        }
        if (rec?.endsWith("```")) {
            rec = rec.slice(0, -3);
        }
        const recap = JSON.parse(rec ?? "{}").recap

        const chapterData = {
            story: storyId,
            number: 1,
            title: chapter.chapterName,
            content: finalChapterContent,
            recap: recap,
            user: userData._id
        }

        const newCharacters = await checkForNewCharacters(characters, finalChapterContent);
        console.log("New Characters: ", newCharacters)
        if (newCharacters.newCharacters.length > 0) {
            story.characters.push(...newCharacters.newCharacters);
            await story.save();
        }
        const newChapter = await Chapter.create(chapterData);

        return NextResponse.json({ success: true, chapter: newChapter }, { status: 200 });
    }

    const chapter = chapters[0];

    let prompt = "";
    if (brandDeals.length > 0) {
        const deals = brandDeals.map(deal => `${deal.name} - ${deal.product} - ${deal.description}`).join("\n");
        prompt = `
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

    ### IMPORTANT:
    Direction for the next chapter: ${direction ?? "No direction provided by the author"}

    Brand Deals: 
    ${deals}

    Instructions for generating the next chapter:
    1. Make sure the chapter follows the direction provided by the author.
    2. Incorporate the brand deal promotions subtly into the chapter by namedropping the brand name and product in a way that is natural to the story.
    3. Make sure that the brand promotion is not too obvious and does not disrupt the flow of the story or distract from the main plot, at all.
    4. Create a compelling chapter that aligns with the story details and adheres to the tone, style, and guidelines provided.
    5. Build on the previous chapter's events and ensure continuity with the recap of earlier chapters.
    6. Develop character arcs, plot progression, and thematic elements as appropriate for the narrative.
    7. Respect the content warnings and any sensitive material specified.
    8. Aim for the specified word count, balancing dialogue, description, and action for a well-rounded chapter.
    9. Make sure the special characters are escaped in the output, i.e. " -> \\"

    Output Format (in JSON):
    {
      "chapterName": <generated chapter name>,
      "chapterContent": <generated chapter content>
    }

        Please generate the next chapter, ensuring it fits seamlessly within the existing story framework.
    `;
            await Brand.updateMany({ storyId: storyId, status: "approved" }, { $set: { status: "completed" } });

    } else {
        prompt = `
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

    ### IMPORTANT:
    Direction for the next chapter: ${direction ?? "No direction provided by the author"}

    Instructions for generating the next chapter:
    1. Make sure the chapter follows the direction provided by the author.
    2. Create a compelling chapter that aligns with the story details and adheres to the tone, style, and guidelines provided.
    3. Build on the previous chapter's events and ensure continuity with the recap of earlier chapters.
    4. Develop character arcs, plot progression, and thematic elements as appropriate for the narrative.
    5. Respect the content warnings and any sensitive material specified.
    6. Aim for the specified word count, balancing dialogue, description, and action for a well-rounded chapter.
    7. Make sure the special characters are escaped in the output, i.e. " -> \\"

    Output Format (in JSON):
    {
      "chapterName": <generated chapter name>,
      "chapterContent": <generated chapter content>
    }

        Please generate the next chapter, ensuring it fits seamlessly within the existing story framework.
    `;
    }

    let newChap = await generate(prompt);
    console.log("New Chapter: ", newChap)
    if (newChap?.startsWith("```json")) {
        newChap = newChap.slice(7);
    }
    if (newChap?.endsWith("```")) {
        newChap = newChap.slice(0, -3);
    }
    console.log("New Chapter Treated: ", newChap)
    let newChapterContent;
    try {
        newChapterContent = JSON.parse(newChap ?? "{}")
    } catch (error) {
        console.log("Error: ", error)
        try {
            newChapterContent = parseUntilJson(newChap ?? "");
        } catch (error) {
            console.log("Error: ", error)
            return NextResponse.json({ success: false, error: "Error parsing JSON" }, { status: 500 });
        }
    }

    let finalContent = newChapterContent.chapterContent;

    if (brandDeals.length > 0) {
        const deals = brandDeals.map(deal => `${deal.name} - ${deal.product} - ${deal.description}`).join("\n");
        const reflectedContent = await reflectBrandDeals(deals, newChapterContent.chapterContent);
        if (reflectedContent.changed) {
            finalContent = reflectedContent.chapterContent;
        }
    }

    const recPrompt = `
        You are a professional recap writer. Your task is to generate a clear, engaging, and concise recap for a given chapter of a story. 
        
        Please follow these guidelines:
        
        1. **Understand the Chapter**: Carefully read and analyze the content of the chapter to grasp its key events, character developments, and plot progression.
        
        2. **Identify Core Elements**: Focus on summarizing the main events, conflicts, and resolutions. Highlight pivotal moments that drive the narrative forward.
        
        3. **Maintain Tone and Style**: Match the recap's tone to the story's genre (e.g., suspenseful for a thriller, whimsical for a fantasy). Keep the language immersive and captivating.
        
        4. **Be Concise Yet Comprehensive**: Aim for a balance between brevity and detail. Avoid unnecessary information but ensure critical points are covered.
        
        5. **Output Format**: Return the recap in the following JSON format:
        
        {
          "recap": "<generated recap>"
        }
        
        Here's the chapter content:
        
        Chapter: ${finalContent}
        `
    let rc = await generate(recPrompt);
    if (rc?.startsWith("```json")) {
        rc = rc.slice(7);
    }
    if (rc?.endsWith("```")) {
        rc = rc.slice(0, -3);
    }
    let recP;
    try {
        recP = JSON.parse(rc ?? "{}").recap
    } catch (error) {
        console.log("Error: ", error)
        recP = parseUntilJson(rc ?? "");
    }

    const newChapterData = {
        story: storyId,
        number: chapter.number + 1,
        title: newChapterContent.chapterName,
        content: finalContent,
        recap: recP,
        user: userData._id
    }

    const newCharacters = await checkForNewCharacters(characters, finalContent);
    console.log("New Characters: ", newCharacters)
    if (newCharacters.newCharacters.length > 0) {
        story.characters.push(...newCharacters.newCharacters);
        await story.save();
    }

    const newChapter = await Chapter.create(newChapterData);

    return NextResponse.json({ success: true, chapter: newChapter }, { status: 200 });
}

export {
    postHandler as POST
}