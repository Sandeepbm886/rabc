import { client } from "../adminClient";



export async function createEnrollment({
  studentId,
  courseId,
  paymentId,
  amount,
}) {
  return client.create({
    _type: "enrollment",
    student: {
      _type: "reference",
      _ref: studentId,
    },
    course: {
      _type: "reference",
      _ref: courseId,
    },
    paymentId,
    amount,
    enrolledAt: new Date().toISOString(),
  });
}
