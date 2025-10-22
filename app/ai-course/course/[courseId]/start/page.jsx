"use client";
import React, { use, useEffect, useState } from 'react'

import { and, eq } from 'drizzle-orm';
import ChapterListCard from './_components/ChapterListCard';
import ChapterContent from './_components/ChapterContent';
import { db } from '../../../../../configs/db';
import { Chapters, CourseList } from '../../../../../configs/schema';
import ChapterQuiz from './_components/ChapterQuiz';

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

    const GetCourse = async () => {
        const result = await db.select().from(CourseList)
            .where(eq(CourseList?.courseId, unwrappedParams?.courseId))

        setCourse(result[0]);
    }

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
                </div>
            </div>
            <div className='md:ml-64'>
                {!quizMode ? (
                    <ChapterContent chapter={selectedChapter} content={chapterContent} />
                ) : (
                    chapterContent ? <ChapterQuiz content={chapterContent.content} /> : <p>Loading quiz...</p>
                )}
            </div>

        </div>
    )
}

export default CourseStart