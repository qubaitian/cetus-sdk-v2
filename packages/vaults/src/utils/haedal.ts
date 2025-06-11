import { TransactionArgument, Transaction } from '@mysten/sui/transactions'
import { bcs } from '@mysten/sui/bcs'
import { normalizeSuiAddress, normalizeSuiObjectId } from '@mysten/sui/utils'
import { CetusVaultsSDK } from '../sdk'
import { VaultsUtils } from './vaults'
import { getPackagerConfigs, d, DETAILS_KEYS } from '@cetusprotocol/common-sdk'
import { handleError, handleMessageError, VaultsErrorCode } from '../errors/errors'

export class HaedalUtils {
  public static async getExchangeRateForStake(sdk: CetusVaultsSDK, should_request_stake: boolean, swap_amount?: number): Promise<string> {
    const { vaults } = sdk.sdkOptions
    const { haedal } = getPackagerConfigs(vaults)
    if (haedal === undefined) {
      return handleMessageError(VaultsErrorCode.StakeProtocolNotFound, 'the haedal config is undefined', {
        [DETAILS_KEYS.METHOD_NAME]: 'getExchangeRateForStake',
      })
    }
    const { staking_id } = getPackagerConfigs(haedal)
    try {
      const tx = new Transaction()
      if (should_request_stake) {
        await this.requestStake(sdk, swap_amount || 1000000000, tx)
      } else {
        tx.moveCall({
          target: `${haedal.published_at}::staking::get_exchange_rate`,
          typeArguments: [],
          arguments: [tx.object(staking_id)],
        })
      }

      const res: any = await sdk.FullClient.devInspectTransactionBlock({
        transactionBlock: tx,
        sender: sdk.getSenderAddress(false).length > 0 ? sdk.getSenderAddress(false) : normalizeSuiAddress('0x0'),
      })

      if (should_request_stake) {
        const find_item = res.events.find((item: any) => {
          return item.type.includes('UserStaked')
        })
        const { sui_amount, st_amount } = find_item.parsedJson
        const rate = d(sui_amount).div(st_amount).toString()
        return rate
      }
      const returnValues = res.results[0]!.returnValues[0][0]
      const rate = d(bcs.u64().parse(Uint8Array.from(returnValues))).div(1000000)
      return rate.toString()
    } catch (error) {
      return handleError(VaultsErrorCode.FetchError, error as Error, {
        [DETAILS_KEYS.METHOD_NAME]: 'getExchangeRateForHaedal',
      })
    }
    return '0'
  }

  static async requestStake(sdk: CetusVaultsSDK, amount: number, tx?: Transaction) {
    const { vaults } = sdk.sdkOptions
    tx = tx || new Transaction()

    const suiCoin = await VaultsUtils.getSuiCoin(sdk, amount, tx)

    tx.moveCall({
      target: `${vaults.config?.haedal?.published_at}::interface::request_stake`,
      typeArguments: [],
      arguments: [
        tx.object(normalizeSuiObjectId('0x5')),
        tx.object(vaults.config!.haedal!.config!.staking_id!),
        suiCoin,
        tx.pure.address(normalizeSuiObjectId('0x0')),
      ],
    })
    return tx
  }

  static requestStakeCoin(sdk: CetusVaultsSDK, tx: Transaction, sui_coin: TransactionArgument) {
    const { haedal } = sdk.sdkOptions.vaults.config!
    const ha_sui_coin = tx.moveCall({
      target: `${haedal!.published_at}::staking::request_stake_coin`,
      typeArguments: [],
      arguments: [
        tx.object(normalizeSuiObjectId('0x5')),
        tx.object(haedal!.config!.staking_id),
        sui_coin,
        tx.pure.address(normalizeSuiObjectId('0x0')),
      ],
    })
    return ha_sui_coin
  }
}
