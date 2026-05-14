import { redirect } from "next/navigation"
import { connectDB } from "@/lib/mongoose"
import { Habit } from "@/models/Habit"
import { Log } from "@/models/Log"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { calculateStreak } from "@/lib/streak"
import HabitCard from "@/components/habit-card"
import CreateHabitModal from "@/components/create-habit-modal"
import Header from "@/components/header"


function getToday() {
  return new Date().toISOString().slice(0, 10)
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/login")

  await connectDB()

  const habits = await Habit.find({ userId: session.user.id }).sort({
    createdAt: -1,
  })

  const habitIds = habits.map((h) => h._id.toString())
  const today = getToday()

  const logs = await Log.find({
    habitId: { $in: habitIds },
    date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) },
  }).sort({ date: -1 })

  const logsByHabit: Record<string, { date: string }[]> = {}
  for (const log of logs) {
    if (!logsByHabit[log.habitId]) logsByHabit[log.habitId] = []
    if (log.completed) {
      logsByHabit[log.habitId].push({ date: log.date })
    }
  }

  const completedToday = new Set(
    logs.filter((l) => l.date === today && l.completed).map((l) => l.habitId)
  )

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6 pb-24">
        <h1 className="mb-6 text-xl font-bold">Meus hábitos</h1>

        <div className="flex flex-col gap-3">
          {habits.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-zinc-400">
              <p className="text-3xl">🌱</p>
              <p className="mt-2 text-sm">Nenhum hábito ainda.</p>
              <p className="text-sm">Crie seu primeiro hábito abaixo.</p>
            </div>
          ) : (
            habits.map((habit) => {
              const id = habit._id.toString()
              const habitLogs = logsByHabit[id] || []
              return (
                <HabitCard
                  key={id}
                  id={id}
                  name={habit.name}
                  emoji={habit.emoji}
                  streak={calculateStreak(habitLogs)}
                  completedToday={completedToday.has(id)}
                  completedDates={new Set(logs.filter(l => l.habitId === id && l.completed).map(l => l.date))}
                />
              )
            })
          )}

          <CreateHabitModal />
        </div>
      </main>

    </div>
  )
}
