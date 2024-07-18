import { UserModel } from "../models/user.model"
import * as bcrypt from 'bcrypt'

export default class AuthService {


    async signInUser(user: any) {
        const verifyedUser = await UserModel.findOne({ username: user.username })
        const fetchedPassword: string = verifyedUser?.password as string
        const logInData = {
            isLoogedIn: "true",
            userId: verifyedUser?.id
        }

        if (verifyedUser === null || undefined) {
            throw Error
        } else {
            const verifyedPass = bcrypt.compare(user.password, fetchedPassword)
            if (await verifyedPass) {
                return logInData
            } else {
                throw Error
            }
        }

    }
}