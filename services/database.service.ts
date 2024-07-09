require("dotenv").config()
import mongoose from "mongoose"
import { Task } from "../models/task.model"
import { v4 as uuidv4 } from 'uuid'
import TaskNotFoundError from "../errors/taskNotFoundError"
import ErrorHandler from "../errors/errorHandler"

mongoose.connection.on('connected', () => console.log('connected'))
mongoose.connection.on('open', () => console.log('open'))
mongoose.connection.on('disconnected', () => console.log('disconnected'))
mongoose.connection.on('reconnected', () => console.log('reconnected'))
mongoose.connection.on('disconnecting', () => console.log('disconnecting'))
mongoose.connection.on('close', () => console.log('close'))

const taskSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    type: String,
    createdOn: String,
    status: String,
})
const TaskModel = mongoose.model('Task', taskSchema)

export default class DatabaseService {
    async getAllTasks() {
        return await TaskModel.find({})
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
            createdOn: new Date(),
            status: "Active",
        });
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
        return await TaskModel.findOneAndUpdate({ id: updatedDataTask.id }, updatedDataTask, { new: true })
    }
}


