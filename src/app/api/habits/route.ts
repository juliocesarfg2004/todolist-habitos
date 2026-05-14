import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import { Habit } from "@/models/Habit"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await connectDB()
  const habits = await Habit.find({ userId: session.user.id }).sort({
    createdAt: -1,
  })
  return NextResponse.json(habits)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { name, emoji } = await req.json()
  if (!name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 })
  }

  await connectDB()
  const habit = await Habit.create({
    name: name.trim(),
    emoji: emoji || "✅",
    userId: session.user.id,
  })
  return NextResponse.json(habit, { status: 201 })
}
