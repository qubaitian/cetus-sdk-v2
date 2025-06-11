/* eslint-disable import/no-unresolved */
/* eslint-disable no-bitwise */
import BN from 'bn.js'
import { d } from '.'
import { MAX_SQRT_PRICE, MIN_SQRT_PRICE } from '../type/clmm'
import Decimal from './decimal'
import { MathUtil } from './utils'

const BIT_PRECISION = 14
const LOG_B_2_X32 = '59543866431248'
const LOG_B_P_ERR_MARGIN_LOWER_X64 = '184467440737095516'
const LOG_B_P_ERR_MARGIN_UPPER_X64 = '15793534762490258745'
const TICK_BOUND = 443636

function signedShiftLeft(n0: BN, shift_by: number, bit_width: number) {
  const twosN0 = n0.toTwos(bit_width).shln(shift_by)
  twosN0.imaskn(bit_width + 1)
  return twosN0.fromTwos(bit_width)
}

function signedShiftRight(n0: BN, shift_by: number, bit_width: number) {
  const twoN0 = n0.toTwos(bit_width).shrn(shift_by)
  twoN0.imaskn(bit_width - shift_by + 1)
  return twoN0.fromTwos(bit_width - shift_by)
}

function tickIndexToSqrtPricePositive(tick: number) {
  let ratio: BN

  if ((tick & 1) !== 0) {
    ratio = new BN('79232123823359799118286999567')
  } else {
    ratio = new BN('79228162514264337593543950336')
  }

  if ((tick & 2) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('79236085330515764027303304731')), 96, 256)
  }
  if ((tick & 4) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('79244008939048815603706035061')), 96, 256)
  }
  if ((tick & 8) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('79259858533276714757314932305')), 96, 256)
  }
  if ((tick & 16) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('79291567232598584799939703904')), 96, 256)
  }
  if ((tick & 32) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('79355022692464371645785046466')), 96, 256)
  }
  if ((tick & 64) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('79482085999252804386437311141')), 96, 256)
  }
  if ((tick & 128) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('79736823300114093921829183326')), 96, 256)
  }
  if ((tick & 256) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('80248749790819932309965073892')), 96, 256)
  }
  if ((tick & 512) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('81282483887344747381513967011')), 96, 256)
  }
  if ((tick & 1024) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('83390072131320151908154831281')), 96, 256)
  }
  if ((tick & 2048) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('87770609709833776024991924138')), 96, 256)
  }
  if ((tick & 4096) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('97234110755111693312479820773')), 96, 256)
  }
  if ((tick & 8192) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('119332217159966728226237229890')), 96, 256)
  }
  if ((tick & 16384) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('179736315981702064433883588727')), 96, 256)
  }
  if ((tick & 32768) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('407748233172238350107850275304')), 96, 256)
  }
  if ((tick & 65536) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('2098478828474011932436660412517')), 96, 256)
  }
  if ((tick & 131072) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('55581415166113811149459800483533')), 96, 256)
  }
  if ((tick & 262144) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('38992368544603139932233054999993551')), 96, 256)
  }

  return signedShiftRight(ratio, 32, 256)
}

function tickIndexToSqrtPriceNegative(tick_index: number) {
  const tick = Math.abs(tick_index)
  let ratio: BN

  if ((tick & 1) !== 0) {
    ratio = new BN('18445821805675392311')
  } else {
    ratio = new BN('18446744073709551616')
  }

  if ((tick & 2) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('18444899583751176498')), 64, 256)
  }
  if ((tick & 4) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('18443055278223354162')), 64, 256)
  }
  if ((tick & 8) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('18439367220385604838')), 64, 256)
  }
  if ((tick & 16) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('18431993317065449817')), 64, 256)
  }
  if ((tick & 32) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('18417254355718160513')), 64, 256)
  }
  if ((tick & 64) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('18387811781193591352')), 64, 256)
  }
  if ((tick & 128) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('18329067761203520168')), 64, 256)
  }
  if ((tick & 256) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('18212142134806087854')), 64, 256)
  }
  if ((tick & 512) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('17980523815641551639')), 64, 256)
  }
  if ((tick & 1024) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('17526086738831147013')), 64, 256)
  }
  if ((tick & 2048) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('16651378430235024244')), 64, 256)
  }
  if ((tick & 4096) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('15030750278693429944')), 64, 256)
  }
  if ((tick & 8192) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('12247334978882834399')), 64, 256)
  }
  if ((tick & 16384) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('8131365268884726200')), 64, 256)
  }
  if ((tick & 32768) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('3584323654723342297')), 64, 256)
  }
  if ((tick & 65536) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('696457651847595233')), 64, 256)
  }
  if ((tick & 131072) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('26294789957452057')), 64, 256)
  }
  if ((tick & 262144) !== 0) {
    ratio = signedShiftRight(ratio.mul(new BN('37481735321082')), 64, 256)
  }

  return ratio
}

