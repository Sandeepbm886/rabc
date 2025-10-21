"use client"
import React, { useContext } from 'react'
import UserNameWrapper from './UserNameWrapper'
import { Button } from '../../../../components/ui/button'
import Link from 'next/link'
import { UserCourseListContext } from '../../_context/UserCourseListContext'

function Addcourse() {
  const { userCourseList, setUserCourseList } = useContext(UserCourseListContext)
  return (
    <div className='flex justify-between items-center'>
      <div>
        <h2 className='text-2xl font-bold'>Hello, <span><UserNameWrapper /></span></h2>
        <p className='text-sm text-gray-500'>Create new course with AI</p>
      </div>
      <Link href={userCourseList.length >= 5 ? '/ai-course/upgrade' : '/ai-course/create-course'} className='flex items-center'>
        <Button className="hover:cursor-pointer">{userCourseList.length >= 5 ? 'Upgrade' : '+ Create course'}</Button>
      </Link>
    </div>
  )
}

export default Addcourse