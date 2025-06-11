import BN from 'bn.js'
import { MathUtil, TickMath } from '@cetusprotocol/common-sdk'
import Decimal from 'decimal.js'

const D365 = new BN(365)
const H24 = new BN(24)
const S3600 = new BN(3600)
const B05 = new BN(0.5)

export function estPoolAPR(pre_block_reward: BN, reward_price: BN, total_trading_fee: BN, total_liquidity_value: BN): BN {
  const annualRate = D365.mul(H24).mul(S3600).mul(B05)

  const APR = annualRate.mul(pre_block_reward.mul(reward_price).add(total_trading_fee).div(total_liquidity_value))

  return APR
}

function calculatePoolValidTVL(
  amount_a: BN,
  amount_b: BN,
  decimals_a: number,
  decimals_b: number,
  coin_a_price: Decimal,
  coin_b_price: Decimal
): Decimal {
  const poolValidAmountA = new Decimal(amount_a.toString()).div(new Decimal(10 ** decimals_a))
  const poolValidAmountB = new Decimal(amount_b.toString()).div(new Decimal(10 ** decimals_b))

  const TVL = poolValidAmountA.mul(coin_a_price).add(poolValidAmountB.mul(coin_b_price))

  return TVL
}

export type estPosAPRResult = {
  fee_apr: Decimal
  pos_rewarder_0_apr: Decimal
  pos_rewarder_1_apr: Decimal
  pos_rewarder_2_apr: Decimal
}

export function estPositionAPRWithDeltaMethod(
  current_tick_index: number,
  lower_tick_index: number,
  upper_tick_index: number,
  current_sqrt_price_x64: BN,
  pool_liquidity: BN,
  decimals_a: number,
  decimals_b: number,
  decimals_rewarder_0: number,
  decimals_rewarder_1: number,
  decimals_rewarder_2: number,
  fee_rate: number,
  amount_a_str: string,
  amount_b_str: string,
  pool_amount_a: BN,
  pool_amount_b: BN,
  swap_volume_str: string,
  pool_rewarders_0_str: string,
  pool_rewarders_1_str: string,
  pool_rewarders_2_str: string,
  coin_a_price_str: string,
  coin_b_price_str: string,
  rewarder_0_price_str: string,
  rewarder_1_price_str: string,
  rewarder_2_price_str: string
): estPosAPRResult {
  const amount_a = new Decimal(amount_a_str)
  const amount_b = new Decimal(amount_b_str)
  const swap_volume = new Decimal(swap_volume_str)
  const pool_rewarders_0 = new Decimal(pool_rewarders_0_str)
  const pool_rewarders_1 = new Decimal(pool_rewarders_1_str)
  const pool_rewarders_2 = new Decimal(pool_rewarders_2_str)
  const coin_a_price = new Decimal(coin_a_price_str)
  const coin_b_price = new Decimal(coin_b_price_str)
  const rewarder_0_price = new Decimal(rewarder_0_price_str)
  const rewarder_1_price = new Decimal(rewarder_1_price_str)
  const rewarder_2_price = new Decimal(rewarder_2_price_str)

  const lower_sqrt_price_x64 = TickMath.tickIndexToSqrtPriceX64(lower_tick_index)
  const upper_sqrt_price_x64 = TickMath.tickIndexToSqrtPriceX64(upper_tick_index)
  const lower_sqrt_price_d = MathUtil.toX64Decimal(MathUtil.fromX64(lower_sqrt_price_x64)).round()
  const upper_sqrt_price_d = MathUtil.toX64Decimal(MathUtil.fromX64(upper_sqrt_price_x64)).round()
  const current_sqrt_price_d = MathUtil.toX64Decimal(MathUtil.fromX64(current_sqrt_price_x64)).round()
  let delta_liquidity
  const liquidity_amount_0 = amount_a
    .mul(new Decimal(10 ** decimals_a))
    .mul(upper_sqrt_price_d.mul(lower_sqrt_price_d))
    .div(upper_sqrt_price_d.sub(lower_sqrt_price_d))
    .round()
  const liquidity_amount_1 = amount_b
    .mul(new Decimal(10 ** decimals_b))
    .div(upper_sqrt_price_d.sub(lower_sqrt_price_d))
    .round()
  if (current_tick_index < lower_tick_index) {
    delta_liquidity = liquidity_amount_0
  } else if (current_tick_index > upper_tick_index) {
    delta_liquidity = liquidity_amount_1
  } else {
    delta_liquidity = Decimal.min(liquidity_amount_0, liquidity_amount_1)
  }
  const delta_y = delta_liquidity.mul(current_sqrt_price_d.sub(lower_sqrt_price_d))
  const delta_x = delta_liquidity.mul(upper_sqrt_price_d.sub(current_sqrt_price_d)).div(current_sqrt_price_d.mul(upper_sqrt_price_d))
  const pos_valid_tvl = delta_x
    .div(new Decimal(10 ** decimals_a))
    .mul(coin_a_price)
    .add(delta_y.div(new Decimal(10 ** decimals_b).mul(coin_b_price)))
  const pool_valid_tvl = calculatePoolValidTVL(pool_amount_a, pool_amount_b, decimals_a, decimals_b, coin_a_price, coin_b_price)
  const pos_valid_rate = pos_valid_tvl.div(pool_valid_tvl)

  const fee_apr = delta_liquidity.eq(new Decimal(0))
    ? new Decimal(0)
    : new Decimal(fee_rate / 10000)
        .mul(swap_volume)
        .mul(
          new Decimal(delta_liquidity.toString()).div(new Decimal(pool_liquidity.toString()).add(new Decimal(delta_liquidity.toString())))
        )
        .div(pos_valid_tvl)

  const apr_coe = pos_valid_rate.eq(new Decimal(0)) ? new Decimal(0) : pos_valid_rate.mul(new Decimal(36500 / 7)).div(pos_valid_tvl)
  const pos_rewarder_0_apr = pool_rewarders_0
    .div(new Decimal(10 ** decimals_rewarder_0))
    .mul(rewarder_0_price)
    .mul(apr_coe)
  const pos_rewarder_1_apr = pool_rewarders_1
    .div(new Decimal(10 ** decimals_rewarder_1))
    .mul(rewarder_1_price)
    .mul(apr_coe)
  const pos_rewarder_2_apr = pool_rewarders_2
    .div(new Decimal(10 ** decimals_rewarder_2))
    .mul(rewarder_2_price)
    .mul(apr_coe)
  return {
    fee_apr,
    pos_rewarder_0_apr,
    pos_rewarder_1_apr,
    pos_rewarder_2_apr,
  }
}

export function estPositionAPRWithMultiMethod(
  lower_user_price: number,
  upper_user_price: number,
  lower_hist_price: number,
  upper_hist_price: number
): Decimal {
  const retro_lower = Math.max(lower_user_price, lower_hist_price)
  const retro_upper = Math.min(upper_user_price, upper_hist_price)
  const retro_range = retro_upper - retro_lower
  const user_range = upper_user_price - lower_user_price
  const hist_range = upper_hist_price - lower_hist_price
  const user_range_d = new Decimal(user_range.toString())
  const hist_range_d = new Decimal(hist_range.toString())
  const retro_range_d = new Decimal(retro_range.toString())

  let m = new Decimal('0')
  if (retro_range < 0) {
    m = new Decimal('0')
  } else if (user_range === retro_range) {
    m = hist_range_d.div(retro_range_d)
  } else if (hist_range === retro_range) {
    m = retro_range_d.div(user_range_d)
  } else {
    m = retro_range_d.mul(retro_range_d).div(hist_range_d).div(user_range_d)
  }

  return m
}
