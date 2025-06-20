import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'
import dotenv from 'dotenv'
dotenv.config()

const privateKey = process.env.SUI_WALLET_PRIVATE_KEY

/**
 * Build a test account using the mnemonic phrase from environment variables
 * If no mnemonic phrase is provided, it will use a default test phrase
 * @returns Ed25519Keypair instance
 */
export function buildTestAccount(): Ed25519Keypair {
    const test_account_object = Ed25519Keypair.fromSecretKey(privateKey as string)
    console.log(' Address: ', test_account_object.getPublicKey().toSuiAddress())
    return test_account_object
}
