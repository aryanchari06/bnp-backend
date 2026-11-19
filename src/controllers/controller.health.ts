import type { Request, Response } from 'express'
import { HttpResponse } from '../utils/http-response.js'

export const health = async (req: Request, res: Response) => {
    return HttpResponse(res, { statusCode: 200, body: { message: "OK" } })
}