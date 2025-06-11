import { asIntN, ClmmPoolUtil, d, DETAILS_KEYS, extractStructTagFromType, getObjectFields, TickMath } from '@cetusprotocol/common-sdk'
import BN from 'bn.js'
import type { FarmsPool, FarmsPositionNFT, RewarderConfig } from '../types/farmsType'
import { FarmsErrorCode, handleError } from '../errors/errors'

export class FarmsUtils {
  static calculatePositionShare(
    tick_lower: number,
    tick_upper: number,
    liquidity: string,
    price: string,
    effective_tick_lower: number,
    effective_tick_upper: number,
    current_sqrt_price: string
  ): string {
    if (tick_upper <= effective_tick_lower || tick_lower >= effective_tick_upper) {
      return '0'
    }
    let valid_tick_lower = 0
    if (tick_lower < effective_tick_lower) {
      valid_tick_lower = effective_tick_lower
    } else {
      valid_tick_lower = tick_lower
    }

    let valid_tick_upper = 0
    if (tick_upper < effective_tick_upper) {
      valid_tick_upper = tick_upper
    } else {
      valid_tick_upper = effective_tick_upper
    }

    const lowerSqrtPrice = TickMath.tickIndexToSqrtPriceX64(valid_tick_lower)
    const upperSqrtPrice = TickMath.tickIndexToSqrtPriceX64(valid_tick_upper)

    const { coin_amount_a, coin_amount_b } = ClmmPoolUtil.getCoinAmountFromLiquidity(
      new BN(liquidity),
      new BN(current_sqrt_price),
      lowerSqrtPrice,
      upperSqrtPrice,
      true
    )

    return d(coin_amount_a).mul(price).div(1000000000000).add(coin_amount_b).toString()
  }

  static buildFarmsPool(data: any): FarmsPool {
    try {
      const fields = getObjectFields(data)
      const rewarders: RewarderConfig[] = []
      fields.rewarders.forEach((item: any) => {
        rewarders.push({
          reward_coin: extractStructTagFromType(item.fields.name).full_address,
          last_reward_time: '',
          emission_per_second: '',
          total_allocate_point: '',
          allocate_point: '',
        })
      })
      const farmsPool: FarmsPool = {
        id: fields.id.id,
        clmm_pool_id: fields.clmm_pool_id,
        effective_tick_lower: asIntN(BigInt(fields.effective_tick_lower.fields.bits)),
        effective_tick_upper: asIntN(BigInt(fields.effective_tick_upper.fields.bits)),
        total_share: fields.total_share,
        rewarders,
        positions: {
          positions_handle: fields.positions.fields.id.id,
          size: fields.positions.fields.size,
        },
        sqrt_price: fields.sqrt_price,
      }
      return farmsPool
    } catch (error) {
      return handleError(FarmsErrorCode.BuildError, error as Error, {
        [DETAILS_KEYS.METHOD_NAME]: 'buildFarmsPool',
      })
    }
  }

  static buildFarmsPositionNFT(data: any): FarmsPositionNFT {
    try {
      const fields = getObjectFields(data)
      const clmmFields = fields.clmm_postion.fields
      const farmsPositionNft: FarmsPositionNFT = {
        id: fields.id.id,
        url: clmmFields.url,
        pool_id: fields.pool_id,
        coin_type_a: extractStructTagFromType(clmmFields.coin_type_a.fields.name).full_address,
        coin_type_b: extractStructTagFromType(clmmFields.coin_type_b.fields.name).full_address,
        description: clmmFields.description,
        name: clmmFields.name,
        liquidity: clmmFields.liquidity,
        clmm_position_id: clmmFields.id.id,
        clmm_pool_id: clmmFields.pool,
        index: clmmFields.index,
        tick_lower_index: asIntN(BigInt(clmmFields.tick_lower_index.fields.bits)),
        tick_upper_index: asIntN(BigInt(clmmFields.tick_upper_index.fields.bits)),
        rewards: [],
      }
      return farmsPositionNft
    } catch (error) {
      return handleError(FarmsErrorCode.BuildError, error as Error, {
        [DETAILS_KEYS.METHOD_NAME]: 'buildFarmsPositionNFT',
      })
    }
  }
}
