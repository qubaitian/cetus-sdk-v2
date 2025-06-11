import type { SuiAddressType, SuiObjectIdType } from '@cetusprotocol/common-sdk'

export type DcaConfigs = {
  admin_cap_id: string
  global_config_id: string
  indexer_id: string
  user_indexer_id: string
  in_coin_whitelist_id: string
  out_coin_whitelist_id: string
}

export type DcaOrderEvent = {
  order_id: SuiObjectIdType
  in_coin: string
  out_coin: string
  in_deposited: number
  cycle_count: number
  cycle_frequency: number
  per_cycle_in_amount_limit: number
  per_cycle_min_out_amount: number
  per_cycle_max_out_amount: number
  created_at: number
}

export type OpenDcaOrderParams = {
  in_coin_type: string
  out_coin_type: string
  in_coin_amount: string
  cycle_frequency: number
  cycle_count: number
  per_cycle_min_out_amount: string
  per_cycle_max_out_amount: string
  per_cycle_in_amount_limit: string
  timestamp: number
  signature: string
  fee_rate: number
}

export type DcaOrder = {
  // Timestamp, string type
  created_at: string
  // Loop frequency, string type
  cycle_frequency: string
  // Unique identifier, string type
  id: string
  // Input amount per cycle, string type
  in_amount_per_cycle: string
  // Input balance, string type
  in_balance: string
  // Deposited amount, string type
  in_deposited: string
  // Withdrawn amount, string type
  in_withdrawn: string
  // Remaining amount for the next cycle, string type
  next_cycle_amount_left: string
  // Timestamp for the next cycle, string type
  next_cycle_at: string
  // Output balance, string type
  out_balance: string
  // Withdrawn output amount, string type
  out_withdrawn: string
  // Maximum output amount per cycle, string type
  per_cycle_max_out_amount: string
  // Minimum output amount per cycle, string type
  per_cycle_min_out_amount: string
  user: string
  in_coin_type: string
  out_coin_type: string
  amount_left_next_cycle: string
  fee_rate: string
  max_out_amount_per_cycle: string
  min_out_amount_per_cycle: string
  status: string
  version: string
}

export type CloseDcaOrderParams = {
  order_id: string
  in_coin_type: SuiAddressType
  out_coin_type: SuiAddressType
}

export type WithdrawDcaParams = {
  in_coin_type: SuiAddressType
  out_coin_type: SuiAddressType
  order_id: string
}

export type DcaOrderTx = {
  digest: ''
}

export type DcaCoinWhiteList = {
  in_coin_list: SuiAddressType[]
  out_coin_list: SuiAddressType[]
}
