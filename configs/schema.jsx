import { boolean, integer } from "drizzle-orm/gel-core";
import { json, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const CourseList=pgTable('courseList',{
    id:serial('id').primaryKey(),
    courseId:varchar('courseId').notNull(),
    courseName:varchar('courseName').notNull(),
    category:varchar('category').notNull(),
    level:varchar('level').notNull(),
    includeVideo:varchar('includeVideo').notNull().default('Yes'),
    duration:varchar('duration').notNull(),
    courseOutput:json('courseOutput').notNull(),
    createdBy:varchar('createdBy').notNull(),
    userName:varchar('userName'),
    userProfileImage:varchar('userProfileImage'),
    publish:varchar('publish').notNull().default('No'),
})

export const Chapters=pgTable('Chapters',{
    id:serial('id').primaryKey(),
    courseId:varchar('courseId').notNull(),
    chapterId:integer('chapterId').notNull(),
    content:json('content').notNull(),
    videoId:varchar('videoId'),
    quizMarks: integer('quizMarks').default(0).notNull(),
    finished: boolean('finished').default(false).notNull(),
    totalquizquestions:integer('totalquizquestions').default(0).notNull()
})

export const Users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkUserId: varchar("clerkUserId").notNull().unique(),
  courseLimit: integer("courseLimit").notNull().default(5),
});