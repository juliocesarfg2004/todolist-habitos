import Link from "next/link"
import { getSession } from "@/lib/getSession"

export default async function Header() {
  const session = await getSession()

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="text-lg font-bold">
          Habit Tracker
        </Link>
        {session?.user && (
          <div className="flex items-center gap-3 text-sm text-zinc-500">
            <span>{session.user.email}</span>
            <Link
              href="/api/auth/signout"
              className="rounded-md px-3 py-1 text-sm text-red-500 hover:bg-red-50"
            >
              Sair
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
