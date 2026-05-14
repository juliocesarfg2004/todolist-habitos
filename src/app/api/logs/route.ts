import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import { Habit } from "@/models/Habit"
import { Log } from "@/models/Log"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const habitId = searchParams.get("habitId")
  const date = searchParams.get("date")

  await connectDB()

  const filter: Record<string, unknown> = {}

  if (habitId) {
    const habit = await Habit.findOne({
      _id: habitId,
      userId: session.user.id,
    })
    if (!habit) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    filter.habitId = habitId
  }

  if (date) filter.date = date

  const logs = await Log.find(filter).sort({ date: -1 }).limit(365)
  return NextResponse.json(logs)
}

function getToday() {
  return new Date().toISOString().slice(0, 10)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { habitId, date, completed } = await req.json()
  const targetDate = date || getToday()

  if (!habitId) {
    return NextResponse.json({ error: "habitId is required" }, { status: 400 })
  }

  await connectDB()

  const habit = await Habit.findOne({
    _id: habitId,
    userId: session.user.id,
  })
  if (!habit) {
    return NextResponse.json({ error: "Habit not found" }, { status: 404 })
  }

  const isCompleted = completed !== false

  const log = await Log.findOneAndUpdate(
    { habitId, date: targetDate },
    { $set: { completed: isCompleted } },
    { upsert: true, new: true }
  )

  return NextResponse.json(log)
}
