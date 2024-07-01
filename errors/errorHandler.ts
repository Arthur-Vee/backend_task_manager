import { StatusCodes } from "http-status-codes"


export default class ErrorHandler extends Error {

    public readonly httpCode: number

    constructor(httpCode: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR) {
        super()
        Object.setPrototypeOf(this, new.target.prototype)//check if needed
        this.httpCode = httpCode
        Error.captureStackTrace(this)
    }
}