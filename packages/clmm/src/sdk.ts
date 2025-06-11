import type { BaseSdkOptions, Package } from '@cetusprotocol/common-sdk'
import { SdkWrapper } from '@cetusprotocol/common-sdk'
import { ConfigModule, RewarderModule, VestModule } from './modules'
import { PoolModule } from './modules/poolModule'
import { PositionModule } from './modules/positionModule'
import { SwapModule } from './modules/swapModule'
import { ClmmConfig } from './types/clmm_type'
import { CetusConfigs } from './types/config_type'
import { clmmMainnet } from './config/mainnet'
import { clmmTestnet } from './config/testnet'
import { VestConfigs } from './types/vest'

/**
 * Represents options and configurations for an SDK.
 */
export interface SdkOptions extends BaseSdkOptions {
  /**
   * Package containing Cetus protocol configurations.
   */
  cetus_config: Package<CetusConfigs>

  /**
   * Package containing Cryptocurrency Liquidity Mining Module (CLMM) pool configurations.
   */
  clmm_pool: Package<ClmmConfig>

  /**
   * Package containing integration-related configurations.
   */
  integrate: Package

  /**
   * The URL for the swap count
   */
  stats_pools_url?: string

  clmm_vest?: Package<VestConfigs>
}

/**
 * The entry class of CetusClmmSDK, which is almost responsible for all interactions with CLMM.
 */
export class CetusClmmSDK extends SdkWrapper<SdkOptions> {
  /**
   * Provide interact with clmm pools with a pool router interface.
   */
  protected _pool: PoolModule

  /**
   * Provide interact  with a position rewarder interface.
   */
  protected _rewarder: RewarderModule

  /**
   * Provide interact with a pool swap router interface.
   */
  protected _swap: SwapModule

  /**
   * Provide interact with clmm position with a position router interface.
   */
  protected _position: PositionModule

  /**
   * Provide  interact with clmm pool and coin and launchpad pool config
   */
  protected _config: ConfigModule

  /**
   * Provide interact with clmm claim
   */
  protected _vest: VestModule

  constructor(options: SdkOptions) {
    super(options)

    this._swap = new SwapModule(this)
    this._pool = new PoolModule(this)
    this._position = new PositionModule(this)
    this._config = new ConfigModule(this)
    this._rewarder = new RewarderModule(this)
    this._vest = new VestModule(this)
  }

  /**
   * Getter for the Pool property.
   * @returns {PoolModule} The Pool property value.
   */
  get Pool(): PoolModule {
    return this._pool
  }

  /**
   * Getter for the Position property.
   * @returns {PositionModule} The Position property value.
   */
  get Position(): PositionModule {
    return this._position
  }

  /**
   * Getter for the CetusConfig property.
   * @returns {ConfigModule} The CetusConfig property value.
   */
  get CetusConfig(): ConfigModule {
    return this._config
  }

  /**
   * Getter for the Rewarder property.
   * @returns {RewarderModule} The Rewarder property value.
   */
  get Rewarder(): RewarderModule {
    return this._rewarder
  }

  /**
   * Getter for the Swap property.
   * @returns {SwapModule} The Swap property value.
   */
  get Swap(): SwapModule {
    return this._swap
  }

  /**
   * Getter for the Vest property.
   * @returns {VestModule} The Vest property value.
   */
  get Vest(): VestModule {
    return this._vest
  }

  static createSDK(options: BaseSdkOptions): CetusClmmSDK {
    const { env = 'mainnet' } = options
    return env === 'mainnet'
      ? CetusClmmSDK.createCustomSDK({ ...clmmMainnet, ...options })
      : CetusClmmSDK.createCustomSDK({ ...clmmTestnet, ...options })
  }

  /**
   * Create a custom SDK instance with the given options
   * @param options The options for the SDK
   * @returns An instance of CetusBurnSDK
   */
  static createCustomSDK<T extends BaseSdkOptions>(options: T & SdkOptions): CetusClmmSDK {
    return new CetusClmmSDK(options)
  }
}
