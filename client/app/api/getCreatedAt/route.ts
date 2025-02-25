"use server";

import { NextRequest, NextResponse } from "next/server";
import { Story } from "@/models/schema";
import connectToDatabase from "@/lib/mongo";

async function getHandler(request: NextRequest) {
    try {
        console.log("hi");
        const { searchParams } = new URL(request.url);
        const storyId = searchParams.get('storyId');
        await connectToDatabase();
        const story = await Story.findById(storyId);
        if (!story) {
            return NextResponse.json({ error: "Story not found" }, { status: 403 });
        }
        const createdAt = story.createdAt;
        return NextResponse.json({ createdAt });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export { getHandler as GET };