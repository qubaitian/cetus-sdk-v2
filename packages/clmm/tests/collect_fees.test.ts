import 'isomorphic-fetch'
import { CetusClmmSDK } from '../src/sdk'

describe('collect fees', () => {
  const sdk = CetusClmmSDK.createSDK({ env: 'mainnet' })

  test('batchFetchPositionFees', async () => {
    const res = await sdk.Position.batchFetchPositionFees(['0xcf995f40b0f9c40a8b03e0b9d9554fea2bc12a18fe63db3a04c59c46be5c10be'])
    console.log('res####', res)
  })
})
