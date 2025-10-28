"use client";
import React, { use, useEffect, useState } from 'react'

import { and, eq } from 'drizzle-orm';
import ChapterListCard from './_components/ChapterListCard';
import ChapterContent from './_components/ChapterContent';
import { db } from '../../../../../configs/db';
import { Chapters, CourseList } from '../../../../../configs/schema';
import ChapterQuiz from './_components/ChapterQuiz';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowBigLeftDash } from 'lucide-react';
import { IoAnalytics } from 'react-icons/io5';

function CourseStart({ params }) {
    const unwrappedParams = use(params);

    const [course, setCourse] = useState(null);
    const [selectedChapter, setSelectedChapter] = useState();
    const [chapterContent, setChapterContent] = useState();
    const [selectedIndex, setselectedIndex] = useState();
    const [quizMode, setQuizMode] = useState(false);
    useEffect(() => {
        unwrappedParams && GetCourse();
    }, [unwrappedParams]);
    useEffect(() => {
        if (course?.courseOutput?.["Chapters"]?.length > 0) {
            const firstChapter = course.courseOutput["Chapters"][0];
            setSelectedChapter(firstChapter);
            GetContent(0);
        }
    }, [course]);


    const GetCourse = async () => {
        const result = await db.select().from(CourseList)
            .where(eq(CourseList?.courseId, unwrappedParams?.courseId))

        setCourse(result[0]);
    }
    const handleNext = async () => {
        if (!course?.courseOutput?.["Chapters"]) return;

        const chapters = course.courseOutput["Chapters"];
        const currentIndex = chapters.findIndex(
            (c) => c?.["Chapter Name"] === selectedChapter?.["Chapter Name"]
        );

        const nextIndex = currentIndex + 1;

        // ✅ Case 1: If there is another CHAPTER
        if (nextIndex < chapters.length) {
            const nextChapter = chapters[nextIndex];
            setSelectedChapter(nextChapter);
            setselectedIndex(null);
            setQuizMode(false);
            await GetContent(nextIndex);
            return;
        }

        // ✅ Case 2: If all chapters done → show QUIZ
        if (nextIndex === chapters.length) {
            const quizIndex = chapters.length - 1; // same quiz index as sidebar uses
            setselectedIndex(`quiz-${quizIndex}`);
            setSelectedChapter(null);
            setQuizMode(true);
            const result = await db
                .select()
                .from(Chapters)
                .where(
                    and(
                        eq(Chapters.chapterId, quizIndex),
                        eq(Chapters.courseId, course?.courseId)
                    )
                );
            setChapterContent(result[0]);
        }
    };


    const GetContent = async (chapterId) => {
        const result = await db.select().from(Chapters)
            .where(and(eq(Chapters.chapterId, chapterId), eq(Chapters.courseId, course?.courseId)));
        setChapterContent(result[0]);
    }
    return (
        <div>
            <div className="fixed md:w-72 hidden md:block h-screen overflow-y-auto border-r shadow-sm custom-scrollbar">
                <h2 className='font-medium text-lg bg-primary p-3 text-white'>{course?.courseOutput?.["Course Name"]}</h2>
                <div>
                    {course?.courseOutput?.["Chapters"]?.map((chapter, index) => (
                        <div key={index + 3}>
                            <div key={index} className={`cursor-pointer border-b  ${selectedChapter?.["Chapter Name"] == chapter?.["Chapter Name"] ? "bg-purple-100" : ""} flex flex-col justify-center items-center gap-2 p-3`}
                                onClick={() => {
                                    setSelectedChapter(chapter);
                                    GetContent(index);
                                    setselectedIndex(null)
                                    setQuizMode(false)
                                }}>
                                <ChapterListCard chapter={chapter} index={index} />
                            </div>
                            <div
                                key={`quiz-${index}`}
                                className={`cursor-pointer border-b ${selectedIndex === `quiz-${index}` ? "bg-purple-100" : ""
                                    } flex flex-col justify-center items-center gap-2 p-3`}
                                onClick={async () => {
                                    setselectedIndex(`quiz-${index}`);
                                    setSelectedChapter(null)
                                    setQuizMode(true)
                                    const result = await db.select().from(Chapters)
                                        .where(and(eq(Chapters.chapterId, index), eq(Chapters.courseId, course?.courseId)));
                                    setChapterContent(result[0]);
                                }}
                            >
                                <ChapterListCard chapter={"quiz"} index={index} />
                            </div>

                        </div>
                    ))
                    }
                    <div className='flex p-2 justify-center gap-2 font-bold border-b-2 items-center cursor-pointer hover:scale-[1.0] transition-all duration-200 group'>
                        <ArrowBigLeftDash className='group-hover:translate-x-[-3px] transition-all duration-200' />
                        <Link href={"/ai-course"}>
                            To dashboard
                        </Link>
                    </div>
                    <div className="flex items-center justify-center gap-3 p-2  rounded-xl cursor-pointer
    shadow-[5px_5px_rgba(0,_98,_90,_0.4),_10px_10px_rgba(0,_98,_90,_0.3),_15px_15px_rgba(0,_98,_90,_0.2),_20px_20px_rgba(0,_98,_90,_0.1),_25px_25px_rgba(0,_98,_90,_0.05)]
    hover:scale-[1.0] transition-all duration-200 group"
                    >
                        <IoAnalytics className="w-8 h-8 text-teal-700 group-hover:translate-x-[-3px] transition-all duration-200" />

                        <Link href={`/ai-course/course/analytics/${course?.courseId}`} className="flex flex-col">
                            <h1 className="text-lg font-semibold leading-tight text-gray-900">
                                Finished course?
                            </h1>
                            <h3 className="text-sm text-gray-600 group-hover:text-teal-700 transition-colors">
                                Get Analytics ↗
                            </h3>
                        </Link>
                    </div>

                </div>
            </div>
            <div className='md:ml-64'>
                {!quizMode ? (
                    <ChapterContent chapter={selectedChapter} content={chapterContent} onNext={handleNext} />
                ) : (
                    chapterContent ? <ChapterQuiz
                        content={chapterContent.content}
                        courseId={chapterContent.courseId}
                        chapterId={chapterContent.chapterId}
                    />
                        : <p>Loading quiz...</p>
                )}
            </div>

        </div>
    )
}

export default CourseStart