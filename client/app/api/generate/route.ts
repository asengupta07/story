import { NextRequest, NextResponse } from "next/server";

async function postHandler(request: NextRequest) {
    const body = await request.json();
    const { prompt } = body;