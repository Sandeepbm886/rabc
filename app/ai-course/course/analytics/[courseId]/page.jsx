"use client";

import React, { use, useEffect, useState } from "react";
import { db } from "../../../../../configs/db";
import { Chapters, CourseList } from "../../../../../configs/schema";
import { eq } from "drizzle-orm";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "../../../../../components/ui/card";
import { Progress } from "../../../../../components/ui/progress";
import { ScrollArea } from "../../../../../components/ui/scroll-area";
import { Separator } from "../../../../../components/ui/separator";
import { cn } from "../../../../../lib/utils";
import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";
import { Home } from "lucide-react";


export default function AnalyticsPage({ params }) {
    const unwrappedParams = use(params);   
    const [course, setCourse] = useState(null);
    const [chapters, setChapters] = useState([]);

    useEffect(() => {
        if (unwrappedParams?.courseId) {
            fetchData();
        }
    }, [unwrappedParams]);

    const fetchData = async () => {
        const courseRes = await db
            .select()
            .from(CourseList)
            .where(eq(CourseList.courseId, unwrappedParams.courseId));

        const chapterRes = await db
            .select()
            .from(Chapters)
            .where(eq(Chapters.courseId, unwrappedParams.courseId));

        setCourse(courseRes[0]);
        setChapters(chapterRes);
    };

    // Compute overall stats
    const totalChapters = chapters.length;
    const completedChapters = chapters.filter((ch) => ch.finished).length;
    const averageScore =
        chapters.length > 0
            ? Math.round(
                chapters.reduce((acc, c) => acc + (c.quizMarks || 0), 0) / chapters.length
            )
            : 0;

    return (
        <div className="min-h-screen bg-white text-black p-6 md:p-10">
            <div className="max-w-6xl mx-auto space-y-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Course Analytics
                        </h1>
                        <p className="text-gray-500">
                            Insights and progress for{" "}
                            <span className="font-medium text-black/80">
                                {course?.courseName || "Loading..."}
                            </span>
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href={`/ai-course/course/${course?.courseId}/start`} className="p-3 bg-gray-100 rounded-xl">
                            <ArrowLeftCircle className="w-6 h-6 text-gray-800" />
                        </Link>
                        <Link href={"/ai-course"} className="p-3 bg-gray-100 rounded-xl">
                            <Home className="w-6 h-6 text-gray-800" />
                        </Link>
                        
                    </div>
                </div>

                {/* Overview Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="bg-gray-50 border border-gray-200">
                        <CardHeader>
                            <CardTitle>Chapters Completed</CardTitle>
                            <CardDescription>
                                {completedChapters}/{totalChapters}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Progress
                                value={(completedChapters / Math.max(totalChapters, 1)) * 100}
                                className="h-2 bg-gray-200"
                            />
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-50 border border-gray-200">
                        <CardHeader>
                            <CardTitle>Average Quiz Score</CardTitle>
                            <CardDescription>{averageScore}%</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-2 w-full bg-gray-200 rounded">
                                <div
                                    className="h-2 rounded bg-black"
                                    style={{ width: `${averageScore}%` }}
                                ></div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-50 border border-gray-200">
                        <CardHeader>
                            <CardTitle>Completion Rate</CardTitle>
                            <CardDescription>
                                {Math.round(
                                    (completedChapters / Math.max(totalChapters, 1)) * 100
                                )}
                                %
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-2 w-full bg-gray-200 rounded">
                                <div
                                    className="h-2 rounded bg-gray-800"
                                    style={{
                                        width: `${(completedChapters /
                                            Math.max(totalChapters, 1)) *
                                            100}%`,
                                    }}
                                ></div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Separator className="bg-gray-200" />

                {/* Detailed Chapter Breakdown */}
                <Card className="bg-white border border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">
                            Chapter Performance
                        </CardTitle>
                        <CardDescription>
                            View progress and quiz scores for each chapter
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[500px] pr-4">
                            <div className="space-y-4">
                                {chapters.map((ch, idx) => (
                                    <div
                                        key={ch.id}
                                        className={cn(
                                            "p-4 rounded-lg border transition-all duration-200",
                                            ch.finished
                                                ? "bg-gray-50 border-gray-200 hover:bg-gray-100"
                                                : "bg-white border-gray-100 hover:bg-gray-50"
                                        )}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h2 className="font-medium text-lg">
                                                    Chapter {idx + 1}
                                                </h2>
                                                <p className="text-sm text-gray-500">
                                                    {ch.finished
                                                        ? "Completed"
                                                        : "Not completed yet"}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <p className="font-semibold text-gray-900">
                                                    {ch.quizMarks} / {ch.totalquizquestions}
                                                </p>
                                                <p className="text-xs text-gray-500">Quiz Marks</p>
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            <Progress
                                                value={
                                                    (ch.quizMarks / Math.max(ch.totalquizquestions, 1)) *
                                                    100
                                                }
                                                className="h-2 bg-gray-200"
                                            />
                                        </div>
                                    </div>
                                ))}
                                {chapters.length === 0 && (
                                    <p className="text-gray-400 text-sm italic">
                                        No chapter data available yet.
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
