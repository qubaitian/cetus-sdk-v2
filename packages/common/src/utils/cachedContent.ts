import type { SuiResource } from '../type/sui'

export const CACHE_TIME_5MIN = 5 * 60 * 1000
export const CACHE_TIME_24H = 24 * 60 * 60 * 1000

export function getFutureTime(interval: number) {
  return Date.parse(new Date().toString()) + interval
}

/**
 * Defines the structure of a CachedContent object, used for caching resources in memory.
 */
export class CachedContent {
  overdue_time: number
  value: SuiResource | null

  constructor(value: SuiResource | null, overdue_time = 0) {
    this.overdue_time = overdue_time
    this.value = value
  }

  isValid(): boolean {
    if (this.value === null) {
      return false
    }
    if (this.overdue_time === 0) {
      return true
    }
    if (Date.parse(new Date().toString()) > this.overdue_time) {
      return false
    }
    return true
  }
}
