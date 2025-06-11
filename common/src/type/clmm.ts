import type { TransactionObjectArgument } from '@mysten/sui/transactions'
import BN from 'bn.js'
import type { SuiAddressType, SuiObjectIdType } from './sui'

/**
 * The maximum tick index supported by the clmmpool program.
 * @category Constants
 */
export const MAX_TICK_INDEX = 443636

/**
 * The minimum tick index supported by the clmmpool program.
 * @category Constants
 */
export const MIN_TICK_INDEX = -443636

/**
 * The maximum sqrt-price supported by the clmmpool program.
 * @category Constants
 */
export const MAX_SQRT_PRICE = '79226673515401279992447579055'

/**
 * The number of initialized ticks that a tick-array account can hold.
 * @category Constants
 */
export const TICK_ARRAY_SIZE = 64

/**
 * The minimum sqrt-price supported by the clmmpool program.
 * @category Constants
 */
export const MIN_SQRT_PRICE = '4295048016'

/**
 * The denominator which the fee rate is divided on.
 * @category Constants
 */
export const FEE_RATE_DENOMINATOR = new BN(1_000_000)

/**
 * Represents input data for adding liquidity to a pool.
 */
export type LiquidityInput = {
  /**
   * The amount of coin A.
   */
  coin_amount_a: string

  /**
   * The amount of coin B.
   */
  coin_amount_b: string

  /**
   * The maximum amount of token A.
   */
  coin_amount_limit_a: string

  /**
   * The maximum amount of token B.
   */
  coin_amount_limit_b: string

  /**
   * The liquidity amount.
   */
  liquidity_amount: string

  /**
   * Whether to fix the amount of token A.
   */
  fix_amount_a: boolean
}

/**
 * Represents a coin asset with address, object ID, and balance information.
 */
export type CoinAsset = {
  /**
   * The address type of the coin asset.
   */
  coin_type: string

  /**
   * The object identifier of the coin asset.
   */
  coin_object_id: SuiObjectIdType

  /**
   * The balance amount of the coin asset.
   */
  balance: bigint
}

export type BuildCoinResult = {
  target_coin: TransactionObjectArgument
  selected_coins: string[]
  remain_coins: CoinAsset[]
  is_mint_zero_coin: boolean
  target_coin_amount: string
  original_spited_coin?: TransactionObjectArgument
}

export type CoinInputInterval = {
  amount_second: bigint
  amount_first: bigint
}

export type CoinAmounts = {
  coin_amount_a: string
  coin_amount_b: string
}

export type MultiCoinInput = {
  amount_coin_array: { coin_object_id: TransactionObjectArgument; amount: string; used: boolean }[]
  coin_type: string
  remain_coins: CoinAsset[]
}

export enum PositionStatus {
  BelowRange,
  InRange,
  AboveRange,
}

/**
 * Represents a pair of coins used in a financial context.
 */
export type CoinPairType = {
  /**
   * The address type of the coin a in the pair.
   */
  coin_type_a: SuiAddressType

  /**
   * The address type of the coin b in the pair.
   */
  coin_type_b: SuiAddressType
}
