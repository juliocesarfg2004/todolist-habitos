"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CreateHabitModal() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [emoji, setEmoji] = useState("✅")
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), emoji }),
    })
    setSaving(false)
    setName("")
    setEmoji("✅")
    setOpen(false)
    router.refresh()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-300 p-4 text-zinc-400 hover:border-zinc-400 hover:text-zinc-500"
      >
        <span className="text-lg">+</span>
        <span className="text-sm font-medium">Novo hábito</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
          <div className="w-full max-w-sm rounded-t-2xl bg-white p-6 sm:rounded-2xl">
            <h2 className="mb-4 text-lg font-semibold">Novo hábito</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Nome do hábito"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
                autoFocus
                className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-zinc-400"
              />
              <div>
                <label className="mb-1 block text-xs text-zinc-400">
                  Emoji
                </label>
                <div className="grid grid-cols-8 gap-1.5">
                  {["💪","📚","🏃","🧘","💧","🥗","😴","🚿","✍️","🎯","🧠","🎨","🎵","🌱","🧹","📝","☀️","💊","🧭","🎮","📖","🎧","🎬","🧁","☕","🧩","🏋️","🚴","🧗","🏊","🗣️","🤝","💰","🏡","🧳","🌎","🔧","🎉","🙏","✨"].map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setEmoji(e)}
                      className={`rounded-lg p-2 text-lg transition-all ${
                        emoji === e
                          ? "bg-zinc-900 text-white ring-2 ring-zinc-900 ring-offset-1"
                          : "bg-zinc-100 hover:bg-zinc-200"
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-lg border py-2.5 text-sm text-zinc-500 hover:bg-zinc-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving || !name.trim()}
                  className="flex-1 rounded-lg bg-zinc-900 py-2.5 text-sm text-white hover:bg-zinc-800 disabled:opacity-50"
                >
                  {saving ? "Salvando..." : "Criar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
