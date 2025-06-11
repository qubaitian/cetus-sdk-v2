import { BaseSdkOptions, Package, SdkWrapper } from '@cetusprotocol/common-sdk'
import { limitMainnet, limitTestnet } from './config'
import { LimitOrderModule } from './modules/LimitOrderModule'
import { LimitOrderConfig } from './types/limitOrder'

/**
 * Represents options and configurations for an SDK.
 */
export interface SdkOptions extends BaseSdkOptions {
  limit_order: Package<LimitOrderConfig>
}

/**
 * The entry class of CetusLimitSDK, which is almost responsible for all interactions with limit order.
 */
export class CetusLimitOrderSDK extends SdkWrapper<SdkOptions> {
  protected _limitOrder: LimitOrderModule

  constructor(options: SdkOptions) {
    super(options)
    this._sdkOptions = options

    this._limitOrder = new LimitOrderModule(this)
  }

  get LimitOrder(): LimitOrderModule {
    return this._limitOrder
  }

  /**
   * Static factory method to initialize the SDK
   * @param options SDK initialization options
   * @returns An instance of CetusLimitOrderSDK
   */
  static createSDK(options: BaseSdkOptions): CetusLimitOrderSDK {
    const { env = 'mainnet', full_rpc_url } = options
    return env === 'mainnet'
      ? CetusLimitOrderSDK.createCustomSDK({ ...limitMainnet, ...options })
      : CetusLimitOrderSDK.createCustomSDK({ ...limitTestnet, ...options })
  }

  /**
   * Create a custom SDK instance with the given options
   * @param options The options for the SDK
   * @returns An instance of CetusBurnSDK
   */
  static createCustomSDK<T extends BaseSdkOptions>(options: T & SdkOptions): CetusLimitOrderSDK {
    return new CetusLimitOrderSDK(options)
  }
}
