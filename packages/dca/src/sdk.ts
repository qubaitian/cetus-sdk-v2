import type { BaseSdkOptions, Package } from '@cetusprotocol/common-sdk'
import { SdkWrapper } from '@cetusprotocol/common-sdk'
import { dcaMainnet, dcaTestnet } from './config'
import { DcaModule } from './modules/dcaModule'
import type { DcaConfigs } from './types/dcaType'

/**
 * Represents options and configurations for an SDK.
 */
export interface SdkOptions extends BaseSdkOptions {
  dca: Package<DcaConfigs>
}

/**
 * The entry class of CetusDcaSDK, which is almost responsible for all interactions with dca.
 */
export class CetusDcaSDK extends SdkWrapper<SdkOptions> {
  protected _dca: DcaModule

  constructor(options: SdkOptions) {
    super(options)
    this._sdkOptions = options

    this._dca = new DcaModule(this)
  }

  get Dca(): DcaModule {
    return this._dca
  }

  /**
   * Static factory method to initialize the SDK
   * @param options SDK initialization options
   * @returns An instance of CetusDcaDK
   */
  static createSDK(options: BaseSdkOptions): CetusDcaSDK {
    const { env = 'mainnet', full_rpc_url } = options
    return env === 'mainnet'
      ? CetusDcaSDK.createCustomSDK({ ...dcaMainnet, ...options })
      : CetusDcaSDK.createCustomSDK({ ...dcaTestnet, ...options })
  }

  /**
   * Create a custom SDK instance with the given options
   * @param options The options for the SDK
   * @returns An instance of CetusBurnSDK
   */
  static createCustomSDK<T extends BaseSdkOptions>(options: T & SdkOptions): CetusDcaSDK {
    return new CetusDcaSDK(options)
  }
}
