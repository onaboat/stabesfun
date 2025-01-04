// // Here we export some useful types and functions for interacting with the Anchor program.
// import { AnchorProvider, Program } from '@coral-xyz/anchor'
// import { PublicKey } from '@solana/web3.js'
// import StablesfunIDL from '../target/idl/stablesfun.json'
// import type { Stablesfun } from '../target/types/stablesfun'

// // Re-export the generated IDL and type
// export { Stablesfun, StablesfunIDL }

// // The programId is imported from the IDL
// export const STABLESFUN_PROGRAM_ID = new PublicKey('DTqVdCrLTfG2aeBoLjKAJ87TNgBXShrUm9jLpe9ikrJd')

// // This is a helper function to get the Stablesfun Anchor program
// export function getStablesfunProgram(provider: AnchorProvider) {
//   return new Program(StablesfunIDL as Stablesfun, STABLESFUN_PROGRAM_ID, provider)
// }