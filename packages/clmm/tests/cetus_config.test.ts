import 'isomorphic-fetch'
import { CetusClmmSDK } from '../src/sdk'

describe('Config Module', () => {
  // const sdk = CetusClmmSDK.createSDK({ env: 'mainnet' })
  const sdk = CetusClmmSDK.createSDK({ env: 'testnet' })

  test('getTokenListByCoinTypes', async () => {
    const tokenMap = await sdk.CetusConfig.getTokenListByCoinTypes(['0x2::sui::SUI'])
    console.log('tokenMap: ', tokenMap)
  })

  test('getCoinConfigs', async () => {
    const coin_list = await sdk.CetusConfig.getCoinConfigs(true)
    console.log('coin_list: ', coin_list)
  })

  test('getClmmPoolConfigs', async () => {
    const pool_list = await sdk.CetusConfig.getClmmPoolConfigs()
    console.log('pool_list: ', pool_list)
  })

  test('getLaunchpadPoolConfigs', async () => {
    const pool_list = await sdk.CetusConfig.getLaunchpadPoolConfigs()
    console.log('pool_list: ', pool_list)
  })

  test('getCetusConfig', async() => {
    const config = await sdk.CetusConfig.getCetusConfig()
    console.log("🚀 ~ test ~ config:", config)
  })
})
