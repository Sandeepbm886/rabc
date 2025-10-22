import { isEnrolledInCourse } from "../sanity/lib/student/isEnrolledInCourse";
import { getStudentByClerkId } from "../sanity/lib/student/getStudentByClerkId";
import getCourseById from "../sanity/lib/courses/getCourseById";



export async function checkCourseAccess(
  clerkId,
  courseId
){
  if (!clerkId) {
    return {
      isAuthorized: false,
      redirect: "/",
    };
  }

  const student = await getStudentByClerkId(clerkId);
  if (!student?.data?._id) {
    return {
      isAuthorized: false,
      redirect: "/",
    };
  }

  const isEnrolled = await isEnrolledInCourse(clerkId, courseId);
  const course = await getCourseById(courseId);
  if (!isEnrolled) {
    return {
      isAuthorized: false,
      redirect: `/lms/courses/${course?.slug?.current}`,
    };
  }

  return {
    isAuthorized: true,
    studentId: student.data._id,
  };
}
