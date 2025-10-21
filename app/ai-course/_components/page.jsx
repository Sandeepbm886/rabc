"use client"
import { useUser } from '@clerk/nextjs'
import React from 'react'

const User = () => {
  const { isSignedIn, user, isLoaded } = useUser()
  return (
    <div><h1>Users Area</h1></div>
  )
}

export default User