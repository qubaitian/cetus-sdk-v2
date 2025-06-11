import { CetusClmmSDK } from '@cetusprotocol/sui-clmm-sdk'
import { BaseSdkOptions, Package, SdkWrapper } from '@cetusprotocol/common-sdk'
import { farmsMainnet } from './config/mainnet'
import { farmsTestnet } from './config/testnet'
import { FarmsModule } from './modules/farmsModule'
import { FarmsConfigs } from './types/farmsType'

/**
 * Represents options and configurations for an SDK.
 */
export interface SdkOptions extends BaseSdkOptions {
  farms: Package<FarmsConfigs>
}

/**
 * The entry class of CetusFarmsSDK, which is almost responsible for all interactions with farms.
 */
export class CetusFarmsSDK extends SdkWrapper<SdkOptions> {
  protected _farms: FarmsModule

  protected _clmmSDK: CetusClmmSDK

  constructor(options: SdkOptions, clmmSDK?: CetusClmmSDK) {
    super(options)

    this._farms = new FarmsModule(this)
    this._clmmSDK = clmmSDK || CetusClmmSDK.createSDK({ env: options.env, full_rpc_url: options.full_rpc_url })
  }

  setSenderAddress(value: string): void {
    this._clmmSDK.setSenderAddress(value)
  }

  getSenderAddress(validate: boolean = true): string {
    return this._clmmSDK.getSenderAddress(validate)
  }

  updateFullRpcUrl(url: string): void {
    super.updateFullRpcUrl(url)
    this._clmmSDK.updateFullRpcUrl(url)
  }

  get Farms(): FarmsModule {
    return this._farms
  }

  get ClmmSDK(): CetusClmmSDK {
    return this._clmmSDK
  }

  static createSDK(options: BaseSdkOptions, clmm_sdk?: CetusClmmSDK): CetusFarmsSDK {
    const { env = 'mainnet' } = options
    return env === 'mainnet'
      ? CetusFarmsSDK.createCustomSDK({ ...farmsMainnet, ...options }, clmm_sdk)
      : CetusFarmsSDK.createCustomSDK({ ...farmsTestnet, ...options }, clmm_sdk)
  }

  /**
   * Create a custom SDK instance with the given options
   * @param options The options for the SDK
   * @returns An instance of CetusBurnSDK
   */
  static createCustomSDK<T extends BaseSdkOptions>(options: T & SdkOptions, clmm_sdk?: CetusClmmSDK): CetusFarmsSDK {
    return new CetusFarmsSDK(options, clmm_sdk)
  }
}
