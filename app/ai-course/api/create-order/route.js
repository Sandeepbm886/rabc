import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
    try {
        const { amount } = await request.json(); // ✅ Get dynamic amount from frontend

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        const order = await razorpay.orders.create({
            amount: amount * 100, // Razorpay requires paise
            currency: "INR",
            receipt: "receipt_" + Math.random().toString(36).substring(7),
        });

        return NextResponse.json({ orderID: order.id }, { status: 200 });
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}
