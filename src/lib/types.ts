export interface HabitData {
  _id: string
  name: string
  emoji: string
  createdAt: string
  userId: string
}

export interface LogData {
  _id: string
  habitId: string
  date: string
  completed: boolean
}

export interface HabitWithStreak extends HabitData {
  streak: number
  completedToday: boolean
}
