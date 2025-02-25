import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongo";
import { Chapter, Brand, Story, User } from "@/models/schema";

async function getHandler(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const storyId = searchParams.get("storyId");

        if (!storyId) {
            return NextResponse.json({ error: "Story ID is required" }, { status: 400 });
        }

        await connectToDatabase();

        const story = await Story.findById(storyId);
        if (!story) {
            console.log("Story not found");
            return NextResponse.json({ error: "Story not found" }, { status: 404 });
        }

        const chapters = await Chapter.find({ story: storyId });
        const brands = await Brand.find({ storyId: storyId });
        const user = await User.findById(story.user);

        if (!user) {
            console.log("User not found");
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const storyDetails = {
            title: story.title,
            author: user.alias,
            genre: story.genre,
            premise: story.premise,
            setting: story.setting,
            themes: story.themes,
            targetAudience: story.targetAudience
        };

        const chapterRecaps = chapters.map((chapter) => ({
            title: chapter.title,
            recap: chapter.recap
        }));

        const acceptedBrands = brands.filter((brand) => brand.status === "approved");

        const existingBrandDeals = acceptedBrands.map((brand) => ({
            brand: brand.name + " " + brand.product,
            description: brand.description
        }));

        return NextResponse.json({ storyDetails, chapterRecaps, existingBrandDeals }, { status: 200 });
    } catch (error) {
        console.error("Error in getHandler:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

async function postHandler(request: NextRequest) {
    try {
        const { name, product, description, storyId, publicKey } = await request.json();

        await connectToDatabase();

        const user = await User.findOne({ publicKey });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 401 });
        }

        const brand = await Brand.create({ name, product, description, storyId, brandId: user._id });

        return NextResponse.json({ brand }, { status: 200 });
    } catch (error) {
        console.error("Error in postHandler:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export { getHandler as GET, postHandler as POST };