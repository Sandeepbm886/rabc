"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../../../configs/db";
import { Chapters, CourseList } from "../../../../configs/schema";
import { useUser } from "@clerk/nextjs";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "../../../../components/ui/card";
import { Progress } from "../../../../components/ui/progress";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { Separator } from "../../../../components/ui/separator";
import { BookOpen, BarChart3, GraduationCap } from "lucide-react";
import { cn } from "../../../../lib/utils";
import { eq } from "drizzle-orm";

export default function GlobalAnalyticsPage() {
    const [courses, setCourses] = useState([]);
    const [chapters, setChapters] = useState([]);
    const { user } = useUser();
    useEffect(() => {
        fetchUserData();
    }, [user]);

 // get logged-in user

    const fetchUserData = async () => {
        if (!user) return;

        try {
            // fetch only courses created by this user
            const userCourses = await db.select().from(CourseList)
                .where(eq(CourseList.createdBy, user.primaryEmailAddress?.emailAddress));

            // get all chapters belonging to these courses
            const courseIds = userCourses.map(c => c.courseId);
            const userChapters = courseIds.length > 0
                ? await db.select().from(Chapters)
                    .where(ch => courseIds.includes(ch.courseId))
                : [];

            setCourses(userCourses);
            setChapters(userChapters);
        } catch (err) {
            console.error("DB error:", err);
        }
    };

    // --- COMPUTED STATS ---
    const totalCourses = courses.length;
    const totalChapters = chapters.length;
    const totalFinished = chapters.filter((ch) => ch.finished).length;

    const avgCompletionRate =
        totalChapters > 0 ? Math.round((totalFinished / totalChapters) * 100) : 0;

    const avgQuizScore =
        totalChapters > 0
            ? Math.round(
                chapters.reduce(
                    (acc, ch) =>
                        acc + (ch.totalquizquestions > 0
                            ? (ch.quizMarks / ch.totalquizquestions) * 100
                            : 0),
                    0
                ) / totalChapters
            )
            : 0;

    // --- GROUP CHAPTERS BY COURSE ---
    const chaptersByCourse = courses.map((course) => {
        const related = chapters.filter((ch) => ch.courseId === course.courseId);
        const finished = related.filter((c) => c.finished).length;
        const completion =
            related.length > 0
                ? Math.round((finished / related.length) * 100)
                : 0;
        const avgScore =
            related.length > 0
                ? Math.round(
                    related.reduce(
                        (acc, ch) =>
                            acc +
                            (ch.totalquizquestions > 0
                                ? (ch.quizMarks / ch.totalquizquestions) * 100
                                : 0),
                        0
                    ) / related.length
                )
                : 0;
        return {
            ...course,
            chapters: related.length,
            completion,
            avgScore,
        };
    });

    // --- UI ---
    return (
        <div className="min-h-screen bg-white text-black p-6 md:p-10">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Platform Analytics
                        </h1>
                        <p className="text-gray-500">
                            Overview of all courses, progress, and performance metrics
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-100 rounded-xl">
                            <GraduationCap className="w-6 h-6 text-gray-800" />
                        </div>
                        <div className="p-3 bg-gray-100 rounded-xl">
                            <BarChart3 className="w-6 h-6 text-gray-800" />
                        </div>
                        <div className="p-3 bg-gray-100 rounded-xl">
                            <BookOpen className="w-6 h-6 text-gray-800" />
                        </div>
                    </div>
                </div>

                {/* Top Summary Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="bg-gray-50 border border-gray-200">
                        <CardHeader>
                            <CardTitle>Total Courses</CardTitle>
                            <CardDescription>{totalCourses}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-500">Registered Courses</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-50 border border-gray-200">
                        <CardHeader>
                            <CardTitle>Average Quiz Score</CardTitle>
                            <CardDescription>{avgQuizScore}%</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Progress value={avgQuizScore} className="h-2 bg-gray-200" />
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-50 border border-gray-200">
                        <CardHeader>
                            <CardTitle>Average Completion Rate</CardTitle>
                            <CardDescription>{avgCompletionRate}%</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Progress value={avgCompletionRate} className="h-2 bg-gray-200" />
                        </CardContent>
                    </Card>
                </div>

                <Separator className="bg-gray-200" />

                {/* Per Course Performance */}
                <Card className="bg-white border border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">
                            Course Breakdown
                        </CardTitle>
                        <CardDescription>
                            Overview of each course’s chapters, completion, and quiz scores
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[550px] pr-4">
                            <div className="space-y-4">
                                {chaptersByCourse.map((course) => (
                                    <div
                                        key={course.courseId}
                                        className={cn(
                                            "p-5 border rounded-lg transition-all duration-200",
                                            "bg-gray-50 hover:bg-gray-100 border-gray-200"
                                        )}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <div>
                                                <h2 className="font-semibold text-lg">
                                                    {course.courseName}
                                                </h2>
                                                <p className="text-sm text-gray-500">
                                                    {course.chapters} Chapters • {course.level}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500">Completion</p>
                                                <p className="font-semibold text-black">
                                                    {course.completion}%
                                                </p>
                                            </div>
                                        </div>

                                        {/* Progress bars */}
                                        <div className="space-y-2 mt-3">
                                            <div>
                                                <p className="text-xs text-gray-600 mb-1">
                                                    Chapter Completion
                                                </p>
                                                <Progress
                                                    value={course.completion}
                                                    className="h-2 bg-gray-200"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600 mb-1">
                                                    Average Quiz Score
                                                </p>
                                                <div className="h-2 w-full bg-gray-200 rounded">
                                                    <div
                                                        className="h-2 bg-black rounded"
                                                        style={{ width: `${course.avgScore}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {chaptersByCourse.length === 0 && (
                                    <p className="text-gray-400 text-sm italic text-center">
                                        No course data available.
                                    </p>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
