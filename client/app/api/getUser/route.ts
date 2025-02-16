import { NextRequest, NextResponse } from "next/server";
import { User } from "@/app/models/schema";
import connectToDatabase from "@/app/lib/mongo";

async function getHandler(request: NextRequest) {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
        return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    const user = await User.findOne({ publicKey: address });

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    return NextResponse.json({ user }, { status: 200 });
}

export {
    getHandler as GET
};