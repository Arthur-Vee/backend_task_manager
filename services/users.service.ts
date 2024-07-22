import mongoose from "mongoose"
import { User, UserModel } from "../models/user.model"
import ErrorHandler from "../errors/errorHandler"
import { v4 as uuidv4 } from "uuid"
import * as bcrypt from 'bcrypt'


mongoose.connection.on('connected', () => console.log('User: connected'))
mongoose.connection.on('open', () => console.log('User: open'))
mongoose.connection.on('disconnected', () => console.log('User: disconnected'))
mongoose.connection.on('reconnected', () => console.log('User: reconnected'))
mongoose.connection.on('disconnecting', () => console.log('User: disconnecting'))
mongoose.connection.on('close', () => console.log('User: close'))


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
    async getUserById(userId: string) {
        var user = await UserModel.findOne({ id: userId }, {
            _id: 0,
            username: 1,
            firstName: 1,
            lastName: 1
        })
        return user
    }
}