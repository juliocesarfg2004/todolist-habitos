"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

interface HabitCardProps {
  id: string
  name: string
  emoji: string
  streak: number
  completedToday: boolean
  completedDates: Set<string>
}

const weekLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

function buildDays(completedDates: Set<string>) {
  const days: { date: string; completed: boolean }[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)
    days.push({ date: dateStr, completed: completedDates.has(dateStr) })
  }
  return days
}

export default function HabitCard({
  id,
  name,
  emoji,
  streak,
  completedToday,
  completedDates,
}: HabitCardProps) {
  const router = useRouter()
  const [toggling, setToggling] = useState(false)
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function toggle() {
    setToggling(true)
    await fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ habitId: id, completed: !completedToday }),
    })
    setToggling(false)
    router.refresh()
  }

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir este hábito?")) return
    setDeleting(true)
    await fetch(`/api/habits/${id}`, { method: "DELETE" })
    setDeleting(false)
    setOpen(false)
    router.refresh()
  }

  const days = buildDays(completedDates)

  return (
    <>
      <div className="flex items-center gap-4 rounded-xl border bg-white p-4">
        <button
          onClick={toggle}
          disabled={toggling}
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 text-xl transition-all ${
            completedToday
              ? "border-green-500 bg-green-50 text-green-600"
              : "border-zinc-200 bg-white text-zinc-300 hover:border-zinc-300"
          }`}
        >
          {toggling ? "..." : completedToday ? "✓" : emoji}
        </button>

        <button
          onClick={() => setOpen(true)}
          className="flex-1 text-left"
        >
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm text-zinc-400">
            {streak > 0 ? `🔥 ${streak} dias` : "Nenhum streak"}
          </p>
        </button>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-sm text-zinc-400 hover:bg-red-50 hover:text-red-500"
        >
          {deleting ? "..." : "✕"}
        </button>
      </div>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-80 max-w-[85vw] overflow-y-auto bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {emoji} {name}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100"
              >
                ✕
              </button>
            </div>

            <p className="mt-4 text-sm text-zinc-400">
              {streak > 0
                ? `🔥 Streak de ${streak} dias consecutivos`
                : "Sem streak atual"}
            </p>

            <h2 className="mb-3 mt-6 text-sm font-medium text-zinc-500">
              Últimos 30 dias
            </h2>
            <div className="rounded-xl border bg-white p-4">
              <div className="mb-2 grid grid-cols-7 gap-1">
                {weekLabels.map((label) => (
                  <div key={label} className="text-center text-xs font-medium text-zinc-400">
                    {label}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {days.map((day) => {
                  const d = new Date(day.date)
                  return (
                    <div
                      key={day.date}
                      className={`aspect-square rounded-md flex items-center justify-center text-sm ${
                        day.completed
                          ? "bg-green-500 text-white font-medium"
                          : "bg-zinc-100 text-zinc-400"
                      }`}
                      title={day.date}
                    >
                      {d.getDate()}
                    </div>
                  )
                })}
              </div>
            </div>

            <button
              onClick={toggle}
              disabled={toggling}
              className={`mt-6 w-full rounded-xl py-3 text-sm font-medium transition-all ${
                completedToday
                  ? "border-2 border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {toggling
                ? "..."
                : completedToday
                  ? "Marcar como incompleto"
                  : "Marcar como completo"}
            </button>
          </div>
        </>
      )}
    </>
  )
}
