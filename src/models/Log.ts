import mongoose, { Schema, Document } from "mongoose"

export interface ILog extends Document {
  habitId: string
  date: string
  completed: boolean
}

const LogSchema = new Schema<ILog>({
  habitId: { type: String, required: true, index: true },
  date: { type: String, required: true },
  completed: { type: Boolean, default: true },
})

LogSchema.index({ habitId: 1, date: 1 }, { unique: true })

export const Log =
  mongoose.models.Log ?? mongoose.model<ILog>("Log", LogSchema)
