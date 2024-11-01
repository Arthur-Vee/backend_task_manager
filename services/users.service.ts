import mongoose from "mongoose"
import { User, UserModel, Roles, UpdateUserData } from "../models/user.model"
import ErrorHandler from "../errors/errorHandler"
import { v4 as uuidv4 } from "uuid"
import * as bcrypt from "bcrypt"

mongoose.connection.on("connected", () => console.log("User: connected"))
mongoose.connection.on("open", () => console.log("User: open"))
mongoose.connection.on("disconnected", () => console.log("User: disconnected"))
mongoose.connection.on("reconnected", () => console.log("User: reconnected"))
mongoose.connection.on("disconnecting", () =>
  console.log("User: disconnecting")
)
mongoose.connection.on("close", () => console.log("User: close"))

export default class UserService {
  getAllUsers() {
    return UserModel.find(
      {},
      {
        _id: 0,
        id: 1,
        username: 1,
        firstName: 1,
        lastName: 1,
      }
    )
  }

  getUserById(userId: string) {
    var user = UserModel.findOne(
      { id: userId },
      {
        _id: 0,
        username: 1,
        firstName: 1,
        lastName: 1,
        roles: 1,
        
      }
    )
    return user
  }

  async createUser(createUser: User) {
    const id = uuidv4()
    const hashedPassword = await bcrypt.hash(createUser.password, 10)
    const token = "true"
    const creatingUser = await UserModel.create({
      id: id,
      username: createUser.username,
      password: hashedPassword,
      firstName: createUser.firstName,
      lastName: createUser.lastName,
      roles: [Roles.USER],
    })
    const user = {
      username: createUser.username,
      firstName: createUser.firstName,
      lastName: createUser.lastName,
      roles: [Roles.USER],
    }
    if (creatingUser) {
      return { id, token, user }
    } else {
      throw new ErrorHandler()
    }
  }
  async updateUser(updatedUserData: UpdateUserData) {
    await UserModel.findOneAndUpdate(
      { id: updatedUserData.updatedUserId },
      { roles: updatedUserData.updatedUserRoles },
      { new: true }
    )
  }
}
