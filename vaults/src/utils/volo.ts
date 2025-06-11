import { TransactionArgument, Transaction } from '@mysten/sui/transactions'
import { bcs } from '@mysten/sui/bcs'
import { normalizeSuiAddress, normalizeSuiObjectId } from '@mysten/sui/utils'
import { CetusVaultsSDK } from '../sdk'
import { VaultsUtils } from './vaults'
import { d, DETAILS_KEYS, getPackagerConfigs } from '@cetusprotocol/common-sdk'
import { handleError, handleMessageError, VaultsErrorCode } from '../errors/errors'
export class VoloUtils {
  public static async getExchangeRateForStake(sdk: CetusVaultsSDK, should_request_stake: boolean, swap_amount?: number): Promise<string> {
    const { vaults } = sdk.sdkOptions
    const { volo } = getPackagerConfigs(vaults)
    if (volo === undefined) {
      return handleMessageError(VaultsErrorCode.StakeProtocolNotFound, 'the volo config is undefined', {
        [DETAILS_KEYS.METHOD_NAME]: 'getExchangeRateForStake',
      })
    }
    const { native_pool, vsui_metadata } = getPackagerConfigs(volo)
    try {
      const tx = new Transaction()
      if (should_request_stake) {
        await this.requestStake(sdk, swap_amount || 1000000000, tx)
      } else {
        tx.moveCall({
          target: `${volo.published_at}::native_pool::get_ratio`,
          typeArguments: [],
          arguments: [tx.object(native_pool), tx.object(vsui_metadata)],
        })
      }

      const res: any = await sdk.FullClient.devInspectTransactionBlock({
        transactionBlock: tx,
        sender: sdk.getSenderAddress(false).length > 0 ? sdk.getSenderAddress(false) : normalizeSuiAddress('0x0'),
      })

      if (should_request_stake) {
        const find_item = res.events.find((item: any) => {
          return item.type.includes('StakedEvent')
        })
        const { cert_amount, sui_amount } = find_item.parsedJson
        return d(sui_amount).div(cert_amount).toString()
      }
      const return_values = res.results[0]!.return_values[0][0]
      const rate = d(bcs.u256().parse(Uint8Array.from(return_values)))
        .div('1000000000000000000')
        .toNumber()

      return d(1).div(rate).toString()
    } catch (error) {
      return handleError(VaultsErrorCode.FetchError, error as Error, {
        [DETAILS_KEYS.METHOD_NAME]: 'getExchangeRateForVolo',
      })
    }
    return '0'
  }

  static async requestStake(sdk: CetusVaultsSDK, amount: number, tx?: Transaction) {
    const { vaults } = sdk.sdkOptions

    const { volo } = getPackagerConfigs(vaults)
    if (volo === undefined) {
      return handleMessageError(VaultsErrorCode.StakeProtocolNotFound, 'the volo config is undefined', {
        [DETAILS_KEYS.METHOD_NAME]: 'requestStake',
      })
    }

    tx = tx || new Transaction()
    const { native_pool, vsui_metadata } = getPackagerConfigs(volo)

    const suiCoin = await VaultsUtils.getSuiCoin(sdk, amount, tx)
    // https://github.com/Sui-Volo/volo-liquid-staking-contracts/blob/main/liquid_staking/sources/native_pool.move#L700
    tx.moveCall({
      target: `${volo.published_at}::native_pool::stake`,
      typeArguments: [],
      arguments: [tx.object(native_pool), tx.object(vsui_metadata), tx.object(normalizeSuiObjectId('0x5')), suiCoin],
    })
    return tx
  }

  static requestStakeCoin(sdk: CetusVaultsSDK, tx: Transaction, sui_coin: TransactionArgument) {
    const { vaults } = sdk.sdkOptions
    const { volo } = getPackagerConfigs(vaults)
    if (volo === undefined) {
      return handleMessageError(VaultsErrorCode.StakeProtocolNotFound, 'the volo config is undefined', {
        [DETAILS_KEYS.METHOD_NAME]: 'requestStakeCoin',
      })
    }

    tx = tx || new Transaction()
    const { native_pool, vsui_metadata } = getPackagerConfigs(volo)
    const ha_sui_coin = tx.moveCall({
      target: `${volo.published_at}::native_pool::stake_non_entry`,
      typeArguments: [],
      arguments: [tx.object(native_pool), tx.object(vsui_metadata), tx.object(normalizeSuiObjectId('0x5')), sui_coin],
    })
    return ha_sui_coin
  }
}
