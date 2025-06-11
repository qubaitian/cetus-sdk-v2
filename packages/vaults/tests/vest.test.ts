import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'
import { printTransaction, toDecimalsAmount } from '@cetusprotocol/common-sdk'
import { buildTestAccount } from '@cetusprotocol/test-utils'
import 'isomorphic-fetch'
import { CetusVaultsSDK } from '../src/sdk'

const vaultId = '0xf449a94a4c1e9621fc0589c6c3a08f5b2a15cd879b237709ff8c925e4a53419e'

describe('vest test', () => {
  const sdk = CetusVaultsSDK.createSDK({ env: 'mainnet' })
  let send_key_pair: Ed25519Keypair

  beforeEach(async () => {
    console.log('sdk env: ', sdk.sdkOptions.env)
    send_key_pair = buildTestAccount()
    sdk.setSenderAddress(send_key_pair.getPublicKey().toSuiAddress())
  })

  test('getVestCreateEventList', async () => {
    const createEventList = await sdk.Vest.getVestCreateEventList()
    console.log('createEventList: ', createEventList)
  })

  test('getVaultsVestInfoList', async () => {
    const vestInfoList = await sdk.Vest.getVaultsVestInfoList([vaultId])
    console.log('vestInfoList: ', vestInfoList)
  })

  test('getVaultVestId', async () => {
    const vestInfo = await sdk.Vest.getVaultsVestInfo(vaultId)
    console.log('vestInfo: ', vestInfo)
  })

  test('getOwnerVaultVestNFT', async () => {
    const vestNFTList = await sdk.Vest.getOwnerVaultVestNFT(sdk.getSenderAddress())
    console.log('vestNFTList: ', vestNFTList)
  })

  test('vestNftIsAvailable', async () => {
    const isAvailable = await sdk.Vest.vestNftIsAvailable(
      '0x13e8b44f2c95dc88f05daf30543a7d2097747bf54fab03b4e8d19fc5d89653f3',
      '0xd0cc4a3b3a37c3db7cc880c9fc70e59315fb01c14a087ad26724a5eaccc46111'
    )
    console.log('isAvailable: ', isAvailable)
  })

  test('buildRedeemPayload', async () => {
    const vestInfo = await sdk.Vest.getVaultsVestInfo(vaultId)
    console.log('vestInfo: ', vestInfo)
    const tx = await sdk.Vest.buildRedeemPayload([
      {
        vault_id: vaultId,
        vesting_nft_id: '0xb8439b160fc43298f7d2fced6caba809f864af96cae28d544b99416645a051be',
        period: 2,
        coin_type_a: vestInfo.coin_type_a,
        coin_type_b: vestInfo.coin_type_b,
      },
    ])

    printTransaction(tx)

    const transferTxn = await sdk.FullClient.executeTx(send_key_pair, tx, true)
    console.log('redeem: ', transferTxn)
  })
})
