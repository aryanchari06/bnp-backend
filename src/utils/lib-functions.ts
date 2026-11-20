const formatErrorMessage = (error: unknown) => error instanceof Error ? error.message : String(error)
export { formatErrorMessage }