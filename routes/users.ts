import express from "express"
import DatabaseService from "../services/users.service"
import { User } from "../models/user.model"
import ErrorHandler from "../errors/errorHandler"

const router = express.Router()
const database = new DatabaseService

router.get('/', async (req: express.Request, res: express.Response) => {
    var getAllUsers = await database.getAllUsers()
    res.status(200).json(getAllUsers)
})

module.exports = router