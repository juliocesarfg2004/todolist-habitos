import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"

export async function getSession() {
  return getServerSession(authOptions)
}

export async function requireAuth() {
  const session = await getSession()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }
  return session
}
