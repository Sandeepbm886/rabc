import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generated_signature === razorpay_signature) {
            return NextResponse.json({ success: true }, { status: 200 });
        } else {
            return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
        }
    } catch (error) {
        console.error("Payment verification failed:", error);
        return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
    }
}
