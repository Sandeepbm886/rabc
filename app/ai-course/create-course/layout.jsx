"use client"
import React, { useState } from 'react'
import Header from '../_components/Header'
import { UserInputContext } from '../_context/UserInputContext'

function CreateCourseLayout({ children }) {
  const [userCourseInput, setUserCourseInput] = useState([])
  return (
    <div>
      <UserInputContext.Provider value={{ userCourseInput, setUserCourseInput }}>
        <>
          <Header />
          {children}
        </>
      </UserInputContext.Provider>
    </div>
  )
}

export default CreateCourseLayout