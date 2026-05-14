import { redirect } from "next/navigation"
import { connectDB } from "@/lib/mongoose"
import { Habit } from "@/models/Habit"
import { Log } from "@/models/Log"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { calculateStreak } from "@/lib/streak"
import HabitDetailClient from "./habit-detail-client"

function getToday() {
  return new Date().toISOString().slice(0, 10)
}

export default async function HabitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/login")

  const { id } = await params

  await connectDB()
  const habit = await Habit.findOne({ _id: id, userId: session.user.id })
  if (!habit) redirect("/dashboard")

  const logs = await Log.find({ habitId: id }).sort({ date: -1 }).limit(365)

  const today = getToday()
  const completedToday = logs.some(
    (l) => l.date === today && l.completed
  )

  const completedDates = new Set(
    logs.filter((l) => l.completed).map((l) => l.date)
  )

  const completedLogs = logs.filter((l) => l.completed)
  const streak = calculateStreak(completedLogs)

  let maxStreak = 0
  if (completedLogs.length > 0) {
    const allDates = [...new Set(completedLogs.map((l) => l.date))].sort()
    let current = 1
    for (let i = 1; i < allDates.length; i++) {
      const prev = new Date(allDates[i - 1])
      const curr = new Date(allDates[i])
      const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
      if (diff === 1) {
        current++
      } else {
        maxStreak = Math.max(maxStreak, current)
        current = 1
      }
    }
    maxStreak = Math.max(maxStreak, current)
  }

  const days: { date: string; completed: boolean }[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)
    days.push({ date: dateStr, completed: completedDates.has(dateStr) })
  }

  return (
    <HabitDetailClient
      id={id}
      name={habit.name}
      emoji={habit.emoji}
      streak={streak}
      maxStreak={Math.max(streak, maxStreak)}
      completedToday={completedToday}
      days={days}
    />
  )
}
