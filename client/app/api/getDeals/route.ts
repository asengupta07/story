import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongo";
import { Brand, Story } from "@/models/schema";

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
            return NextResponse.json({ error: "Story not found" }, { status: 404 });
        }

        const existingBrandDeals = await Brand.find({ storyId: storyId });

        return NextResponse.json({ existingBrandDeals }, { status: 200 });
    } catch (error) {
        console.error("Error fetching brand deals:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

async function postHandler(request: NextRequest) {
    try {
        const { status, dealId } = await request.json();

        await connectToDatabase();

        const brandDeal = await Brand.findById(dealId);
        if (!brandDeal) {
            return NextResponse.json({ error: "Brand deal not found" }, { status: 404 });
        }

        brandDeal.status = status;
        await brandDeal.save();
        console.log("Brand deal status updated")
        return NextResponse.json({ message: "Brand deal status updated" }, { status: 200 });
    } catch (error) {
        console.error("Error updating brand deal status:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export { getHandler as GET, postHandler as POST };
