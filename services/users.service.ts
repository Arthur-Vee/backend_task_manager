import mongoose from "mongoose"
import { User } from "../models/user.model"
import ErrorHandler from "../errors/errorHandler"
import { v4 as uuidv4 } from "uuid"
import * as bcrypt from 'bcrypt'


mongoose.connection.on('connected', () => console.log('User: connected'))
mongoose.connection.on('open', () => console.log('User: open'))
mongoose.connection.on('disconnected', () => console.log('User: disconnected'))
mongoose.connection.on('reconnected', () => console.log('User: reconnected'))
mongoose.connection.on('disconnecting', () => console.log('User: disconnecting'))
mongoose.connection.on('close', () => console.log('User: close'))

const userSchema = new mongoose.Schema({
    id: String,
    username: String,
    password: String,
    firstName: String,
    lastName: String,
})

const UserModel = mongoose.model('User', userSchema)

export default class UserService {

    async getAllUsers() {
        return await UserModel.find({}, {
            _id: 0,
            id: 1,
            username: 1,
            firstName: 1,
            lastName: 1
        })
    }
}