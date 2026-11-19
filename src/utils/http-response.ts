import type { Response } from 'express'

type HttpResponseOptions<T> = {
    statusCode: number,
    body: T,
    headers?: Record<string, string>
}

export function HttpResponse<T>(
    res: Response<T>,
    { statusCode, body, headers }: HttpResponseOptions<T>
): Response<T> {
    if (headers) res.set(headers)
    return res.status(statusCode).json(body)
}