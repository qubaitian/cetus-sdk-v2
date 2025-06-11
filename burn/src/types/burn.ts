import type { CoinPairType } from '@cetusprotocol/common-sdk'
import type { TransactionObjectArgument } from '@mysten/sui/transactions'

export type BurnConfigs = {
  manager_id: string
  clmm_global_config: string
  clmm_global_vault_id: string
  burn_pool_handle: string
}

export type BurnPositionNFT = {
  id: string
  url: string
  pool_id: string
  description: string
  name: string
  liquidity: string
  clmm_position_id: string
  clmm_pool_id: string
  tick_lower_index: number
  tick_upper_index: number
  index: number
  is_lp_burn: boolean
} & CoinPairType

type CommonParams = {
  pool_id: string
  pos_id: string | TransactionObjectArgument
} & CoinPairType

export type BurnParams = CommonParams

export type CollectFeeParams = CommonParams & { account: string }

export type CollectRewardParams = CommonParams & {
  rewarder_coin_types: string[]
  account: string
}

export type RedeemVestParams = {
  clmm_versioned_id: string
  clmm_vester_id: string
  clmm_pool_id: string
  burn_position_id: string
  period: number
} & CoinPairType
