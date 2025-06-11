// Common keys for error details
export const DETAILS_KEYS = {
  REQUEST_PARAMS: 'requestParams',
  METHOD_NAME: 'methodName',
} as const

// Type for error details
type ErrorDetails = {
  [DETAILS_KEYS.REQUEST_PARAMS]?: Record<string, any>
  [DETAILS_KEYS.METHOD_NAME]?: string
}

export abstract class BaseError extends Error {
  static readonly DETAILS_KEYS = DETAILS_KEYS

  protected constructor(
    message: string,
    public readonly code: string,
    public readonly details?: Partial<ErrorDetails>
  ) {
    super(message)
    this.name = this.constructor.name
  }

  /**
   * Convert error to JSON format
   */
  toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
    }
  }

  /**
   * Convert error to string format
   */
  toString(): string {
    return JSON.stringify(this.toJSON())
  }

  /**
   * Check if error is instance of specific error code
   */
  static isErrorCode<T extends BaseError>(error: any, code: string): error is T {
    return error instanceof BaseError && error.code === code
  }
}
