"use server";

import stripe from "../../lib/stripe";
import baseUrl from "../../lib/baseUrl";

import { urlFor } from "../../sanity/lib/image";
import getCourseById from "../../sanity/lib/courses/getCourseById";
import { createStudentIfNotExists } from "../../sanity/lib/student/createStudentIfNotExists";
import { clerkClient } from "@clerk/nextjs/server";
import { createEnrollment } from "../../sanity/lib/student/createEnrollment";

export async function createStripeCheckout(courseId, userId) {
  try {
    console.log("⚡ createStripeCheckout called with:", { courseId, userId });

    // 1. Query course details from Sanity
    const course = await getCourseById(courseId);
    console.log("📦 Course fetched from Sanity:", course);

    const clerkUser = await (await clerkClient()).users.getUser(userId);
    console.log("👤 Clerk user fetched:", clerkUser);

    const { emailAddresses, firstName, lastName, imageUrl } = clerkUser;
    const email = emailAddresses[0]?.emailAddress;

    console.log("✉️ Email found:", email);
    if (!emailAddresses || !email) {
      throw new Error("User details not found");
    }

    if (!course) {
      throw new Error("Course not found");
    }

    // mid step - create a user in sanity if it doesn't exist
    const user = await createStudentIfNotExists({
      clerkId: userId,
      email: email || "",
      firstName: firstName || email,
      lastName: lastName || "",
      imageUrl: imageUrl || "",
    });

    console.log("🧑‍🎓 Sanity user:", user);

    if (!user) {
      throw new Error("User not found");
    }

    // 2. Validate course data and prepare price for Stripe
    if (!course.price && course.price !== 0) {
      throw new Error("Course price is not set");
    }
    const priceInCents = Math.round(course.price * 100);
    console.log("💲 Price in cents:", priceInCents);

    // if course is free, create enrollment and redirect to course page (BYPASS STRIPE CHECKOUT)
    if (priceInCents === 0) {
      await createEnrollment({
        studentId: user._id,
        courseId: course._id,
        paymentId: "free",
        amount: 0,
      });
      console.log("✅ Free course enrollment created");

      return { url: `/lms/courses/${course.slug?.current}` };
    }

    const { title, description, image, slug } = course;
    console.log("📚 Course details:", { title, description, slug });

    if (!title || !description || !image || !slug) {
      throw new Error("Course data is incomplete");
    }

    // 3. Create and configure Stripe Checkout Session with course details
    console.log("🔑 Creating Stripe session with metadata:", {
      courseId: course._id,
      userId: userId,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: title,
              description: description,
              images: [urlFor(image).url() || ""],
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/lms/courses/${slug.current}`,
      cancel_url: `${baseUrl}/lms/courses/${slug.current}?canceled=true`,
      metadata: {
        courseId: course._id,
        userId: userId,
      },
    });

    console.log("🛒 Stripe session created:", session.id);
    console.log("📝 Metadata sent to Stripe:", session.metadata);

    // 4. Return checkout session URL for client redirect
    return { url: session.url };
  } catch (error) {
    console.error("❌ Error in createStripeCheckout:", error);
    throw new Error("Failed to create checkout session");
  }
}
