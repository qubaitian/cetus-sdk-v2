import { FullRpcUrlMainnet } from '@cetusprotocol/common-sdk'
import { CetusClmmSDK, SdkOptions } from '../sdk'
const SDKConfig = {
  clmmConfig: {
    pools_id: '0xf699e7f2276f5c9a75944b37a0c5b5d9ddfd2471bf6242483b03ab2887d198d0',
    global_config_id: '0xdaa46292632c3c4d8f31f23ea0f9b36a28ff3677e9684980e4438403a67a3d8f',
    global_vault_id: '0xce7bceef26d3ad1f6d9b6f13a953f053e6ed3ca77907516481ce99ae8e588f2b',
    admin_cap_id: '0x89c1a321291d15ddae5a086c9abc533dff697fde3d89e0ca836c41af73e36a75',
  },
  cetusConfig: {
    coin_list_id: '0x8cbc11d9e10140db3d230f50b4d30e9b721201c0083615441707ffec1ef77b23',
    launchpad_pools_id: '0x1098fac992eab3a0ab7acf15bb654fc1cf29b5a6142c4ef1058e6c408dd15115',
    clmm_pools_id: '0x15b6a27dd9ae03eb455aba03b39e29aad74abd3757b8e18c0755651b2ae5b71e',
    admin_cap_id: '0x39d78781750e193ce35c45ff32c6c0c3f2941fa3ddaf8595c90c555589ddb113',
    global_config_id: '0x0408fa4e4a4c03cc0de8f23d0c2bbfe8913d178713c9a271ed4080973fe42d8f',
    coin_list_handle: '0x49136005e90e28c4695419ed4194cc240603f1ea8eb84e62275eaff088a71063',
    launchpad_pools_handle: '0x5e194a8efcf653830daf85a85b52e3ae8f65dc39481d54b2382acda25068375c',
    clmm_pools_handle: '0x37f60eb2d9d227949b95da8fea810db3c32d1e1fa8ed87434fc51664f87d83cb',
  },
}

// mainnet
export const clmmMainnet: SdkOptions = {
  env: 'mainnet',
  full_rpc_url: FullRpcUrlMainnet,
  cetus_config: {
    package_id: '0x95b8d278b876cae22206131fb9724f701c9444515813042f54f0a426c9a3bc2f',
    published_at: '0xba7e740c3c002673dbe69ad5fbdb0691ec260170e141297cefb982e7081fde52',
    version: 2,
    config: SDKConfig.cetusConfig,
  },
  clmm_pool: {
    package_id: '0x1eabed72c53feb3805120a081dc15963c204dc8d091542592abaf7a35689b2fb',
    published_at: '0x75b2e9ecad34944b8d0c874e568c90db0cf9437f0d7392abfd4cb902972f3e40',
    version: 12,
    config: SDKConfig.clmmConfig,
  },
  integrate: {
    package_id: '0x996c4d9480708fb8b92aa7acf819fb0497b5ec8e65ba06601cae2fb6db3312c3',
    published_at: '0xb2db7142fa83210a7d78d9c12ac49c043b3cbbd482224fea6e3da00aa5a5ae2d',
    version: 12,
  },
  stats_pools_url: 'https://api-sui.cetus.zone/v2/sui/stats_pools',
  clmm_vest: {
    package_id: '0x9d2f067d3b9d19ac0f8d2e5c2c393b1760232083e42005b2e5df39c06064d522',
    published_at: '0x9d2f067d3b9d19ac0f8d2e5c2c393b1760232083e42005b2e5df39c06064d522',
    version: 1,
    config: {
      clmm_vest_id: '0xe255c47472470c03bbefb1fc883459c2b978d3ad29aa8ee0c8c1ec9753fa7d01',
      versioned_id: '0x4f6f2f638362505836114f313809b834dafd58e3910df5110f6e54e4e35c929b',
      cetus_coin_type: '0x06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS',
    },
  },
}
