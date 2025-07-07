import { StatusCodes } from "http-status-codes"
import ErrorHandler from "./errorHandler"

export default class TaskNotFoundError extends ErrorHandler {
    constructor() {
        super(StatusCodes.NOT_FOUND)
    }
}