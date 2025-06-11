import { BaseError } from '@cetusprotocol/common-sdk'

export enum FarmsErrorCode {
  BuildError = 'BuildError',
  FetchError = 'FetchError',
}

export class FarmsError extends BaseError {
  constructor(message: string, errorCode?: FarmsErrorCode, details?: Record<string, any>) {
    super(message, errorCode || 'UnknownError', details)
  }

  static isFarmsErrorCode(e: any, code: FarmsErrorCode): boolean {
    return this.isErrorCode<FarmsError>(e, code)
  }
}

export const handleError = (code: FarmsErrorCode, error: Error, details?: Record<string, any>) => {
  throw new FarmsError(error.message, code, details)
}

export const handleMessageError = (code: FarmsErrorCode, message: string, details?: Record<string, any>) => {
  throw new FarmsError(message, code, details)
}
