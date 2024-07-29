import mongoose from "mongoose"

export type User = {
    username: string,
    password: string,
    firstName: string,
    lastName: string,
}
export enum Roles {
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    USER = "USER"
}

const userSchema = new mongoose.Schema({
    id: String,
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    roles: [String]
})

export const UserModel = mongoose.model('User', userSchema)

export type UpdateUserData =  {
    updatedUserId:string,
    updatedUserRoles:string[]
}