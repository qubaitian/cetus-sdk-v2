import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'
import { Pool } from '@cetusprotocol/sui-clmm-sdk'
import { printTransaction, TickMath, toDecimalsAmount } from '@cetusprotocol/common-sdk'
import { buildTestAccount } from '@cetusprotocol/test-utils'
import { CetusZapSDK } from '../src/sdk'
import { BaseDepositOptions, FixedOneSideOptions, FlexibleBothOptions, OnlyCoinAOptions, OnlyCoinBOptions } from '../src/types/zap'
const poolId = '0x871d8a227114f375170f149f7e9d45be822dd003eba225e83c05ac80828596bc'
const farmsPoolId = '0x9f5fd63b2a2fd8f698ff6b7b9720dbb2aa14bedb9fc4fd6411f20e5b531a4b89'

describe('farms deposit test', () => {
  const sdk = CetusZapSDK.createSDK({ env: 'mainnet' })
  let send_key_pair: Ed25519Keypair
  let address: string
  let pool: Pool

  beforeAll(async () => {
    send_key_pair = buildTestAccount()
    address = send_key_pair.getPublicKey().toSuiAddress()
    sdk.setSenderAddress(address)

    pool = await sdk.ClmmSDK.Pool.getPool(poolId)

    console.log('🚀 ~ describe ~ pool:', pool)

    if (pool === undefined) {
      throw new Error('Pool not found')
    }
  })

  test('Mode: FixedOneSide fixed_coin_a', async () => {
    const { current_sqrt_price, current_tick_index, tick_spacing, coin_type_a, coin_type_b } = pool!
    const tick_lower = TickMath.getInitializeTickIndex(current_tick_index - 2000, Number(tick_spacing))
    const tick_upper = TickMath.getInitializeTickIndex(current_tick_index + 2000, Number(tick_spacing))
    const slippage = 0.01

    const options: BaseDepositOptions = {
      pool_id: poolId,
      tick_lower,
      tick_upper,
      current_sqrt_price: current_sqrt_price.toString(),
      slippage,
    }

    const modeOptions: FixedOneSideOptions = {
      mode: 'FixedOneSide',
      fixed_amount: toDecimalsAmount(1, 9).toString(),
      fixed_coin_a: true,
    }

    const result = await sdk.Zap.preCalculateDepositAmount(options, modeOptions)

    console.log('🚀 ~ test ~ result:', result)

    const tx = await sdk.Zap.buildDepositPayload({
      deposit_obj: result,
      pool_id: poolId,
      farms_pool_id: farmsPoolId,
      coin_type_a,
      coin_type_b,
      tick_lower,
      tick_upper,
      slippage,
    })

    printTransaction(tx)

    let isSimulation = true
    if (isSimulation) {
      const res = await sdk.FullClient.sendSimulationTransaction(tx, address)
      console.log('Deposit Transaction Simulation Result:', res?.effects?.status?.status === 'success' ? res?.events : res)
    } else {
      const res = await sdk.FullClient.sendTransaction(send_key_pair, tx)
      console.log('Deposit Transaction Simulation Result:', res?.events)
    }
  })

  test('pos Mode: FixedOneSide fixed_coin_a', async () => {
    const pos = await sdk.FarmsSDK.Farms.getFarmsPositionNFT('0xf64f3fbc5e465b7abec2f4e5b03ecc4be99d88db16e03f63d38c8ceec6303e74')
    console.log('🚀 ~ test ~ pos:', pos)

    const { current_sqrt_price, current_tick_index, coin_type_a, coin_type_b } = pool!
    const tick_lower = pos!.tick_lower_index
    const tick_upper = pos!.tick_upper_index
    const slippage = 0.01

    const options: BaseDepositOptions = {
      pool_id: poolId,
      tick_lower,
      tick_upper,
      current_sqrt_price: current_sqrt_price.toString(),
      slippage,
    }

    const modeOptions: FixedOneSideOptions = {
      mode: 'FixedOneSide',
      fixed_amount: toDecimalsAmount(1, 9).toString(),
      fixed_coin_a: true,
    }

    const result = await sdk.Zap.preCalculateDepositAmount(options, modeOptions)

    console.log('🚀 ~ test ~ result:', result)

    const tx = await sdk.Zap.buildDepositPayload({
      deposit_obj: result,
      pool_id: poolId,
      farms_pool_id: farmsPoolId,
      coin_type_a,
      coin_type_b,
      tick_lower,
      tick_upper,
      slippage,
    })

    printTransaction(tx)

    let isSimulation = true
    if (isSimulation) {
      const res = await sdk.FullClient.sendSimulationTransaction(tx, address)
      console.log('Deposit Transaction Simulation Result:', res?.effects?.status?.status === 'success' ? res?.events : res)
    } else {
      const res = await sdk.FullClient.sendTransaction(send_key_pair, tx)
      console.log('Deposit Transaction Simulation Result:', res?.events)
    }
  })

  test('Mode: FlexibleBoth ', async () => {
    const { current_sqrt_price, current_tick_index, tick_spacing, coin_type_a, coin_type_b } = pool!
    const tick_lower = TickMath.getInitializeTickIndex(current_tick_index - 2000, Number(tick_spacing))
    const tick_upper = TickMath.getInitializeTickIndex(current_tick_index + 2000, Number(tick_spacing))
    const slippage = 0.01

    const options: BaseDepositOptions = {
      pool_id: poolId,
      tick_lower,
      tick_upper,
      current_sqrt_price: current_sqrt_price.toString(),
      slippage,
    }

    const modeOptions: FlexibleBothOptions = {
      mode: 'FlexibleBoth',
      coin_amount_a: toDecimalsAmount(0.1, 6).toString(),
      coin_amount_b: toDecimalsAmount(1, 9).toString(),
      coin_type_a,
      coin_type_b,
      coin_decimal_a: 9,
      coin_decimal_b: 9,
    }

    const result = await sdk.Zap.preCalculateDepositAmount(options, modeOptions)

    console.log('🚀 ~ test ~ result:', result)

    const tx = await sdk.Zap.buildDepositPayload({
      deposit_obj: result,
      pool_id: poolId,
      coin_type_a,
      coin_type_b,
      tick_lower,
      tick_upper,
      slippage,
    })

    printTransaction(tx)

    let isSimulation = true
    if (isSimulation) {
      const res = await sdk.FullClient.sendSimulationTransaction(tx, address)
      console.log('Deposit Transaction Simulation Result:', res?.effects?.status?.status === 'success' ? res?.events : res)
    } else {
      const res = await sdk.FullClient.sendTransaction(send_key_pair, tx)
      console.log('Deposit Transaction Simulation Result:', res?.events)
    }
  })

  test('Mode: OnlyCoinA ', async () => {
    const { current_sqrt_price, current_tick_index, tick_spacing, coin_type_a, coin_type_b } = pool!

    const pos: any = undefined //ß await sdk.CetusClmmSDK.Position.getPositionById(posId)

    const tick_lower = TickMath.getInitializeTickIndex(current_tick_index - 2000, Number(tick_spacing))
    const tick_upper = TickMath.getInitializeTickIndex(current_tick_index + 2000, Number(tick_spacing))

    const slippage = 0.005

    const options: BaseDepositOptions = {
      pool_id: poolId,
      tick_lower,
      tick_upper,
      current_sqrt_price: current_sqrt_price.toString(),
      slippage,
    }

    const modeOptions: OnlyCoinAOptions = {
      mode: 'OnlyCoinA',
      coin_amount: toDecimalsAmount(1, 6).toString(),
      coin_type_a,
      coin_type_b,
      coin_decimal_a: 9,
      coin_decimal_b: 9,
    }

    const result = await sdk.Zap.preCalculateDepositAmount(options, modeOptions)

    console.log('🚀 ~ test ~ result:', result)

    const tx = await sdk.Zap.buildDepositPayload({
      deposit_obj: result,
      pool_id: poolId,
      farms_pool_id: farmsPoolId,
      coin_type_a,
      coin_type_b,
      tick_lower,
      tick_upper,
      slippage,
    })

    printTransaction(tx)

    let isSimulation = true
    if (isSimulation) {
      const res = await sdk.FullClient.sendSimulationTransaction(tx, address)
      console.log('Deposit Transaction Simulation Result:', res?.effects?.status?.status === 'success' ? res?.events : res)
    } else {
      const res = await sdk.FullClient.sendTransaction(send_key_pair, tx)
      console.log('Deposit Transaction Simulation Result:', res?.events)
    }
  })

  test('pos Mode: OnlyCoinA ', async () => {
    const pos = await sdk.FarmsSDK.Farms.getFarmsPositionNFT('0xf64f3fbc5e465b7abec2f4e5b03ecc4be99d88db16e03f63d38c8ceec6303e74')
    const { current_sqrt_price, current_tick_index, coin_type_a, coin_type_b } = pool!

    const tick_lower = pos!.tick_lower_index
    const tick_upper = pos!.tick_upper_index

    const slippage = 0.05

    const options: BaseDepositOptions = {
      pool_id: poolId,
      tick_lower,
      tick_upper,
      current_sqrt_price: current_sqrt_price.toString(),
      slippage,
    }

    const modeOptions: OnlyCoinAOptions = {
      mode: 'OnlyCoinA',
      coin_amount: toDecimalsAmount(1, 9).toString(),
      coin_type_a,
      coin_type_b,
      coin_decimal_a: 9,
      coin_decimal_b: 9,
    }

    const result = await sdk.Zap.preCalculateDepositAmount(options, modeOptions)

    console.log('🚀 ~ test ~ result:', result)

    const tx = await sdk.Zap.buildDepositPayload({
      deposit_obj: result,
      pool_id: poolId,
      farms_pool_id: farmsPoolId,
      coin_type_a,
      coin_type_b,
      tick_lower,
      tick_upper,
      slippage,
    })

    printTransaction(tx)

    let isSimulation = false
    if (isSimulation) {
      const res = await sdk.FullClient.sendSimulationTransaction(tx, address)
      console.log('Deposit Transaction Simulation Result:', res?.effects?.status?.status === 'success' ? res?.events : res)
    } else {
      const res = await sdk.FullClient.sendTransaction(send_key_pair, tx)
      console.log('Deposit Transaction Simulation Result:', res?.events)
    }
  })

  test('Mode: OnlyCoinB ', async () => {
    const { current_sqrt_price, current_tick_index, tick_spacing, coin_type_a, coin_type_b } = pool!
    const pos: any = undefined //await sdk.CetusClmmSDK.Position.getPositionById(posId)

    const tick_lower = TickMath.getInitializeTickIndex(current_tick_index - 2000, Number(tick_spacing))
    const tick_upper = TickMath.getInitializeTickIndex(current_tick_index + 2000, Number(tick_spacing))
    const slippage = 0.01

    const options: BaseDepositOptions = {
      pool_id: poolId,
      tick_lower,
      tick_upper,
      current_sqrt_price: current_sqrt_price.toString(),
      slippage,
    }

    const modeOptions: OnlyCoinBOptions = {
      mode: 'OnlyCoinB',
      coin_amount: toDecimalsAmount(1, 9).toString(),
      coin_type_a,
      coin_type_b,
      coin_decimal_a: 9,
      coin_decimal_b: 9,
    }

    const result = await sdk.Zap.preCalculateDepositAmount(options, modeOptions)

    console.log('🚀 ~ test ~ result:', result)

    const tx = await sdk.Zap.buildDepositPayload({
      deposit_obj: result,
      pool_id: poolId,
      farms_pool_id: farmsPoolId,
      coin_type_a,
      coin_type_b,
      tick_lower,
      tick_upper,
      slippage,
    })

    // printTransaction(tx)

    let isSimulation = true
    if (isSimulation) {
      const res = await sdk.FullClient.sendSimulationTransaction(tx, address)
      console.log('Deposit Transaction Simulation Result:', res?.effects?.status?.status === 'success' ? res?.events : res)
    } else {
      const res = await sdk.FullClient.sendTransaction(send_key_pair, tx)
      console.log('Deposit Transaction Simulation Result:', res?.events)
    }
  })

  test('pos Mode: OnlyCoinB ', async () => {
    const pos = await sdk.FarmsSDK.Farms.getFarmsPositionNFT('0xf64f3fbc5e465b7abec2f4e5b03ecc4be99d88db16e03f63d38c8ceec6303e74')
    const { current_sqrt_price, current_tick_index, coin_type_a, coin_type_b } = pool!

    const tick_lower = pos!.tick_lower_index
    const tick_upper = pos!.tick_upper_index

    const slippage = 0.05

    const options: BaseDepositOptions = {
      pool_id: poolId,
      tick_lower,
      tick_upper,
      current_sqrt_price: current_sqrt_price.toString(),
      slippage,
    }

    const modeOptions: OnlyCoinBOptions = {
      mode: 'OnlyCoinB',
      coin_amount: toDecimalsAmount(1, 9).toString(),
      coin_type_a,
      coin_type_b,
      coin_decimal_a: 9,
      coin_decimal_b: 9,
    }

    const result = await sdk.Zap.preCalculateDepositAmount(options, modeOptions)

    console.log('🚀 ~ test ~ result:', result)

    const tx = await sdk.Zap.buildDepositPayload({
      deposit_obj: result,
      pool_id: poolId,
      farms_pool_id: farmsPoolId,
      coin_type_a,
      coin_type_b,
      tick_lower,
      tick_upper,
      slippage,
      pos_obj: {
        pos_id: pos!.id,
        collect_fee: true,
        collect_rewarder_types: pool!.rewarder_infos.map((info) => info.coin_type),
      },
    })

    printTransaction(tx)

    let isSimulation = true
    if (isSimulation) {
      const res = await sdk.FullClient.sendSimulationTransaction(tx, address)
      console.log('Deposit Transaction Simulation Result:', res?.effects?.status?.status === 'success' ? res?.events : res)
    } else {
      const res = await sdk.FullClient.sendTransaction(send_key_pair, tx)
      console.log('Deposit Transaction Simulation Result:', res?.events)
    }
  })
})
