export function calculateStreak(logs: { date: string }[]): number {
  if (logs.length === 0) return 0

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().slice(0, 10)

  const sorted = [...logs]
    .map((l) => l.date)
    .sort()
    .reverse()

  let streak = 0
  let currentDate = new Date(today)

  if (sorted[0] === todayStr) {
    streak = 1
  } else {
    currentDate.setDate(currentDate.getDate() - 1)
    if (sorted[0] === currentDate.toISOString().slice(0, 10)) {
      streak = 1
    }
  }

  if (streak === 0) return 0

  for (let i = 1; i < sorted.length; i++) {
    const prevDate = new Date(currentDate)
    prevDate.setDate(prevDate.getDate() - 1)
    const prevStr = prevDate.toISOString().slice(0, 10)

    if (sorted[i] === prevStr) {
      streak++
      currentDate = prevDate
    } else {
      break
    }
  }

  return streak
}
