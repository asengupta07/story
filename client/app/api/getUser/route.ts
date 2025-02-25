import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/schema";
import connectToDatabase from "@/lib/mongo";

async function getHandler(request: NextRequest) {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    return NextResponse.json({ user }, { status: 200 });
}

export {
    getHandler as GET
};