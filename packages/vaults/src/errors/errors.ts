import { BaseError } from '@cetusprotocol/common-sdk'

export enum VaultsErrorCode {
  CalculateDepositAmountError = 'calculateDepositAmountError',
  CalculateWithdrawAmountError = 'calculateWithdrawAmountError',
  AggregatorError = 'AggregatorError',
  ObjectNotFound = 'ObjectNotFound',
  FetchError = 'FetchError',
  StakeProtocolNotFound = 'StakeProtocolNotFound',
  BuildError = 'BuildError',
  AssertionError = 'AssertionError',
  InvalidMaxFtAmount = 'InvalidMaxFtAmount',
  ConfigError = 'ConfigError',
}

export class VaultsError extends BaseError {
  constructor(message: string, errorCode?: VaultsErrorCode, details?: Record<string, any>) {
    super(message, errorCode || 'UnknownError', details)
  }

  static isVaultsErrorCode(e: any, code: VaultsErrorCode): boolean {
    return this.isErrorCode<VaultsError>(e, code)
  }
}

export const handleError = (code: VaultsErrorCode, error: Error, details?: Record<string, any>) => {
  throw new VaultsError(error.message, code, details)
}

export const handleMessageError = (code: VaultsErrorCode, message: string, details?: Record<string, any>) => {
  throw new VaultsError(message, code, details)
}
