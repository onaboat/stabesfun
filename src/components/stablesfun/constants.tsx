import { Program, web3 } from "@coral-xyz/anchor";
import { IDL, Stablesfun } from "../../../anchor/target/types/stablesfun";
import {  Connection, PublicKey, } from "@solana/web3.js";

export const NEXT_PUBLIC_PINATA_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY
export const NEXT_PUBLIC_PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT
export const RPC = process.env.NEXT_PUBLIC_RPC_URL

export const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL || "https://api.devnet.solana.com", "confirmed");

// export const programId = new PublicKey("8iz5JzUmCHvSBm8mtb8fp7BDoyfM2UoZqMpVbxPxKbLJ");
export const programId = new PublicKey("7jGe9v39k4JzkwT4pZ7BqjBx9QCtbzGLg4UDj7rTTbAn");
export const program = new Program<Stablesfun>(IDL, programId, {connection,});

export const MINT_SEED = "mint";
export const SOL_VAULT_SEED = "sol_vault";
export const METADATA_SEED = "metadata";
export const TOKEN_METADATA_PROGRAM_ID = new web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
export const feed = new PublicKey("66bVyxuQ6a4XCAqQHWoiCbG6wjZsZkHgwbGVY7NqQjS5");



// Constants and Interfaces
export const TARGET_WIDTH = 256
export const TARGET_HEIGHT = 256
export const INITIAL_MAX_SIZE = 5 * 1024 * 1024;
export const FINAL_MAX_SIZE = 1 * 1024 * 1024;
export const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/gif'];