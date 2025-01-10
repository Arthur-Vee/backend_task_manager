import express from "express"
import DatabaseService from "../services/tasks.service"
import { Task } from "../models/task.model"
import ErrorHandler from "../errors/errorHandler"
import authorize from "../middleware/authorize"

const router = express.Router()
const database = new DatabaseService()
router.post("/",authorize(["USER"]), async (req: express.Request, res: express.Response) => {
  const userId: string = req.body.userId
  try {
    const result = await database.getAllTasks(userId)
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

router.post("/create",authorize(["ADMIN"]), async (req: express.Request, res: express.Response) => {
  try {
    const createNewTask: Task = await req.body.task
    const createdTask = await database.createTask(createNewTask)
    res.status(200).json(createdTask)
  } catch (error) {
    handleError(res, error)
  }
})

router.delete("/:id",authorize(["ADMIN"]), async (req: express.Request, res: express.Response) => {
  const taskId: string = req.params.id
  const userId: string = req.params.userId
  try {
    var taskToDelete = taskId
    await database.deleteTask(taskToDelete)
    const result = await database.getAllTasks(userId)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, error)
  }
})

router.patch("/",authorize(["ADMIN","MANAGER"]), async (req: express.Request, res: express.Response) => {
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
