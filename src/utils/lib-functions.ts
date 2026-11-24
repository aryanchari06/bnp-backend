const formatErrorMessage = (error: unknown) => error instanceof Error ? error.message : String(error)
const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
export { formatErrorMessage, escapeRegex }