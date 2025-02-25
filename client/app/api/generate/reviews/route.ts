import { generate } from "@/functions/generate";
import { Story } from "@/models/schema";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongo";


async function getHandler(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const storyId = searchParams.get('storyId');
    await connectToDatabase();
    const story = await Story.findById(storyId);

    if (!story) {
        return NextResponse.json({ success: false, error: "Story not found" }, { status: 404 });
    }

    const { title, genre, tone, targetAudience, premise, setting, timePeriod, characters, themes, moral, writingStyle } = story;

    const prompt = `You are a book review generator. You are given a story and you need to generate great fake reviews for it.

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
    Moral: ${moral}
    Writing Style: ${writingStyle}


    Review Guidelines:
    1. The review should be 1-2 sentences long.
    2. The review should be written in the style of a real book review.
    3. The review should be positive and highlight the story's strengths.
    4. The review should be fake and not real.
    5. The review should look like it was written by a real person.
    6. The review should be fun and catchy.
    7. Provide the review in the given JSON format.
    8. Do not include any other text than the JSON.
    9. Do not include any text or backticks before or after the JSON.

    Output Format:
    {
        "reviews": [
            "Review 1",
            "Review 2",
            "Review 3"
        ]
    }`

    let res = await generate(prompt);

    if (res?.startsWith("```json")) {
        res = res.slice(7);
    }
    if (res?.startsWith("```")) {
        res = res.slice(3);
    }
    if (res?.endsWith("```")) {
        res = res.slice(0, -3);
    }
    const reviews = JSON.parse(res ?? "{}");

    const newsPrompt = `You are a newspaper review generator. You are given a story and you need to generate great fake reviews for it. Make it seem like a bestseller all accross the world.

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
    Moral: ${moral}
    Writing Style: ${writingStyle}

    Output Format:
    {
        "reviews": [
            {
                "source": "New York Times",
                "quote": "A thrilling and engaging story that kept me on the edge of my seat.",
                "rating": 4.5
            },
            {
                "source": "The Guardian",
                "quote": "A masterful blend of mystery and adventure that kept me guessing until the very end.",
                "rating": 4.8
            }
        ]
    }
    
    Review Guidelines:
    1. Each review should be 1-2 sentences long.
    2. Each review should be written in the style of a real book review.
    3. Each review should be positive and highlight the story's strengths.
    4. Each review should look like it was written by a real person.
    5. Each review should be fun and catchy.
    6. Source names should be well known newspapers.
    7. The rating should be between 4 and 5.
    8. Do not include any other text than the JSON.
    9. Do not include any text or backticks before or after the JSON.`

    let newsRes = await generate(newsPrompt);

    if (newsRes?.startsWith("```json")) {
        newsRes = newsRes.slice(7);
    }
    if (newsRes?.startsWith("```")) {
        newsRes = newsRes.slice(3);
    }
    if (newsRes?.endsWith("```")) {
        newsRes = newsRes.slice(0, -3);
    }
    const newsReviews = JSON.parse(newsRes ?? "{}");

    return NextResponse.json({ success: true, reviews: reviews.reviews, newsReviews: newsReviews.reviews }, { status: 200 });
}

export { getHandler as GET };