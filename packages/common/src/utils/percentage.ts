import BN from 'bn.js'
import { Decimal } from 'decimal.js'
import type { CoinAmounts } from '../type/clmm'

/**
 * Percentage - the util set for percentage struct.
 */
export class Percentage {
  readonly numerator: BN

  readonly denominator: BN

  constructor(numerator: BN, denominator: BN) {
    this.toString = () => {
      return `${this.numerator.toString()}/${this.denominator.toString()}`
    }
    this.numerator = numerator
    this.denominator = denominator
  }

  /**
   * Get the percentage of a number.
   *
   * @param number
   * @returns
   */
  static fromDecimal(number: Decimal): Percentage {
    return Percentage.fromFraction(number.toDecimalPlaces(1).mul(10).toNumber(), 1000)
  }

  /**
   * Convert the percentage to a Decimal
   *
   * @returns Decimal representation of the percentage
   */
  toDecimal(): Decimal {
    return new Decimal(this.numerator.toString()).div(this.denominator.toString()).mul(100)
  }

  /**
   * Get the percentage of a fraction.
   *
   * @param numerator
   * @param denominator
   * @returns
   */
  static fromFraction(numerator: BN | number, denominator: BN | number): Percentage {
    const num = typeof numerator === 'number' ? new BN(numerator.toString()) : numerator
    const denom = typeof denominator === 'number' ? new BN(denominator.toString()) : denominator
    return new Percentage(num, denom)
  }
}

export function adjustForSlippage(n: BN, { numerator, denominator }: Percentage, adjust_up: boolean): BN {
  if (adjust_up) {
    return n.mul(denominator.add(numerator)).div(denominator)
  }
  return n.mul(denominator).div(denominator.add(numerator))
}

/**
 * Adjusts token amounts based on slippage tolerance
 * @param token_amount - The input token amounts
 * @param slippage - The slippage percentage
 * @param adjust_up - If true, adjusts up for maximum amount, if false adjusts down for minimum amount
 * @throws Error if token amounts are invalid
 * @returns Object with adjusted coin limits
 */
export function adjustForCoinSlippage(
  token_amount: CoinAmounts,
  slippage: Percentage,
  adjust_up: boolean
): { coin_amount_limit_a: string; coin_amount_limit_b: string } {
  if (!token_amount?.coin_amount_a || !token_amount?.coin_amount_b) {
    throw new Error('Invalid token amounts')
  }

  try {
    const coinLimitA = adjustForSlippage(new BN(token_amount.coin_amount_a), slippage, adjust_up)
    const coinLimitB = adjustForSlippage(new BN(token_amount.coin_amount_b), slippage, adjust_up)

    return {
      coin_amount_limit_a: coinLimitA.toString(),
      coin_amount_limit_b: coinLimitB.toString(),
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Failed to adjust for slippage: ${errorMessage}`)
  }
}
