import express from "express"
import DatabaseService from "../services/auth.service"
import { Auth } from "../models/auth.model"

const router = express.Router()
const database = new DatabaseService

router.post("/", async (req: express.Request, res: express.Response) => {
    const user: Auth = {
        username: req.body.username,
        password: req.body.password
    }
    try {
        const response = await database.signInUser(user)
        res.status(200).json({
            id: response.userId,
            token: response.isLoogedIn,
        })

    } catch (error) {
        return res.status(401).json()
    }
})

module.exports = router