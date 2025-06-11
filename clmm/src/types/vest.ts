import { CoinPairType } from '@cetusprotocol/common-sdk'
import { TransactionObjectArgument } from '@mysten/sui/transactions'

export type VestConfigs = {
  versioned_id: string
  clmm_vest_id: string
  cetus_coin_type: string
}

export type GlobalVestingPeriod = {
  period: number
  release_time: string
  redeemed_amount: string
  percentage: string
}

export type ClmmVestInfo = {
  id: string
  balance: string
  global_vesting_periods: GlobalVestingPeriod[]
  total_value: string
  total_cetus_amount: string
  redeemed_amount: string
  start_time: string
  type: string
  positions: {
    id: string
    size: string
  }
}

export type PeriodDetail = {
  period: number
  cetus_amount: string
  is_redeemed: boolean
}

export type PositionVesting = {
  position_id: string
  cetus_amount: string
  redeemed_amount: string
  is_paused: boolean
  impaired_a: string
  impaired_b: string
  period_details: PeriodDetail[]
} & CoinPairType

export type RedeemOption = {
  clmm_pool_id: string
  clmm_position_id: string | TransactionObjectArgument
  period: number
} & CoinPairType

export type GetPositionVestOption = {
  clmm_pool_id: string
  clmm_position_ids: string[]
} & CoinPairType
