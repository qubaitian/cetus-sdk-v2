import type { BaseSdkOptions, Package } from '@cetusprotocol/common-sdk'
import { SdkWrapper } from '@cetusprotocol/common-sdk'
import { burnMainnet, burnTestnet } from './config'
import { BurnModule } from './modules/burnModule'
import type { BurnConfigs } from './types/burn'

/**
 * Represents options and configurations for an SDK.
 */
export interface SdkOptions extends BaseSdkOptions {
  burn: Package<BurnConfigs>
}

/**
 * The entry class of CetusDcaSDK, which is almost responsible for all interactions with dca.
 */
export class CetusBurnSDK extends SdkWrapper<SdkOptions> {
  protected _burn: BurnModule

  constructor(options: SdkOptions) {
    super(options)

    this._burn = new BurnModule(this)
  }

  get Burn(): BurnModule {
    return this._burn
  }

  /**
   * Static factory method to initialize the SDK
   * @param options SDK initialization options
   * @returns An instance of CetusBurnDK
   */
  static createSDK(options: BaseSdkOptions): CetusBurnSDK {
    const { env = 'mainnet' } = options
    return env === 'mainnet'
      ? CetusBurnSDK.createCustomSDK({ ...burnMainnet, ...options })
      : CetusBurnSDK.createCustomSDK({ ...burnTestnet, ...options })
  }

  /**
   * Create a custom SDK instance with the given options
   * @param options The options for the SDK
   * @returns An instance of CetusBurnSDK
   */
  static createCustomSDK<T extends BaseSdkOptions>(options: T & SdkOptions): CetusBurnSDK {
    return new CetusBurnSDK(options)
  }
}
