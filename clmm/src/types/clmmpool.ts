import BN from 'bn.js'
import {
  asUintN,
  CoinPairType,
  FEE_RATE_DENOMINATOR,
  getDeltaDownFromOutput,
  getDeltaUpFromInput,
  getNextSqrtPriceFromInput,
  getNextSqrtPriceFromOutput,
  MathUtil,
  ZERO,
} from '@cetusprotocol/common-sdk'
import Decimal from 'decimal.js'
import { SwapUtils } from '../utils/swapUtils'
import { Pool } from './clmm_type'

export type BasePath = {
  direction: boolean
  label: string
  pool_address: string
  from_coin: string
  to_coin: string
  fee_rate: number
  output_amount: number
  input_amount: number
  current_sqrt_price: BN
  from_decimal: number
  to_decimal: number
  current_price: Decimal
}

export type SplitPath = {
  percent: number
  input_amount: number
  output_amount: number
  path_index: number
  last_quote_output: number
  base_paths: BasePath[]
}
/**
 * Represents tick data for a liquidity pool.
 */
export type TickData = {
  /**
   * The object identifier of the tick data.
   */
  object_id: string

  /**
   * The index of the tick.
   */
  index: number

  /**
   * The square root price value for the tick.
   */
  sqrt_price: BN

  /**
   * The net liquidity value for the tick.
   */
  liquidity_net: BN

  /**
   * The gross liquidity value for the tick.
   */
  liquidity_gross: BN

  /**
   * The fee growth outside coin A for the tick.
   */
  fee_growth_outside_a: BN

  /**
   * The fee growth outside coin B for the tick.
   */
  fee_growth_outside_b: BN

  /**
   * An array of rewarders' growth outside values for the tick.
   */
  rewarders_growth_outside: BN[]
}

/**
 * Represents a tick for a liquidity pool.
 */
export type Tick = {
  /**
   * The index of the tick.
   */
  index: Bits

  /**
   * The square root price value for the tick (string representation).
   */
  sqrt_price: string

  /**
   * The net liquidity value for the tick (Bits format).
   */
  liquidity_net: Bits

  /**
   * The gross liquidity value for the tick (string representation).
   */
  liquidity_gross: string

  /**
   * The fee growth outside coin A for the tick (string representation).
   */
  fee_growth_outside_a: string

  /**
   * The fee growth outside coin B for the tick (string representation).
   */
  fee_growth_outside_b: string

  /**
   * An array of rewarders' growth outside values for the tick (array of string representations).
   */
  rewarders_growth_outside: string[3]
}

export type SwapResult = {
  amount_in: BN
  amount_out: BN
  fee_amount: BN
  ref_amount: BN
  next_sqrt_price: BN
  cross_tick_num: number
}

export type SwapStepResult = {
  amount_in: BN
  amount_out: BN
  next_sqrt_price: BN
  fee_amount: BN
}

/**
 * Represents bits information.
 */
export type Bits = {
  bits: string
}

/**
 * Creates a Bits object from an index.
 * @param {number | string} index - The index value.
 * @returns {Bits} The created Bits object.
 */
export function newBits(index: number | string): Bits {
  const index_BN = new BN(index)
  if (index_BN.lt(ZERO)) {
    return {
      bits: index_BN
        .neg()
        .xor(new BN(2).pow(new BN(64)).sub(new BN(1)))
        .add(new BN(1))
        .toString(),
    }
  }
  return {
    bits: index_BN.toString(),
  }
}

/**
 * Represents data for a liquidity mining pool.
 */
export type ClmmpoolData = {
  current_sqrt_price: BN
  current_tick_index: number
  fee_growth_global_a: BN
  fee_growth_global_b: BN
  fee_protocol_coin_a: BN
  fee_protocol_coin_b: BN
  fee_rate: BN
  liquidity: BN
  tick_indexes: number[]
  tick_spacing: number
  ticks: Array<TickData>
  collection_name: string
} & CoinPairType

/**
 * Transforms a Pool object into ClmmpoolData format.
 * @param {Pool} pool - The liquidity pool object to transform.
 * @returns {ClmmpoolData} The transformed ClmmpoolData object.
 */
export function transClmmpoolDataWithoutTicks(pool: Pool): ClmmpoolData {
  const poolData: ClmmpoolData = {
    coin_type_a: pool.coin_type_a, // string
    coin_type_b: pool.coin_type_b, // string
    current_sqrt_price: new BN(pool.current_sqrt_price), // BN
    current_tick_index: pool.current_tick_index, // number
    fee_growth_global_a: new BN(pool.fee_growth_global_a), // BN
    fee_growth_global_b: new BN(pool.fee_growth_global_b), // BN
    fee_protocol_coin_a: new BN(pool.fee_protocol_coin_a), // BN
    fee_protocol_coin_b: new BN(pool.fee_protocol_coin_b), // BN
    fee_rate: new BN(pool.fee_rate), // number
    liquidity: new BN(pool.liquidity), // BN
    tick_indexes: [], // number[]
    tick_spacing: Number(pool.tick_spacing), // number
    ticks: [], // Array<TickData>
    collection_name: '',
  }
  return poolData
}

/**
 * Simulate per step of swap on every tick.
 *
 * @param currentSqrtPrice
 * @param targetSqrtPrice
 * @param liquidity
 * @param amount
 * @param feeRate
 * @param byAmountIn
 * @returns
 */
