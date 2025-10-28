import { NextResponse } from "next/server";
import { db } from "../../../../configs/db";
import { Users } from "../../../../configs/schema";
import { eq } from "drizzle-orm";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        
        if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

        const [user] = await db.select().from(Users).where(eq(Users.clerkUserId, userId));
        return NextResponse.json({ courseLimit: user?.courseLimit || 5 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
