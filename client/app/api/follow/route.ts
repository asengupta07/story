import { NextRequest, NextResponse } from "next/server";
import { Follow, User, StoryStatus } from "@/models/schema";
import connectToDatabase from "@/lib/mongo";


async function getHandler(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const storyId = searchParams.get('storyId');
    const email = searchParams.get('email');

    

    await connectToDatabase();
    const user = await User.findOne({ email: email });
    const userId = user?._id;
    if (!userId) {
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }
    const follow = await Follow.findOne({ user: userId, story: storyId });
    if (follow) {
        return NextResponse.json({ success: true, follow: true });
    }
    return NextResponse.json({ success: true, follow: false });
}

async function postHandler(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const storyId = searchParams.get('storyId');
    const email = searchParams.get('email');

    await connectToDatabase();
    const user = await User.findOne({ email: email });
    if (!user) {
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }
    const storyStatus = await StoryStatus.findOne({ story: storyId });
    if (!storyStatus) {
        return NextResponse.json({ success: false, error: "Story status not found" }, { status: 404 });
    }
    storyStatus.numReaders++;
    storyStatus.readers.push(user._id);
    await storyStatus.save();
    const follow = await Follow.create({ user: user._id, story: storyId });
    if (follow) {
        return NextResponse.json({ success: true, follow: true });
    }
    return NextResponse.json({ success: false, error: "Failed to follow story" }, { status: 500 });
}

async function deleteHandler(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const storyId = searchParams.get('storyId');
    const email = searchParams.get('email');

    await connectToDatabase();
    const user = await User.findOne({ email: email });
    if (!user) {
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }
    const storyStatus = await StoryStatus.findOne({ story: storyId });
    if (!storyStatus) {
        return NextResponse.json({ success: false, error: "Story status not found" }, { status: 404 });
    }
    storyStatus.numReaders--;
    storyStatus.readers = storyStatus.readers.filter((reader: any) => reader.toString() !== user._id.toString());
    await storyStatus.save();
    const follow = await Follow.findOneAndDelete({ user: user._id, story: storyId });
    if (follow) {
        return NextResponse.json({ success: true, follow: false });
    }
    return NextResponse.json({ success: false, error: "Failed to unfollow story" }, { status: 500 });
}

export { getHandler as GET, postHandler as POST, deleteHandler as DELETE };
