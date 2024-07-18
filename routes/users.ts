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
router.post("/:id", async (req: express.Request, res: express.Response) => {
    var token = req.params.token
    if (token = "true") {
        try {
            var getUser = await database.getUserById(req.params.id)
            res.status(200).json(getUser)
        } catch (error) {
            return res.status(404).json(error)
        }

    } else (console.log("unauthorised"))
})

module.exports = router