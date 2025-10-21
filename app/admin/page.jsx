import React from 'react'
import { auth } from '@clerk/nextjs/server'
const Admin = async() => {
  const { sessionClaims } = await auth()
const role=sessionClaims?.metadata.role
console.log(role)
  return (
    <div>
      <h1>Admins Only</h1>
      <h1></h1>
      </div>
  )
}

export default Admin