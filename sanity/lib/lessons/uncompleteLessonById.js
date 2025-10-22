import { client } from "../adminClient";
import { sanityFetch } from "../live";
import groq from "groq";



export async function uncompleteLessonById({
  lessonId,
  clerkId,
}) {
  // Get Sanity student ID from Clerk ID
  const student = await sanityFetch({
    query: groq`*[_type == "student" && clerkId == $clerkId][0]._id`,
    params: { clerkId },
  });

  if (!student.data) {
    throw new Error("Student not found");
  }

  // Find and delete the lesson completion record
  await client.delete({
    query: `*[_type == "lessonCompletion" && student._ref == $studentId && lesson._ref == $lessonId][0]`,
    params: { studentId: student.data, lessonId },
  });
}
