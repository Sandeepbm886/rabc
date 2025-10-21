import { auth } from '@clerk/nextjs/server'

export const getRole = async () => {
  const { sessionClaims } = await auth()
  return sessionClaims?.metadata.role
}