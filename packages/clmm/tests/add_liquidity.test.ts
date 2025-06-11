import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'
import BN from 'bn.js'
import { adjustForCoinSlippage, ClmmPoolUtil, Percentage, printTransaction, TickMath } from '@cetusprotocol/common-sdk'
import { buildTestAccount } from '@cetusprotocol/test-utils'
import 'isomorphic-fetch'
import CetusClmmSDK, { AddLiquidityParams, CustomRangeParams, FullRangeParams } from '../src'

let send_key_pair: Ed25519Keypair

const poolId = '0xb8d7d9e66a60c239e7a60110efcf8de6c705580ed924d0dde141f4a0e2c90105'
const position_nft_id = '0xcf995f40b0f9c40a8b03e0b9d9554fea2bc12a18fe63db3a04c59c46be5c10be'
describe('add Liquidity Module', () => {
  const sdk = CetusClmmSDK.createSDK({ env: 'mainnet' })

  beforeEach(async () => {
    send_key_pair = buildTestAccount()
    sdk.setSenderAddress(send_key_pair.getPublicKey().toSuiAddress())
  })

  test('custom tick range add liquidity for input liquidity', async () => {
    const pool = await sdk.Pool.getPool(poolId)
    const position = await sdk.Position.getPositionById(position_nft_id)
    const cur_sqrt_price = new BN(pool.current_sqrt_price)
    const lower_tick = Number(position.tick_lower_index)
    const upper_tick = Number(position.tick_upper_index)

    const lower_sqrt_price = TickMath.tickIndexToSqrtPriceX64(lower_tick)
    const upper_sqrt_price = TickMath.tickIndexToSqrtPriceX64(upper_tick)

    const slippage_tolerance = new Percentage(new BN(5), new BN(100))
    const liquidity = 10000

    const coin_amounts = ClmmPoolUtil.getCoinAmountFromLiquidity(
      new BN(liquidity),
      cur_sqrt_price,
      lower_sqrt_price,
      upper_sqrt_price,
      false
    )

    const { coin_amount_limit_a, coin_amount_limit_b } = adjustForCoinSlippage(coin_amounts, slippage_tolerance, true)

    const add_liquidity_payload_params: AddLiquidityParams = {
      coin_type_a: pool.coin_type_a,
      coin_type_b: pool.coin_type_b,
      pool_id: pool.id,
      tick_lower: lower_tick.toString(),
      tick_upper: upper_tick.toString(),
      delta_liquidity: liquidity.toString(),
      max_amount_a: coin_amount_limit_a.toString(),
      max_amount_b: coin_amount_limit_b.toString(),
      pos_id: position.pos_object_id,
      rewarder_coin_types: [],
      collect_fee: false,
    }

    const payload = await sdk.Position.createAddLiquidityPayload(add_liquidity_payload_params)

    printTransaction(payload)

    const transfer_txn = await sdk.FullClient.executeTx(send_key_pair, payload, true)
    console.log('createAddLiquidityPayload: ', transfer_txn)
  })

  test('custom price range add liquidity for input liquidity ', async () => {
    const params: CustomRangeParams = {
      is_full_range: false,
      min_price: '0.2',
      max_price: '0.7',
      coin_decimals_a: 6,
      coin_decimals_b: 9,
      price_base_coin: 'coin_a',
    }

    const result = await sdk.Position.calculateAddLiquidityResultWithPrice({
      add_mode_params: params,
      pool_id: poolId,
      liquidity: '10000',
      slippage: 0.01,
    })

    console.log('result: ', result)

    const payload = await sdk.Position.addLiquidityWithPricePayload({
      pool_id: poolId,
      calculate_result: result,
      add_mode_params: params,
    })

    printTransaction(payload)

    const transfer_txn = await sdk.FullClient.executeTx(send_key_pair, payload, true)
    console.log('createAddLiquidityPayload: ', transfer_txn)
  })

  test('full range price range add liquidity for input liquidity ', async () => {
    const params: FullRangeParams = {
      is_full_range: true,
    }

    const result = await sdk.Position.calculateAddLiquidityResultWithPrice({
      add_mode_params: params,
      pool_id: poolId,
      liquidity: '1000000',
      slippage: 0.01,
    })

    console.log('result: ', result)

    const payload = await sdk.Position.addLiquidityWithPricePayload({
      pool_id: poolId,
      calculate_result: result,
      add_mode_params: params,
    })

    printTransaction(payload)

    const transfer_txn = await sdk.FullClient.executeTx(send_key_pair, payload, false)
    console.log('createAddLiquidityPayload: ', transfer_txn)
  })
})
