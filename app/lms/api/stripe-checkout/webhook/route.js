import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStudentByClerkId } from "../../../../../sanity/lib/student/getStudentByClerkId";
import { createEnrollment } from "../../../../../sanity/lib/student/createEnrollment";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-09-30",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  console.log("⚡ Incoming Stripe webhook call...");

  try {
    // Read the raw body
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    console.log("🧾 Raw body length:", body?.length || 0);
    console.log("🔐 Stripe signature header:", signature ? "Present ✅" : "Missing ❌");

    if (!signature) {
      console.log("❌ No signature found in headers");
      return new NextResponse("No signature found", { status: 400 });
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log(`✅ Verified event: ${event.type}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error(`❌ Webhook signature verification failed: ${errorMessage}`);
      return new NextResponse(`Webhook Error: ${errorMessage}`, { status: 400 });
    }

    // --- Handle specific events ---
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("💬 Checkout session completed:", {
        id: session.id,
        payment_status: session.payment_status,
        amount_total: session.amount_total,
        metadata: session.metadata,
      });

      // Extract metadata
      const courseId = session.metadata?.courseId;
      const userId = session.metadata?.userId;

      console.log("📦 Extracted metadata:", { courseId, userId });

      if (!courseId || !userId) {
        console.error("❌ Missing metadata:", { courseId, userId });
        return new NextResponse("Missing metadata", { status: 400 });
      }

      // Fetch student
      console.log("👤 Looking up student by Clerk ID:", userId);
      const student = await getStudentByClerkId(userId);
      console.log("🔎 Student lookup result:", student);

      if (!student?.data) {
        console.error("❌ Student not found for Clerk ID:", userId);
        return new NextResponse("Student not found", { status: 400 });
      }

      // Create enrollment
      console.log("🧾 Creating enrollment with data:", {
        studentId: student.data._id,
        courseId,
        paymentId: session.id,
        amount: session.amount_total / 100,
      });

      await createEnrollment({
        studentId: student.data._id,
        courseId,
        paymentId: session.id,
        amount: session.amount_total / 100,
      });

      console.log("✅ Enrollment successfully created for:", {
        studentId: student.data._id,
        courseId,
      });

      return new NextResponse(null, { status: 200 });
    }

    console.log("ℹ️ Unhandled event type:", event.type);
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("💥 Error in webhook handler:", error);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }
}
