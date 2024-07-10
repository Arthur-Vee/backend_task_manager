import express from "express"
import DatabaseService from "../services/users.service"
import { User } from "../models/user.model"
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

router.get('/', async (req: express.Request, res: express.Response) => {
    var getAllUsers = await database.getAllUsers()
    res.status(200).json(getAllUsers)
})

module.exports = router