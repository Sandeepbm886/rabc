import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "../../../../configs/db";
import { Users } from "../../../../configs/schema";

import { getAuth } from "@clerk/nextjs/server";
export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        console.log("🆔 Clerk userId =>", userId);

        if (!userId) {
            return NextResponse.json({
                success: false,
                error: "Unauthenticated"
            }, { status: 401 });
        }

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            amount,
        } = await request.json();

        // Razorpay signature validation
        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generated_signature !== razorpay_signature) {
            return NextResponse.json({ success: false }, { status: 400 });
        }

        // ✅ Plan logic (SET NEW LIMIT)
        let newLimit = 5;
        if (amount == 100) newLimit = 10;
        else if (amount == 399) newLimit = 25;
        else if (amount == 999) newLimit = 50;

        // ✅ Insert user if not exist
        await db
            .insert(Users)
            .values({ clerkUserId: userId, courseLimit: newLimit })
            .onConflictDoUpdate({
                target: Users.clerkUserId,
                set: { courseLimit: newLimit },
            });

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
    }
}
