import { FullRpcUrlTestnet } from '@cetusprotocol/common-sdk'
import { CetusClmmSDK, SdkOptions } from '../sdk'
const SDKConfig = {
  clmmConfig: {
    pools_id: '0x50eb61dd5928cec5ea04711a2e9b72e5237e79e9fbcd2ce3d5469dc8708e0ee2',
    global_config_id: '0x9774e359588ead122af1c7e7f64e14ade261cfeecdb5d0eb4a5b3b4c8ab8bd3e',
    global_vault_id: '0xf78d2ee3c312f298882cb680695e5e8c81b1d441a646caccc058006c2851ddea',
    admin_cap_id: '0xa456f86a53fc31e1243f065738ff1fc93f5a62cc080ff894a0fb3747556a799b',
  },
  cetusConfig: {
    coin_list_id: '0x257eb2ba592a5480bba0a97d05338fab17cc3283f8df6998a0e12e4ab9b84478',
    launchpad_pools_id: '0xdc3a7bd66a6dcff73c77c866e87d73826e446e9171f34e1c1b656377314f94da',
    clmm_pools_id: '0x26c85500f5dd2983bf35123918a144de24e18936d0b234ef2b49fbb2d3d6307d',
    admin_cap_id: '0x1a496f6c67668eb2c27c99e07e1d61754715c1acf86dac45020c886ac601edb8',
    global_config_id: '0xe1f3db327e75f7ec30585fa52241edf66f7e359ef550b533f89aa1528dd1be52',
    coin_list_handle: '0x3204350fc603609c91675e07b8f9ac0999b9607d83845086321fca7f469de235',
    launchpad_pools_handle: '0xae67ff87c34aceea4d28107f9c6c62e297a111e9f8e70b9abbc2f4c9f5ec20fd',
    clmm_pools_handle: '0xd28736923703342b4752f5ed8c2f2a5c0cb2336c30e1fed42b387234ce8408ec',
  },
}

// origin testnet
// export const clmmTestnet: SdkOptions = {
//   env: 'testnet',
//   full_rpc_url: FullRpcUrlTestnet,
//   cetus_config: {
//     package_id: '0xf5ff7d5ba73b581bca6b4b9fa0049cd320360abd154b809f8700a8fd3cfaf7ca',
//     published_at: '0xf5ff7d5ba73b581bca6b4b9fa0049cd320360abd154b809f8700a8fd3cfaf7ca',
//     config: SDKConfig.cetusConfig,
//   },
//   clmm_pool: {
//     package_id: '0x0c7ae833c220aa73a3643a0d508afa4ac5d50d97312ea4584e35f9eb21b9df12',
//     published_at: '0x85e61285a10efc6602ab00df70a0c06357c384ef4c5633ecf73016df1500c704',
//     config: SDKConfig.clmmConfig,
//   },
//   integrate: {
//     package_id: '0x2918cf39850de6d5d94d8196dc878c8c722cd79db659318e00bff57fbb4e2ede',
//     published_at: '0x19dd42e05fa6c9988a60d30686ee3feb776672b5547e328d6dab16563da65293',
//   },
//   stats_pools_url: 'https://api-sui.devcetus.com/v2/sui/stats_pools',
// }

// testnet test compensation
export const clmmTestnet: SdkOptions = {
  env: 'testnet',
  full_rpc_url: FullRpcUrlTestnet,
  cetus_config: {
    package_id: '0x2933975c3f74ef7c31f512edead6c6ce3f58f8e8fdbea78770ec8d5abd8ff700',
    published_at: '0xb50a626294f743b40ea51c9cb75190f0e38c71f580981b5613aef910b67a2691',
    config: {
      coin_list_id: '',
      launchpad_pools_id: '',
      clmm_pools_id: '',
      admin_cap_id: '0x774656a83f4f625fcc4e4dbf103eb77caf2d8b8f114ad33f55b848be068267b9',
      global_config_id: '0x95275a022123c66682278e9df6b5bac4da9abcc29ab698b7b2a6213262a592fe',
      coin_list_handle: '',
      launchpad_pools_handle: '',
      clmm_pools_handle: '',
    },
  },
  clmm_pool: {
    package_id: '0x305373e739d150500cabf6d428c66839d4979e75a59790c20f5b0b4c5c48d10d',
    published_at: '0x305373e739d150500cabf6d428c66839d4979e75a59790c20f5b0b4c5c48d10d',
    config: {
      pools_id: '0x180d004699228f34ea3fc1d32c3dc2e3dda5618f1610fd355724e80d76c2bb07',
      global_config_id: '0xd38f21b0eefc839785996e4a8909d2215a99516cad3b5263fe0c452b5e0f668d',
      global_vault_id: '0x286d508782f4834c40ad9bfaf798f830597836358afd2f45774d854aa797e464',
      admin_cap_id: '0x9d1b48053a3eeb6eff3897feb84264e107467224a984c32b2a1798f6f585f0a7',
      partners_id: '0x39b54a9ca028e8aa495d43451ec52c46f7235d4cfb9d07bf01b11c46237d8849',
    },
  },
  integrate: {
    package_id: '0xbca2e2cf1b7cce2b2cc0adfb9eb05eb4b469808f0b04a26d32f22e13bc46beb6',
    published_at: '0xbca2e2cf1b7cce2b2cc0adfb9eb05eb4b469808f0b04a26d32f22e13bc46beb6',
    version: 1,
  },
  stats_pools_url: 'https://api-sui.devcetus.com/v2/sui/stats_pools',
  clmm_vest: {
    package_id: '0xa46d9c66e7b24ab14c5fc5f0d08fa257d833718f0295a6343556ea2f2fdfbd7f',
    published_at: '0xa46d9c66e7b24ab14c5fc5f0d08fa257d833718f0295a6343556ea2f2fdfbd7f',
    config: {
      clmm_vest_id: '0x308b24963e5992f699e32db2f7088b812566a0cae580317fd3b8bf61de7f5508',
      versioned_id: '0x1cfb684d8ff581416a56caba2aa419bee45fe98a23cbf28e2c6c1021b14cab7c',
      cetus_coin_type: '0xc6c51938da9a5cf6d6dca692783ea7bdf4478f7b1fef693f58947848f84bcf89::cetus::CETUS',
    },
  },
}
