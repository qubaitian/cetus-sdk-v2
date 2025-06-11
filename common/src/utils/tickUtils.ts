import { MAX_SQRT_PRICE, MAX_TICK_INDEX, MIN_SQRT_PRICE, MIN_TICK_INDEX } from '../type/clmm'

export class TickUtil {
  /**
   * Get min tick index.
   * @param tick_spacing tick spacing
   * @returns min tick index
   */
  static getMinIndex(tick_spacing: number): number {
    return MIN_TICK_INDEX + (Math.abs(MIN_TICK_INDEX) % tick_spacing)
  }

  /**
   * Get max tick index.
   * @param tick_spacing - tick spacing
   * @returns max tick index
   */
  // eslint-disable-next-line camelcase
  static getMaxIndex(tick_spacing: number): number {
    return MAX_TICK_INDEX - (MAX_TICK_INDEX % tick_spacing)
  }
}

/**
 * Get nearest tick by current tick.
 *
 * @param tick_index
 * @param tick_spacing
 * @returns
 */

export function getNearestTickByTick(tick_index: number, tick_spacing: number): number {
  const mod = Math.abs(tick_index) % tick_spacing
  if (tick_index > 0) {
    if (mod > tick_spacing / 2) {
      return tick_index + tick_spacing - mod
    }
    return tick_index - mod
  }
  if (mod > tick_spacing / 2) {
    return tick_index - tick_spacing + mod
  }
  return tick_index + mod
}

/**
 * Get the default sqrt price limit for a swap.
 *
 * @param a2b - true if the swap is A to B, false if the swap is B to A.
 * @returns The default sqrt price limit for the swap.
 */
export function getDefaultSqrtPriceLimit(a2b: boolean): string {
  return a2b ? MIN_SQRT_PRICE : MAX_SQRT_PRICE
}

export function getTickSide(after_tick: number, lower_tick: number, upper_tick: number) {
  if (after_tick >= lower_tick && after_tick <= upper_tick) {
    return 'inRange'
  }
  if (after_tick < lower_tick) {
    return 'left'
  }
  return 'right'
}
