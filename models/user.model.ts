import mongoose from "mongoose"

export type User = {
    username: string,
    password: string,
    firstName: string,
    lastName: string,
}
export enum userRoles {
    admin = 1,
    manager = 2,
    user = 3,
}

const userSchema = new mongoose.Schema({
    id: String,
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    roles: [Number]
})

export const UserModel = mongoose.model('User', userSchema)