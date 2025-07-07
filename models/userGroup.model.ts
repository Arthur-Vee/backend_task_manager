import mongoose from "mongoose"

export type UserGroup = {
  groupName: string
  groupDescription: string
  groupMembers: string[]
}

const userGroupSchema = new mongoose.Schema({
  groupId: String,
  groupName: String,
  groupDescription: String,
  groupMembers: [String],
})

export const UserGroupModel = mongoose.model("groups", userGroupSchema)
