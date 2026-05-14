import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import { Habit } from "@/models/Habit"
import { Log } from "@/models/Log"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const { name, emoji } = await req.json()

  await connectDB()
  const habit = await Habit.findOneAndUpdate(
    { _id: id, userId: session.user.id },
    { $set: { name: name?.trim(), emoji } },
    { new: true }
  )

  if (!habit) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(habit)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  await connectDB()
  const habit = await Habit.findOneAndDelete({
    _id: id,
    userId: session.user.id,
  })

  if (!habit) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await Log.deleteMany({ habitId: id })

  return NextResponse.json({ success: true })
}
