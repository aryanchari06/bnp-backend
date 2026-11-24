export type AppErrorCode =
    'INCORRECT_CREDENTIALS' |
    'USER_ALREADY_EXISTS' |
    'JWT_SECRET_MISSING' |
    'USER_NOT_FOUND' |
    'INTERNAL_SERVER_ERROR' |
    'DATABASE_CONNECTION_FAILED' |
    'USER_UNAUTHENTICATED' |
    'ACCESS_TOKEN_EXPIRED' |
    'REFRESH_TOKEN_EXPIRED' |
    'INVALID_REFRESH_TOKEN'

export class AppError extends Error {
    constructor(
        public readonly code: AppErrorCode,
        message: string,
        public readonly statusCode: number
    ) {
        super(message)
        this.name = 'AppError'
    }
}