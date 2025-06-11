import { d, DETAILS_KEYS, getPackagerConfigs } from '@cetusprotocol/common-sdk'
import { bcs } from '@mysten/sui/bcs'
import { Transaction, TransactionArgument } from '@mysten/sui/transactions'
import { normalizeSuiAddress, normalizeSuiObjectId } from '@mysten/sui/utils'
import { CetusVaultsSDK } from '../sdk'
import { VaultsUtils } from './vaults'
import { handleError, handleMessageError, VaultsErrorCode } from '../errors/errors'

export class AftermathUtils {
  public static async getExchangeRateForStake(sdk: CetusVaultsSDK, should_request_stake: boolean, swap_amount?: number): Promise<string> {
    const { vaults } = sdk.sdkOptions
    const { aftermath } = getPackagerConfigs(vaults)
    if (aftermath === undefined) {
      return handleMessageError(VaultsErrorCode.StakeProtocolNotFound, 'the aftermath config is undefined', {
        [DETAILS_KEYS.METHOD_NAME]: 'getExchangeRateForStake',
      })
    }
    const { staked_sui_vault, safe } = getPackagerConfigs(aftermath)
    try {
      const tx = new Transaction()
      if (should_request_stake) {
        await this.requestStake(sdk, swap_amount || 1000000000, tx)
      } else {
        tx.moveCall({
          target: `${aftermath.published_at}::staked_sui_vault::afsui_to_sui_exchange_rate`,
          typeArguments: [],
          arguments: [tx.object(staked_sui_vault), tx.object(safe)],
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
        const { afsui_amount, sui_amount } = find_item.parsedJson
        return d(sui_amount).div(afsui_amount).toString()
      }

      const return_values = res.results[0]!.return_values[0][0]
      const rate = d(bcs.u128().parse(Uint8Array.from(return_values))).div(1000000000000000000)

      return rate.toString()
    } catch (error) {
      return handleError(VaultsErrorCode.FetchError, error as Error, {
        [DETAILS_KEYS.METHOD_NAME]: 'getExchangeRateForStake',
      })
    }
    return '0'
  }

  static async requestStake(sdk: CetusVaultsSDK, amount: number, tx?: Transaction) {
    const { vaults } = sdk.sdkOptions

    const { aftermath } = getPackagerConfigs(vaults)
    if (aftermath === undefined) {
      return handleMessageError(VaultsErrorCode.StakeProtocolNotFound, 'the aftermath config is undefined', {
        [DETAILS_KEYS.METHOD_NAME]: 'requestStake',
      })
    }

    tx = tx || new Transaction()
    const { staked_sui_vault, referral_vault, safe, validator_address } = getPackagerConfigs(aftermath)

    const suiCoin = await VaultsUtils.getSuiCoin(sdk, amount, tx)
    // https://github.com/AftermathFinance/move-interfaces/blob/main/packages/afsui/afsui-staked-sui-vault/sources/staked_sui_vault.move

    tx.moveCall({
      target: `${aftermath.published_at}::staked_sui_vault::request_stake_and_keep`,
      typeArguments: [],
      arguments: [
        tx.object(staked_sui_vault),
        tx.object(safe),
        tx.object(normalizeSuiObjectId('0x5')),
        tx.object(referral_vault),
        suiCoin,
        tx.pure.address(normalizeSuiObjectId(validator_address)),
      ],
    })
    return tx
  }

  static requestStakeCoin(sdk: CetusVaultsSDK, tx: Transaction, sui_coin: TransactionArgument) {
    const { vaults } = sdk.sdkOptions
    const { aftermath } = getPackagerConfigs(vaults)
    if (aftermath === undefined) {
      return handleMessageError(VaultsErrorCode.StakeProtocolNotFound, 'the aftermath config is undefined', {
        [DETAILS_KEYS.METHOD_NAME]: 'requestStakeCoin',
      })
    }

    tx = tx || new Transaction()
    const { staked_sui_vault, referral_vault, safe, validator_address } = getPackagerConfigs(aftermath)
    const ha_sui_coin = tx.moveCall({
      target: `${aftermath.published_at}::staked_sui_vault::request_stake`,
      typeArguments: [],
      arguments: [
        tx.object(staked_sui_vault),
        tx.object(safe),
        tx.object(normalizeSuiObjectId('0x5')),
        tx.object(referral_vault),
        sui_coin,
        tx.pure.address(normalizeSuiObjectId(validator_address)),
      ],
    })
    return ha_sui_coin
  }
}
