import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="sticky bottom-0 z-50 border-t bg-white">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        <Link
          href="/dashboard"
          className="flex flex-col items-center gap-0.5 px-4 py-1 text-xs text-zinc-500"
        >
          <span className="text-lg">📊</span>
          Dashboard
        </Link>
        <Link
          href="/dashboard"
          className="flex flex-col items-center gap-0.5 px-4 py-1 text-xs text-zinc-500"
        >
          <span className="text-lg">➕</span>
          Novo
        </Link>
      </div>
    </nav>
  )
}
