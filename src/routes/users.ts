import express from "express"
import DatabaseService from "../services/users.service"
import AuthService from "../services/auth.service"
import { User, UpdateUserData } from "../models/user.model"
import authorize from "../middleware/authorize"

const router = express.Router()
const database = new DatabaseService()
const auth = new AuthService()

router.get("/", async (req: express.Request, res: express.Response) => {
  var getAllUsers = await database.getAllUsers()
  res.status(200).json(getAllUsers)
})
router.post("/:id", async (req: express.Request, res: express.Response) => {
  var token = req.params.token
  if ((token = "true")) {
    try {
      var getUser = await database.getUserById(req.params.id)
      res.status(200).json(getUser)
    } catch (error) {
      return res.status(404).json(error)
    }
  } else return res.status(401).send()
})
router.patch("/",authorize(["ADMIN"]), async (req: express.Request, res: express.Response) => {
  var userDataToUpdate: UpdateUserData = req.body.updatedUserData
    try {
      await database.updateUser(userDataToUpdate)
      res.status(200).json("User Updated")
    } catch (error) {
      res.status(500).send()
    }
})

router.post("/", async (req: express.Request, res: express.Response) => {
  try {
    const createNewUser: User = {
      username: req.body.username,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    }
    const createdUser = await database.createUser(createNewUser)
    res.status(200).json(createdUser)
  } catch (error) {
    res.status(500).send()
  }
})

module.exports = router
