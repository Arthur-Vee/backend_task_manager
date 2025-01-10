import mongoose from "mongoose"

export type Task = {
  id: string
  title: string
  description: string
  type: string
  createdOn: string
  status: string
  assignedTo: string
}
export const taskSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  type: String,
  createdOn: String,
  status: String,
  assignedTo: String,
})