export function computeSwapStep(
  currentSqrtPrice: BN,
  targetSqrtPrice: BN,
  liquidity: BN,
  amount: BN,
  feeRate: BN,
  byAmountIn: boolean
): SwapStepResult {
  if (liquidity === ZERO) {
    return {
      amount_in: ZERO,
      amount_out: ZERO,
      next_sqrt_price: targetSqrtPrice,
      fee_amount: ZERO,
    }
  }
  const a2b = currentSqrtPrice.gte(targetSqrtPrice)
  let amountIn: BN
  let amountOut: BN
  let nextSqrtPrice: BN
  let feeAmount: BN
  if (byAmountIn) {
    const amountRemain = MathUtil.checkMulDivFloor(
      amount,
      MathUtil.checkUnsignedSub(FEE_RATE_DENOMINATOR, feeRate),
      FEE_RATE_DENOMINATOR,
      64
    )
    const maxAmountIn = getDeltaUpFromInput(currentSqrtPrice, targetSqrtPrice, liquidity, a2b)
    if (maxAmountIn.gt(amountRemain)) {
      amountIn = amountRemain
      feeAmount = MathUtil.checkUnsignedSub(amount, amountRemain)
      nextSqrtPrice = getNextSqrtPriceFromInput(currentSqrtPrice, liquidity, amountRemain, a2b)
    } else {
      amountIn = maxAmountIn
      feeAmount = MathUtil.checkMulDivCeil(amountIn, feeRate, FEE_RATE_DENOMINATOR.sub(feeRate), 64)
      nextSqrtPrice = targetSqrtPrice
    }
    amountOut = getDeltaDownFromOutput(currentSqrtPrice, nextSqrtPrice, liquidity, a2b)
  } else {
    const maxAmountOut = getDeltaDownFromOutput(currentSqrtPrice, targetSqrtPrice, liquidity, a2b)
    if (maxAmountOut.gt(amount)) {
      amountOut = amount
      nextSqrtPrice = getNextSqrtPriceFromOutput(currentSqrtPrice, liquidity, amount, a2b)
    } else {
      amountOut = maxAmountOut
      nextSqrtPrice = targetSqrtPrice
    }
    amountIn = getDeltaUpFromInput(currentSqrtPrice, nextSqrtPrice, liquidity, a2b)
    feeAmount = MathUtil.checkMulDivCeil(amountIn, feeRate, FEE_RATE_DENOMINATOR.sub(feeRate), 64)
  }
  return {
    amount_in: amountIn,
    amount_out: amountOut,
    next_sqrt_price: nextSqrtPrice,
    fee_amount: feeAmount,
  }
}

/**
 * Simulate swap by imput lots of ticks.
 * @param aToB
 * @param byAmountIn
 * @param amount
 * @param poolData
 * @param swapTicks
 * @returns
 */
export function computeSwap(
  aToB: boolean,
  byAmountIn: boolean,
  amount: BN,
  poolData: ClmmpoolData,
  swapTicks: Array<TickData>
): SwapResult {
  let remainAmount = amount
  let currentLiquidity = poolData.liquidity
  let { current_sqrt_price } = poolData
  const swapResult: SwapResult = {
    amount_in: ZERO,
    amount_out: ZERO,
    fee_amount: ZERO,
    ref_amount: ZERO,
    next_sqrt_price: ZERO,
    cross_tick_num: 0,
  }
  let target_sqrt_price
  let signed_liquidity_change
  const sqrt_price_limit = SwapUtils.getDefaultSqrtPriceLimit(aToB)
  for (const tick of swapTicks) {
    if (aToB && poolData.current_tick_index < tick.index) {
      continue
    }
    if (!aToB && poolData.current_tick_index >= tick.index) {
      continue
    }
    if (tick === null) {
      continue
    }
    if ((aToB && sqrt_price_limit.gt(tick.sqrt_price)) || (!aToB && sqrt_price_limit.lt(tick.sqrt_price))) {
      target_sqrt_price = sqrt_price_limit
    } else {
      target_sqrt_price = tick.sqrt_price
    }

    const stepResult = computeSwapStep(current_sqrt_price, target_sqrt_price, currentLiquidity, remainAmount, poolData.fee_rate, byAmountIn)

    if (!stepResult.amount_in.eq(ZERO)) {
      remainAmount = byAmountIn
        ? remainAmount.sub(stepResult.amount_in.add(stepResult.fee_amount))
        : remainAmount.sub(stepResult.amount_out)
    }

    swapResult.amount_in = swapResult.amount_in.add(stepResult.amount_in)
    swapResult.amount_out = swapResult.amount_out.add(stepResult.amount_out)
    swapResult.fee_amount = swapResult.fee_amount.add(stepResult.fee_amount)
    if (stepResult.next_sqrt_price.eq(tick.sqrt_price)) {
      signed_liquidity_change = tick.liquidity_net.mul(new BN(-1))

      if (aToB) {
        if (MathUtil.is_neg(signed_liquidity_change)) {
          currentLiquidity = currentLiquidity.add(new BN(asUintN(BigInt(signed_liquidity_change.toString()), 128)))
        } else {
          currentLiquidity = currentLiquidity.add(signed_liquidity_change)
        }
      } else if (MathUtil.is_neg(signed_liquidity_change)) {
        currentLiquidity = currentLiquidity.sub(new BN(asUintN(BigInt(signed_liquidity_change.toString()), 128)))
      } else {
        currentLiquidity = currentLiquidity.sub(signed_liquidity_change)
      }

      current_sqrt_price = tick.sqrt_price
    } else {
      current_sqrt_price = stepResult.next_sqrt_price
    }
    swapResult.cross_tick_num += 1
    if (remainAmount.eq(ZERO)) {
      break
    }
  }
  swapResult.amount_in = swapResult.amount_in.add(swapResult.fee_amount)
  swapResult.next_sqrt_price = current_sqrt_price
  return swapResult
}
