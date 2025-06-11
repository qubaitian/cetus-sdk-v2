import { bcs } from '@mysten/sui/bcs'
import { deriveDynamicFieldID } from '@mysten/sui/utils'

export type ValueBcsType = 'u8' | 'u16' | 'u32' | 'u64' | 'u128' | 'u256' | 'address' | 'string'

/**
 * Derive dynamic field ID for different types
 * @param parentId The parent object ID
 * @param typeTag The type tag of the dynamic field
 * @param value The value to be serialized
 * @param bcsType The type of the value (address, u64, u32, etc.)
 * @returns The derived dynamic field ID
 */
export function deriveDynamicFieldIdByType(parentId: string, value: string | number, typeTag: string, valueBcsType: ValueBcsType): string {
  let serializedValue: Uint8Array

  switch (valueBcsType) {
    case 'address':
      serializedValue = bcs.Address.serialize(value as string).toBytes()
      break
    case 'u8':
      serializedValue = bcs
        .u8()
        .serialize(value as number)
        .toBytes()
      break
    case 'u16':
      serializedValue = bcs
        .u16()
        .serialize(value as number)
        .toBytes()
      break
    case 'u32':
      serializedValue = bcs
        .u32()
        .serialize(value as number)
        .toBytes()
      break
    case 'u64':
      serializedValue = bcs
        .u64()
        .serialize(value as number)
        .toBytes()
      break
    case 'u128':
      serializedValue = bcs
        .u128()
        .serialize(value as number)
        .toBytes()
      break
    case 'u256':
      serializedValue = bcs
        .u256()
        .serialize(value as number)
        .toBytes()
      break
    case 'string':
      serializedValue = bcs
        .string()
        .serialize(value as string)
        .toBytes()
      break
    default:
      throw new Error(`Unsupported value type: ${valueBcsType}`)
  }

  return deriveDynamicFieldID(parentId, typeTag, serializedValue)
}
