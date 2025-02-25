import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/schema";
import connectToDatabase from "@/lib/mongo";

async function loginHandler(request: NextRequest) {
    await connectToDatabase();

    const { email, password } = await request.json();

    const user = await User.findOne({ email: email });
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }
    if (user.toObject().password !== password) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    return NextResponse.json({ success: true, user }, { status: 200 });
}

export {
    loginHandler as POST
}
