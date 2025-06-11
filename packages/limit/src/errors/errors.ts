import { BaseError } from '@cetusprotocol/common-sdk'

export enum LimitErrorCode {
  DynamicFieldNotFound = 'DynamicFieldNotFound',
  LimitOrderListNotFound = 'LimitOrderListNotFound',
  LimitOrderNotFound = 'LimitOrderNotFound',
  LimitOrderIdInValid = 'LimitOrderIdInValid',
  BuildError = 'BuildError',
  FetchError = 'FetchError',
}

export class LimitError extends BaseError {
  constructor(message: string, error_code?: LimitErrorCode, details?: Record<string, any>) {
    super(message, error_code || 'UnknownError', details)
  }

  static isLimitErrorCode(e: any, code: LimitErrorCode): boolean {
    return this.isErrorCode<LimitError>(e, code)
  }
}

export const handleError = (code: LimitErrorCode, error: Error | string, details?: Record<string, any>) => {
  if (error instanceof Error) {
    throw new LimitError(error.message, code, details)
  } else {
    throw new LimitError(error, code, details)
  }
}
