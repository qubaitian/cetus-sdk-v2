import CetusClmmSDK from '@cetusprotocol/sui-clmm-sdk'
import type { SdkOptions } from '../sdk'
import { CetusFarmsSDK } from '../sdk'
import { FullRpcUrlTestnet } from '@cetusprotocol/common-sdk'
export const farmsTestnet: SdkOptions = {
  env: 'testnet',
  full_rpc_url: FullRpcUrlTestnet,
  farms: {
    package_id: '0x4cf0dc5c48e2220038147bb74f78d5a2c37e3d2c7c879cad84a4ed187099749c',
    published_at: '0x4cf0dc5c48e2220038147bb74f78d5a2c37e3d2c7c879cad84a4ed187099749c',
    version: 1,
    config: {
      global_config_id: '0x7d9123225d21bb2ac78f8fe43fdcea02a355643fdf4dbac438c6dfebc95574e3',
      rewarder_manager_id: '0x0632895ea50c474eb7bd414d3f291c76f43cc64f0e602ca7ca7d6e95dff73582',
      rewarder_manager_handle: '0x170f4eba9c57380a52a7934c2bed451c7667a015e32f77c05005af8f4aab8d85',
      admin_cap_id: '0xcbe866e3f123f055ba31ab0fc6440658d4f7ed088cfcb1ab55a8d95f9556da6a',
    },
  },
}
