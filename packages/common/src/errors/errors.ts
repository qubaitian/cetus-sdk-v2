import { BaseError } from './baseError'

export enum CommonErrorCode {
  MultiplicationOverflow = 'MultiplicationOverflow',
  DivisionByZero = 'DivisionByZero',
  CoinNotFound = 'CoinNotFound',
  InsufficientBalance = 'InsufficientBalance',
  InvalidTick = 'InvalidTick',
  InvalidSenderAddress = 'InvalidSenderAddress',
}

export class CommonError extends BaseError {
  constructor(message: string, errorCode?: CommonErrorCode, details?: Record<string, any>) {
    super(message, errorCode || 'UnknownError', details)
  }

  static isCommonErrorCode(e: any, code: CommonErrorCode): boolean {
    return this.isErrorCode<CommonError>(e, code)
  }
}

export const handleError = (code: CommonErrorCode, error: Error, details?: Record<string, any>) => {
  throw new CommonError(error.message, code, details)
}

export const handleMessageError = (code: CommonErrorCode, message: string, details?: Record<string, any>) => {
  throw new CommonError(message, code, details)
}
