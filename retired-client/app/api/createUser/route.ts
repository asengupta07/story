import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongo";
import { User } from "@/models/schema";
import { UserInterface } from "@/types";


async function postHandler(request: NextRequest) {
    await connectToDatabase();

    const { alias, publicKey, role }: UserInterface = await request.json();

    const user = await User.create({ alias, publicKey, role });

    return NextResponse.json({ success: true, user }, { status: 200 });
}

export {
    postHandler as POST
};
