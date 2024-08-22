import express from "express"
import DatabaseService from "../services/tasks.service"
import { Task } from "../models/task.model"
import ErrorHandler from "../errors/errorHandler"

const router = express.Router()
const database = new DatabaseService

router.get("/", async (req: express.Request, res: express.Response) => {
    try {
        const result = await database.getAllTasks()
        res.status(200).json(result)
    } catch (error) {
        handleError(res, error)
    }
})

router.get("/:id", async (req: express.Request, res: express.Response) => {
    try {
        const result = await database.getIndividualTask(req.params.id)
        res.status(200).json(result)
    } catch (error) {
        handleError(res, error)
    }
})

router.post("/", async (req: express.Request, res: express.Response) => {
    try {
        const createNewTask: Task = await req.body
       const createdTask =  await database.createTask(createNewTask)
        res.status(200).json(createdTask)
    } catch (error) {
        handleError(res, error)
    }
})

router.delete("/:id", async (req: express.Request, res: express.Response) => {
    const taskId = req.params.id
    try {
        var taskToDelete = taskId
        await database.deleteTask(taskToDelete)
        const result = await database.getAllTasks()
        res.status(200).json(result)
    } catch (error) {
        handleError(res, error)
    }
})

router.patch("/", async (req: express.Request, res: express.Response) => {
    const updatedTaskData: Task = req.body
    try {
        const result = await database.updateTask(updatedTaskData)
        res.status(200).json(result)
    } catch (error) {
        handleError(res, error)
    }
})

function handleError(res: express.Response, error: unknown) {
    if (error instanceof ErrorHandler) {
        res.status(error.httpCode).send()
    } else {
        res.status(500).send()
    }
}

module.exports = router