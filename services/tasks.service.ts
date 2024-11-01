require("dotenv").config()
import mongoose from "mongoose"
import { Task, taskSchema } from "../models/task.model"
import { v4 as uuidv4 } from "uuid"
import TaskNotFoundError from "../errors/taskNotFoundError"
import ErrorHandler from "../errors/errorHandler"
import { UserGroupModel } from "../models/userGroup.model"
import AuthService from "./auth.service"

mongoose.connection.on("connected", () => console.log("Task: connected"))
mongoose.connection.on("open", () => console.log("Task: open"))
mongoose.connection.on("disconnected", () => console.log("Task: disconnected"))
mongoose.connection.on("reconnected", () => console.log("Task: reconnected"))
mongoose.connection.on("disconnecting", () =>
  console.log("Task: disconnecting")
)
mongoose.connection.on("close", () => console.log("Task: close"))

const TaskModel = mongoose.model("Task", taskSchema)
const auth = new AuthService()

export default class TasksService {
  async getAllTasks(userId: string) {
    const isAdmin = await auth.verifyAdmin(userId)
    const isManager = await auth.verifyManager(userId)
    const userGroups = await UserGroupModel.find({ groupMembers: userId })
    const groupIds = userGroups.map((group) => group.groupId)
    try {
      if (isAdmin) {
        return await TaskModel.find({})
      }
      if (isManager) {
        return await TaskModel.find({})
      }
      if (userGroups.length === 0) {
        return []
      }
      return await TaskModel.find({ assignedTo: { $in: groupIds } })
    } catch (error) {
      console.error("Error fetching tasks for user:", error)
      throw error
    }
  }

  async getIndividualTask(taskId: string) {
    var task = await TaskModel.findOne({ id: taskId })
    if (task == null || task == undefined) {
      throw new TaskNotFoundError()
    }
    return task
  }
  async createTask(task: Task) {
    var generatedId = uuidv4()
    const creatingTask = await TaskModel.create({
      id: generatedId,
      title: task.title,
      description: task.description,
      type: task.type,
      createdOn: this.formatDateToCustomFormat(new Date()),
      assignedTo: task.assignedTo,
      status: "Active",
    })
    if (creatingTask) {
      return generatedId
    } else {
      throw new ErrorHandler()
    }
  }
  async deleteTask(taskToDelete: String) {
    const matchingTask = await TaskModel.exists({ id: taskToDelete })
    if (matchingTask) {
      await TaskModel.findOneAndDelete({ id: taskToDelete })
    } else {
      throw new TaskNotFoundError()
    }
  }
  async updateTask(updatedDataTask: Task) {
    const findAndUpdateTask = await TaskModel.findOneAndUpdate(
      { id: updatedDataTask.id },
      updatedDataTask,
      { new: true }
    )
    if (findAndUpdateTask == null || findAndUpdateTask == undefined) {
      throw new ErrorHandler()
    }
    return findAndUpdateTask
  }

  formatDateToCustomFormat(date: Date): string {
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    const seconds = String(date.getSeconds()).padStart(2, "0")

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
  }
}
