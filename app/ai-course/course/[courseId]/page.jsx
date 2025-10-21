"use client";
import React, { use, useEffect, useState } from 'react'
import { eq } from 'drizzle-orm'
import Header from '../../_components/Header';
import { db } from '../../../../configs/db';
import { CourseList } from '../../../../configs/schema';
import ChapterList from '../../create-course/[courseId]/_components/ChapterList';
import CourseBasicInfo from '../../create-course/[courseId]/_components/CourseBasicInfo';
import CourseDetail from '../../create-course/[courseId]/_components/CourseDetail';

function Course({ params }) {
    const unwrappedParams = use(params);
    const [course,setCourse]=useState([]);

    useEffect(() => {
        unwrappedParams&&GetCourse()
    }, [unwrappedParams])

    const GetCourse=async ()=>{
        const result=await db.select().from(CourseList)
        .where(eq(CourseList?.courseId, unwrappedParams?.courseId))
        console.log("Course Data:", result);
        setCourse(result[0]);
    }
    return (
        <div>
            <Header/>
            <div className='px-10 p-10 md:px-20 lg:px-44'>
            <CourseBasicInfo course={course} edit={false}/>
            <CourseDetail course={course}/>
            <ChapterList course={course} edit={false}/>
            </div>
        </div>
    )
}

export default Course