interface ErrorDetails {
  message: string
  stack?: string
  componentName?: string
  additionalInfo?: Record<string, unknown>
}

export const logError = (error: ErrorDetails) => {
  if (import.meta.env.PROD && import.meta.env.VITE_ENABLE_ERROR_REPORTING) {
    // Here you would typically send to your error tracking service
    console.error('[Production Error]:', error)
  } else {
    console.error('[Development Error]:', error)
  }
}

export const createErrorBoundary = (componentName: string) => {
  return (err: Error, additionalInfo?: Record<string, unknown>) => {
    logError({
      message: err.message,
      stack: err.stack,
      componentName,
      additionalInfo
    })
    return false
  }
}