import { CoinPairType } from '@cetusprotocol/common-sdk'
import { Position } from '@cetusprotocol/sui-clmm-sdk'

export type VestConfigs = {
  versioned_id: string
  create_event_list: VestCreateEvent[]
}

export type GlobalVestingPeriod = {
  period: number
  release_time: string
  cetus_amount: string
  redeemed_amount: string
}

export type VaultsVestInfo = {
  id: string
  vault_id: string
  index: number
  lp_coin_type: string
  position: VaultsPosition
  balance: string
  total_supply: string
  impaired_a: string
  impaired_b: string
  cetus_amount: string
  redeemed_amount: string
  allocated_lp_amount: string
  start_time: string
  global_vesting_periods: GlobalVestingPeriod[]
  vest_infos: {
    id: string
    size: string
  }
  url: string
} & CoinPairType

export type VaultsPosition = {
  description: string
  id: string
  index: number
  liquidity: string
  name: string
  pool_id: string
  tick_lower_index: number
  tick_upper_index: number
  url: string
} & CoinPairType

export type PeriodInfo = {
  period: number
  cetus_amount: string
  is_redeemed: boolean
}

export type VestCreateEvent = {
  clmm_vester_id: string
  lp_coin_type: string
  pool_id: string
  position_id: string
  vault_id: string
  vault_vester_id: string
}

export type VaultVestNFT = {
  id: string
  index: number
  vault_id: string
  lp_amount: string
  redeemed_amount: string
  impaired_a: string
  impaired_b: string
  period_infos: PeriodInfo[]
  url: string
  name: string
  vester_id: string
}

export type RedeemOption = {
  vault_id: string
  vesting_nft_id: string
  period: number
} & CoinPairType