export class TickMath {
  static priceToSqrtPriceX64(price: Decimal, decimals_a: number, decimals_b: number): BN {
    return MathUtil.toX64(price.mul(Decimal.pow(10, decimals_b - decimals_a)).sqrt())
  }

  static sqrtPriceX64ToPrice(sqrt_price_x64: BN, decimals_a: number, decimals_b: number): Decimal {
    return MathUtil.fromX64(sqrt_price_x64)
      .pow(2)
      .mul(Decimal.pow(10, decimals_a - decimals_b))
  }

  static tickIndexToSqrtPriceX64(tick_index: number): BN {
    if (tick_index > 0) {
      return new BN(tickIndexToSqrtPricePositive(tick_index))
    }
    return new BN(tickIndexToSqrtPriceNegative(tick_index))
  }

  static sqrtPriceX64ToTickIndex(sqrt_price_x64: BN): number {
    if (sqrt_price_x64.gt(new BN(MAX_SQRT_PRICE)) || sqrt_price_x64.lt(new BN(MIN_SQRT_PRICE))) {
      throw new Error('Provided sqrtPrice is not within the supported sqrtPrice range.')
    }

    const msb = sqrt_price_x64.bitLength() - 1
    const adjusted_msb = new BN(msb - 64)
    const log2p_integer_x32 = signedShiftLeft(adjusted_msb, 32, 128)

    let bit = new BN('8000000000000000', 'hex')
    let precision = 0
    let log2p_fraction_x64 = new BN(0)

    let r = msb >= 64 ? sqrt_price_x64.shrn(msb - 63) : sqrt_price_x64.shln(63 - msb)

    while (bit.gt(new BN(0)) && precision < BIT_PRECISION) {
      r = r.mul(r)
      const rMoreThanTwo = r.shrn(127)
      r = r.shrn(63 + rMoreThanTwo.toNumber())
      log2p_fraction_x64 = log2p_fraction_x64.add(bit.mul(rMoreThanTwo))
      bit = bit.shrn(1)
      precision += 1
    }

    const log2p_fraction_x32 = log2p_fraction_x64.shrn(32)

    const log2p_x32 = log2p_integer_x32.add(log2p_fraction_x32)
    const logbp_x64 = log2p_x32.mul(new BN(LOG_B_2_X32))

    const tick_low = signedShiftRight(logbp_x64.sub(new BN(LOG_B_P_ERR_MARGIN_LOWER_X64)), 64, 128).toNumber()
    const tick_high = signedShiftRight(logbp_x64.add(new BN(LOG_B_P_ERR_MARGIN_UPPER_X64)), 64, 128).toNumber()

    if (tick_low === tick_high) {
      return tick_low
    }
    const derived_tick_high_sqrt_price_x64 = TickMath.tickIndexToSqrtPriceX64(tick_high)
    if (derived_tick_high_sqrt_price_x64.lte(sqrt_price_x64)) {
      return tick_high
    }
    return tick_low
  }

  static tickIndexToPrice(tick_index: number, decimals_a: number, decimals_b: number): Decimal {
    return TickMath.sqrtPriceX64ToPrice(TickMath.tickIndexToSqrtPriceX64(tick_index), decimals_a, decimals_b)
  }

  static priceToTickIndex(price: Decimal, decimals_a: number, decimals_b: number): number {
    return TickMath.sqrtPriceX64ToTickIndex(TickMath.priceToSqrtPriceX64(price, decimals_a, decimals_b))
  }

  static priceToInitializeTickIndex(price: Decimal, decimals_a: number, decimals_b: number, tick_spacing: number): number {
    return TickMath.getInitializeTickIndex(TickMath.priceToTickIndex(price, decimals_a, decimals_b), tick_spacing)
  }

  static getInitializeTickIndex(tick_index: number, tick_spacing: number): number {
    return tick_index - (tick_index % tick_spacing)
  }

  /**
   *
   * @param tick_index
   * @param tick_spacing
   * @returns
   */
  static getNextInitializeTickIndex(tick_index: number, tick_spacing: number) {
    return TickMath.getInitializeTickIndex(tick_index, tick_spacing) + tick_spacing
  }

  static getPrevInitializeTickIndex(tick_index: number, tick_spacing: number) {
    return TickMath.getInitializeTickIndex(tick_index, tick_spacing) - tick_spacing
  }
}

export function tickScore(tick_index: number) {
  return d(tick_index).add(d(TICK_BOUND))
}
