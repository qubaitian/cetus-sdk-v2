import { BaseError } from '@cetusprotocol/common-sdk'

export enum DcaErrorCode {
  InvalidWalletAddress = `InvalidWalletAddress`,
  InvalidOrderId = `InvalidOrderId`,
  InvalidMode = `InvalidMode`,
  BuildError = 'BuildError',
  FetchError = 'FetchError',
}

export class DcaError extends BaseError {
  constructor(message: string, error_code?: DcaErrorCode, details?: Record<string, any>) {
    super(message, error_code || 'UnknownError', details)
  }

  static isDcaErrorCode(e: any, code: DcaErrorCode): boolean {
    return this.isErrorCode<DcaError>(e, code)
  }
}

export const handleError = (code: DcaErrorCode, error: Error | string, details?: Record<string, any>) => {
  if (error instanceof Error) {
    throw new DcaError(error.message, code, details)
  } else {
    throw new DcaError(error, code, details)
  }
}
