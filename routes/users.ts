import express from "express"
import DatabaseService from "../services/users.service"
import AuthService from "../services/auth.service"
import { User, UpdateUserData } from "../models/user.model"
import ErrorHandler from "../errors/errorHandler"

const router = express.Router()
const database = new DatabaseService
const auth = new AuthService

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
router.patch("/", async (req: express.Request, res: express.Response) => {
    var adminToken = req.body.adminToken
    var userDataToUpdate: UpdateUserData = req.body.updatedUserData
    var isAdmin = await auth.verifyAdmin(adminToken)
    if (isAdmin) {
        try {
            await database.updateUser(userDataToUpdate)
            res.status(200).json("User Updated")
        } catch (error) {
            res.status(500).send()
        }
    } else {
        res.status(401).send()
    }
})

router.post('/', async (req: express.Request, res: express.Response) => {
    try {
        const createNewUser: User = {
            username: req.body.username,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }
        const userId = await database.createUser(createNewUser)
        res.status(200).json(userId)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router
