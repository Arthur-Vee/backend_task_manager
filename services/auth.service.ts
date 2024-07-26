import { Auth } from "../models/auth.model"
import { UserModel } from "../models/user.model"
import * as bcrypt from 'bcrypt'

export default class AuthService {


    async signInUser(user: Auth) {
        const verifiedUser = await UserModel.findOne({ username: user.username })
        const fetchedPassword: string = verifiedUser?.password as string
        const logInData = {
            isLoogedIn: "true",
            userId: verifiedUser?.id
        }
        if (verifiedUser === null || undefined) {
            throw Error
        } else {
            const verifiedPass = bcrypt.compare(user.password, fetchedPassword)
            if (await verifiedPass) {
                return logInData
            } else {
                throw Error
            }
        }
    }
    async verifyAdmin(adminToken: string) {
        const getUser = await UserModel.findOne({ id: adminToken })
        return getUser?.roles.includes("ADMIN")
    }
}