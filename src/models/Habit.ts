import mongoose, { Schema, Document } from "mongoose"

export interface IHabit extends Document {
  name: string
  emoji: string
  userId: string
  createdAt: Date
}

const HabitSchema = new Schema<IHabit>({
  name: { type: String, required: true },
  emoji: { type: String, default: "✅" },
  userId: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now },
})

export const Habit =
  mongoose.models.Habit ?? mongoose.model<IHabit>("Habit", HabitSchema)
