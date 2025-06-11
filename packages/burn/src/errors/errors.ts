import { BaseError } from '@cetusprotocol/common-sdk'

export enum BurnErrorCode {
  InvalidPoolId = `InvalidPoolId`,
  InvalidPositionId = `InvalidPositionId`,
  InvalidAccountAddress = `InvalidAccountAddress`,
  BuildError = 'BuildError',
  FetchError = 'FetchError',
}

export class BurnError extends BaseError {
  constructor(message: string, error_code?: BurnErrorCode, details?: Record<string, any>) {
    super(message, error_code || 'UnknownError', details)
  }

  static isBurnErrorCode(e: any, code: BurnErrorCode): boolean {
    return this.isErrorCode<BurnError>(e, code)
  }
}

export const handleError = (code: BurnErrorCode, error: Error | string, details?: Record<string, any>) => {
  if (error instanceof Error) {
    throw new BurnError(error.message, code, details)
  } else {
    throw new BurnError(error, code, details)
  }
}
