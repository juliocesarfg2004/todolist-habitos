"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"

interface Day {
  date: string
  completed: boolean
}

interface Props {
  id: string
  name: string
  emoji: string
  streak: number
  maxStreak: number
  completedToday: boolean
  days: Day[]
}

export default function HabitDetailClient({
  id,
  name,
  emoji,
  streak,
  maxStreak,
  completedToday,
  days,
}: Props) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(name)
  const [editEmoji, setEditEmoji] = useState(emoji)
  const [saving, setSaving] = useState(false)

  async function handleToggle() {
    await fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ habitId: id, completed: !completedToday }),
    })
    router.refresh()
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!editName.trim()) return
    setSaving(true)
    await fetch(`/api/habits/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName.trim(), emoji: editEmoji }),
    })
    setSaving(false)
    setEditing(false)
    router.refresh()
  }

  async function handleDelete() {
    if (!confirm("Excluir este hábito?")) return
    await fetch(`/api/habits/${id}`, { method: "DELETE" })
    router.push("/dashboard")
  }

  const weekLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Link
            href="/dashboard"
            className="text-sm text-zinc-400 hover:text-zinc-600"
          >
            ← Voltar
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {emoji} {name}
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              🔥 {streak} dias · Recorde: {maxStreak} dias
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="rounded-lg px-3 py-1.5 text-sm text-zinc-500 hover:bg-zinc-100"
            >
              ✏️
            </button>
            <button
              onClick={handleDelete}
              className="rounded-lg px-3 py-1.5 text-sm text-red-500 hover:bg-red-50"
            >
              🗑️
            </button>
          </div>
        </div>

        <button
          onClick={handleToggle}
          className={`mb-8 w-full rounded-xl py-3 text-sm font-medium transition-all ${
            completedToday
              ? "bg-green-500 text-white"
              : "border-2 border-dashed border-zinc-300 text-zinc-500 hover:border-zinc-400"
          }`}
        >
          {completedToday ? "✓ Concluído hoje" : "Marcar como concluído"}
        </button>

        <h2 className="mb-3 text-sm font-medium text-zinc-500">
          Últimos 30 dias
        </h2>
        <div className="rounded-xl border bg-white p-4">
          <div className="mb-2 grid grid-cols-7 gap-1">
            {weekLabels.map((label) => (
              <div
                key={label}
                className="text-center text-xs text-zinc-400"
              >
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
                  className={`aspect-square rounded-md flex items-center justify-center text-xs ${
                    day.completed
                      ? "bg-green-500 text-white"
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
      </main>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
          <div className="w-full max-w-sm rounded-t-2xl bg-white p-6 sm:rounded-2xl">
            <h2 className="mb-4 text-lg font-semibold">Editar hábito</h2>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                maxLength={60}
                autoFocus
                className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-zinc-400"
              />
              <input
                type="text"
                value={editEmoji}
                onChange={(e) => setEditEmoji(e.target.value)}
                maxLength={2}
                className="w-16 rounded-lg border px-3 py-2 text-center text-sm outline-none focus:border-zinc-400"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 rounded-lg border py-2.5 text-sm text-zinc-500 hover:bg-zinc-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving || !editName.trim()}
                  className="flex-1 rounded-lg bg-zinc-900 py-2.5 text-sm text-white hover:bg-zinc-800 disabled:opacity-50"
                >
                  {saving ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
