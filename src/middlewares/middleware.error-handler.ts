import type { ErrorRequestHandler } from "express"
import { AppError } from "../types/errors.js"
import { HttpResponse } from "../utils/http-response.js"

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    console.error(error instanceof Error ? error.message : error)
    if (res.headersSent) return next(error)

    if (error instanceof AppError) 
        return HttpResponse(res, { statusCode: error.statusCode, body: { message: error.message}})

    return HttpResponse(res, { statusCode: 500, body: { message: 'Internal Server Error' }})
}

export default errorHandler