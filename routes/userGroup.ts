import express from "express"
import DatabaseService from "../services/userGroup.service"
import AuthService from "../services/auth.service"
import { UserGroup } from "../models/userGroup.model"

var router = express.Router()
const database = new DatabaseService()
const auth = new AuthService()

router.post("/", async (req: express.Request, res: express.Response) => {
  var adminToken = req.body.adminToken
  var isAdmin = await auth.verifyAdmin(adminToken)
  if (isAdmin) {
    try {
      const createNewGroup: UserGroup = {
        groupName: req.body.groupName,
        groupDescription: req.body.groupDescription,
        groupMembers: req.body.groupMembers,
      }
      const createdGroup = await database.createUserGroup(createNewGroup)
      res.status(200).send(createdGroup)
    } catch (error) {
      res.status(500).send()
    }
  }
})

router.post(
  "/getAllUserGroups",
  async (req: express.Request, res: express.Response) => {
    try {
      var allUserGroups = await database.getAllUserGroups()
      res.status(200).json(allUserGroups)
    } catch (error) {
      res.status(500).send()
    }
  }
)
router.patch("/", async (req: express.Request, res: express.Response) => {
  var adminToken = req.body.adminToken
  var groupId = req.body.groupId
  var isAdmin = await auth.verifyAdmin(adminToken)
  if (isAdmin) {
    try {
      const updateGroupData: UserGroup = {
        groupName: req.body.groupName,
        groupDescription: req.body.groupDescription,
        groupMembers: req.body.groupMembers,
      }
      const updatedGroup = await database.updateUserGroup(
        groupId,
        updateGroupData
      )
      res.status(200).json(updatedGroup)
    } catch (error) {
      res.status(500).send()
    }
  }
})
router.post(
  "/deleteUsers",
  async (req: express.Request, res: express.Response) => {
    var adminToken: string = req.body.adminToken
    var groupId: string = req.body.groupId
    var isAdmin: boolean | undefined = await auth.verifyAdmin(adminToken)
    if (isAdmin) {
      try {
        const usersToDelete: string[] = req.body.groupMembers
        const updatedGroup = await database.deleteUsersFromGroup(
          groupId,
          usersToDelete
        )
        res.status(200).json(updatedGroup)
      } catch (error) {
        res.status(500).send()
      }
    }
  }
)
router.post(
  "/deleteGroup",
  async (req: express.Request, res: express.Response) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    var groupId: string = req.body.groupId
    var isAdmin: boolean | undefined = await auth.verifyAdmin(token ?? "")
    if (isAdmin) {
      try {
        await database.deleteGroup(groupId)
        const result = await database.getAllUserGroups()

        res.status(200).json(result)
      } catch (error) {
        res.status(500).send()
      }
    }
  }
)

module.exports = router
