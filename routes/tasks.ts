import express from "express"
import DatabaseService from "../services/database.service"
import { Task } from "../models/task.model"
import ErrorHandler from "../errors/errorHandler"

const router = express.Router()
let database: DatabaseService

// Initialize database
async function initializeDatabase() {
    try {
        database = new DatabaseService()
    } catch (error) {
        console.error("Error connecting to database:", error)
    }
}
initializeDatabase().catch(console.error)

router.get("/", async (req:express.Request, res: express.Response) => {
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
        const taskId = await database.createTask(createNewTask)
        res.status(200).send()
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
        res.status(200).send(result)
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