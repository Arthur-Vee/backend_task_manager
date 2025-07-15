import express from "express"
import DatabaseService from "../services/userGroup.service"
import { UserGroup } from "../models/userGroup.model"
import authorize from "../middleware/authorize"

var router = express.Router()
const database = new DatabaseService()

router.post("/",authorize(["ADMIN"]), async (req: express.Request, res: express.Response) => {
    try {
      const createNewGroup: UserGroup = {
        groupName: req.body.groupName,
        groupDescription: req.body.groupDescription,
        groupMembers: req.body.groupMembers,
      }
      await database.createUserGroup(createNewGroup)
      res.status(200).send(createNewGroup)
    } catch (error) {
      res.status(500).send()
    }
})

router.post(
  "/getAllUserGroups",authorize(["ADMIN"]),
  async (req: express.Request, res: express.Response) => {
    try {
      let allUserGroups = await database.getAllUserGroups()
      res.status(200).json(allUserGroups)
    } catch (error) {
      res.status(500).send()
    }
  }
)
router.patch("/",authorize(["ADMIN"]), async (req: express.Request, res: express.Response) => {
  let groupId = req.body.groupId
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
})
router.post(
  "/deleteUsers",authorize(["ADMIN"]),
  async (req: express.Request, res: express.Response) => {
    let groupId: string = req.body.groupId
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
)
router.post(
  "/deleteGroup",authorize(["ADMIN"]),
  async (req: express.Request, res: express.Response) => {
    let groupId: string = req.body.groupId
      try {
        await database.deleteGroup(groupId)
        const result = await database.getAllUserGroups()

        res.status(200).send()
      } catch (error) {
        res.status(500).send()
      }
  }
)

module.exports = router
