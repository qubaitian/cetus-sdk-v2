import 'isomorphic-fetch'
import { CetusClmmSDK } from '../src/sdk'
import { fixCoinType, printTransaction } from '@cetusprotocol/common-sdk'
import { buildTestAccount } from '@cetusprotocol/test-utils'

const sdk = CetusClmmSDK.createSDK({ env: 'mainnet' })

describe('vest test', () => {
  beforeEach(async () => {
    console.log('sdk env: ', sdk.sdkOptions.env)
  })

  test('getClmmVestInfoList', async () => {
    const vestInfoList = await sdk.Vest.getClmmVestInfoList()
    console.log('vestInfoList: ', vestInfoList)
  })

  test('getClmmVestInfo', async () => {
    const vestInfo = await sdk.Vest.getClmmVestInfo()
    console.log('vestInfo: ', vestInfo)
  })

  test('getPoolLiquiditySnapshot', async () => {
    const poolSnapshot = [
      {
        pool_id: '0x8903aa21e3a95fdeef8ab06ef29fd4511ce3bd650a1fdd28a455300ddf470062',
        position_ids: ['0x0aeed0bf50737f651fdc78361f0c7cf6898f8d695a82f9e19c24d963ec9ee538'],
      },
    ]

    for (const snapshot of poolSnapshot) {
      const { pool_id, position_ids } = snapshot
      const poolSnapshot = await sdk.Pool.getPoolLiquiditySnapshot(pool_id)
      const { remove_percent, snapshots } = poolSnapshot

      const posSnap = await sdk.Pool.getPositionSnapshot(snapshots.id, position_ids)
      console.log(`Pool ${pool_id} snapshot:`, {
        removePercent: remove_percent,
        posSnap: posSnap,
      })
    }
  })

  test('getPositionVesting', async () => {
    const vestingList = await sdk.Vest.getPositionVesting([
      {
        clmm_position_ids: ['0x1a5f81f11c1e28a7836ec93786c9a5ee33e61d5ad5c5b4ae220ee43f6195c77c'],
        clmm_pool_id: '0x871d8a227114f375170f149f7e9d45be822dd003eba225e83c05ac80828596bc',
        coin_type_a: '0xbde4ba4c2e274a60ce15c1cfff9e5c42e41654ac8b6d906a57efa4bd3c29f47d::hasui::HASUI',
        coin_type_b: '0x2::sui::SUI',
      },
    ])
    console.log('vestingList: ', vestingList)
  })

  test('redeem', async () => {
    const send_key_pair = buildTestAccount()
    sdk.setSenderAddress(send_key_pair.getPublicKey().toSuiAddress())

    const position_id = '0x67ff4a016f0d0984ee5a816426f00853da432bacb071c709627eb3ac12419834'
    const position = await sdk.Position.getPositionById(position_id)
    console.log('position: ', position)
    const pool = await sdk.Pool.getPool(position.pool)
    console.log('pool: ', pool)

    const tx = sdk.Vest.buildRedeemPayload([
      {
        clmm_pool_id: pool.id,
        clmm_position_id: position_id,
        period: 0,
        coin_type_a: pool.coin_type_a,
        coin_type_b: pool.coin_type_b,
      },
    ])

    printTransaction(tx)

    const transferTxn = await sdk.FullClient.executeTx(send_key_pair, tx, false)
    console.log('redeem: ', transferTxn)
  })
})
