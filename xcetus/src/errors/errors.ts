import { BaseError } from '@cetusprotocol/common-sdk'

export enum XCetusErrorCode {
  InvalidVeNftId = `InvalidVeNftId`,
  InvalidLockId = `InvalidLockId`,
  InvalidPhase = `InvalidPhase`,
  InvalidAccountAddress = `InvalidAccountAddress`,
  InvalidLockManagerId = `InvalidLockManagerId`,
  BuildError = 'BuildError',
  FetchError = 'FetchError',
}

export class XCetusError extends BaseError {
  constructor(message: string, error_code?: XCetusErrorCode, details?: Record<string, any>) {
    super(message, error_code || 'UnknownError', details)
  }

  static isXCetusErrorCode(e: any, code: XCetusErrorCode): boolean {
    return this.isErrorCode<XCetusError>(e, code)
  }
}

export const handleError = (code: XCetusErrorCode, error: Error | string, details?: Record<string, any>) => {
  if (error instanceof Error) {
    throw new XCetusError(error.message, code, details)
  } else {
    throw new XCetusError(error, code, details)
  }
}
