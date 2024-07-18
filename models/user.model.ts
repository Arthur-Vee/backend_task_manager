import mongoose from "mongoose"

export type User = {
    username: string,
    password: string,
    firstName: string,
    lastName: string,
}

const userSchema = new mongoose.Schema({
    id: String,
    username: String,
    password: String,
    firstName: String,
    lastName: String,
})

export const UserModel = mongoose.model('User', userSchema)