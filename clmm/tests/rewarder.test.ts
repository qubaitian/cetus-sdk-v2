import { buildTestAccount } from '@cetusprotocol/test-utils'
import 'isomorphic-fetch'
import CetusClmmSDK, { CollectRewarderParams } from '../src'

const poolId = '0x9c78366d4f3f40aed29dc7fdd95fc4f5704891149551d1a921c02c7f2cd6ea98'
const position_nft_id = '0xb3e14848e82ecd1ce633fb6c630b249713af81c1f634afef9033d8f09300f850'
describe('Rewarder Module', () => {
  const sdk = CetusClmmSDK.createSDK({ env: 'testnet' })

  test('emissionsEveryDay', async () => {
    const emissionsEveryDay = await sdk.Rewarder.emissionsEveryDay(poolId)
    console.log(emissionsEveryDay)
  })

  test('posRewardersAmount', async () => {
    const pool = await sdk.Pool.getPool('0xdd83e7fbee4f22b28c212d108379435f299dcc47cd0e4cd196cecb6a78e439d1')
    console.log('pool', pool)

    const rewardCoinTypes = pool.rewarder_infos.map((rewarder) => rewarder.coin_type)

    const res = await sdk.Rewarder.fetchPosRewardersAmount([
      {
        coin_type_a: pool?.coin_type_a,
        coin_type_b: pool?.coin_type_b,
        rewarder_types: rewardCoinTypes,
        pool_id: pool.id,
        position_id: '0x38aac2f6ba33c600c65831bb1b94c78e3939ac2ef669b57579f048aa6f15200b',
      },
    ])
    console.log('posRewardersAmount-res：', res[0])
  })

  test('batchFetchPositionRewarders', async () => {
    const res = await sdk.Rewarder.batchFetchPositionRewarders([position_nft_id])
    console.log('batchFetchPositionRewarders-res：', res)
  })

  test('collectPoolRewarderTransactionPayload', async () => {
    const send_key_pair = buildTestAccount()
    sdk.setSenderAddress(send_key_pair.getPublicKey().toSuiAddress())

    const pool = await sdk.Pool.getPool(poolId)

    const rewardCoinTypes = pool.rewarder_infos.map((rewarder) => rewarder.coin_type)

    const collectRewarderParams: CollectRewarderParams = {
      pool_id: pool.id,
      pos_id: position_nft_id,
      rewarder_coin_types: [...rewardCoinTypes],
      coin_type_a: pool.coin_type_a,
      coin_type_b: pool.coin_type_b,
      collect_fee: true,
    }

    const collectRewarderPayload = await sdk.Rewarder.collectRewarderPayload(collectRewarderParams)

    const transferTxn = await sdk.FullClient.executeTx(send_key_pair, collectRewarderPayload, true)
    console.log('collectRewarderPayload: ', JSON.stringify(transferTxn, null, 2))
  })
})
