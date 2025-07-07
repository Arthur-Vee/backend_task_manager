import { UserGroup, UserGroupModel } from "../models/userGroup.model"
import { taskSchema } from "../models/task.model"
import { v4 as uuidv4 } from "uuid"
import ErrorHandler from "../errors/errorHandler"
import mongoose from "mongoose"

const TaskModel = mongoose.model("Task", taskSchema)

export default class UserGroupService {
  getAllUserGroups() {
    return UserGroupModel.find(
      {},
      {
        _id: 0,
        groupId: 1,
        groupName: 1,
        groupDescription: 1,
        groupMembers: 1,
      }
    )
  }
  async createUserGroup(userGroupData: UserGroup) {
    const id = uuidv4()
    const creatingUserGroup = await UserGroupModel.create({
      groupId: id,
      groupName: userGroupData.groupName,
      groupDescription: userGroupData.groupDescription,
      groupMembers: userGroupData.groupMembers,
    })
    let createdGroup = {
      groupName:userGroupData.groupName,
      groupDescription:userGroupData.groupDescription,
      groupMembers:userGroupData.groupMembers
    }
    if (creatingUserGroup) {
      return { createdGroup }
    } else {
      throw new ErrorHandler()
    }
  }
  async updateUserGroup(id: string, userGroupData: UserGroup) {
    const findGroup = await UserGroupModel.findOne({ groupId: id })
    const userGroup = {
      groupName: userGroupData.groupName,
      groupDescription: userGroupData.groupDescription,
      groupMembers: findGroup?.groupMembers?.concat(userGroupData.groupMembers),
    }
    if (userGroupData.groupName == "") {
      userGroup.groupName = findGroup?.groupName ?? ""
    }
    if (userGroupData.groupDescription == "") {
      userGroup.groupDescription = findGroup?.groupDescription ?? ""
    }
    const findAndUpdateGroup = await UserGroupModel.findOneAndUpdate(
      { groupId: id },
      userGroup,
      { new: true }
    )

    if (findAndUpdateGroup == null || findAndUpdateGroup == undefined) {
      throw new ErrorHandler()
    }
    return findAndUpdateGroup
  }
  async deleteUsersFromGroup(id: string, groupMembersToDelete: string[]) {
    const updatedGroup = await UserGroupModel.updateOne(
      { groupId: id },
      { $pull: { groupMembers: { $in: groupMembersToDelete } } }
    )
    return updatedGroup
  }
  async deleteGroup(groupIdToDelete: string) {
    const matchingGroup = await UserGroupModel.exists({
      groupId: groupIdToDelete,
    })
    if (matchingGroup) {
      await UserGroupModel.findOneAndDelete({ groupId: groupIdToDelete })
      await TaskModel.deleteMany({ assignedTo: groupIdToDelete })
    } else {
      throw new ErrorHandler()
    }
  }
}
