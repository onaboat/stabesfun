import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Stablesfun } from "../target/types/stablesfun";
import { IDL } from "../target/types/stablesfun";

describe("stablesfun", () => {
  const connection = new anchor.web3.Connection("https://api.devnet.solana.com");
  
  const payer = Keypair.fromSecretKey(
    Buffer.from(JSON.parse(require('fs').readFileSync(
      require('os').homedir() + '/.config/solana/id.json', 'utf-8'
    )))
  );
  
  const wallet = new anchor.Wallet(payer);
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  anchor.setProvider(provider);

  const program = new Program(
    IDL,
    new PublicKey("Ce1yP5NbGoBZoZoukbs8MobjbknkST19gAch6uSHbXxm"),
    provider
  ) as Program<Stablesfun>;
  
  let mint: PublicKey;
  let metadataAddress: PublicKey;
  let solVault: PublicKey;
  let associatedTokenAccount: PublicKey;

  // Constants
  const TOKEN_METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
  const MINT_SEED = "mint";
  const SOL_VAULT_SEED = "sol_vault";
  const METADATA_SEED = "metadata";
  const feed = new PublicKey("66bVyxuQ6a4XCAqQHWoiCbG6wjZsZkHgwbGVY7NqQjS5");
  
  // random symbol as each wallet can only have one symbol
  const symbol = Math.random().toString(36).substring(2, 10).replace(/[0-9]/g, '').substring(0, 4).toUpperCase();
  const name = "USD Coin";
  const uri = "https://example.com/metadata.json";

  it("Sets up test accounts", async () => {
    [mint] = PublicKey.findProgramAddressSync(
      [Buffer.from(MINT_SEED), payer.publicKey.toBuffer(), Buffer.from(symbol)],
      program.programId
    );

    [metadataAddress] = PublicKey.findProgramAddressSync(
      [
        Buffer.from(METADATA_SEED),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    [solVault] = PublicKey.findProgramAddressSync(
      [Buffer.from(SOL_VAULT_SEED), mint.toBuffer()],
      program.programId
    );

    associatedTokenAccount = await getAssociatedTokenAddress(
      mint,
      payer.publicKey
    );

    console.log("Test accounts:", {
      payer: payer.publicKey.toString(),
      mint: mint.toString(),
      metadata: metadataAddress.toString(),
      solVault: solVault.toString(),
      programId: program.programId.toString(),
    });
  });

  it("Initializes a new coin", async () => {
    const context = {
      metadata: metadataAddress,
      mint,
      payer: payer.publicKey,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      solVault,
    };

    const tx = await program.methods
      .initCoinInstruction(
        {
          name,
          symbol,
          uri,
          decimals: 9,
        },
        "TE",
        "https://example.com/image.png",
        "Test stablecoin"
      )
      .accounts(context)
      .transaction();

    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    tx.feePayer = payer.publicKey;

    const signature = await provider.sendAndConfirm(tx, [payer]);
    console.log("Initialization transaction:", signature);
  }, 30000);

  it("Mints coins", async () => {
    const solAmount = new anchor.BN(0.02 * anchor.web3.LAMPORTS_PER_SOL);

    const tx = await program.methods
      .mintCoinsInstruction(solAmount, symbol)
      .accounts({
        mint,
        destination: associatedTokenAccount,
        payer: payer.publicKey,
        feed,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        solVault,
      })
      .transaction();

    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    tx.feePayer = payer.publicKey;

    const signature = await provider.sendAndConfirm(tx, [payer]);
    console.log("Mint transaction:", signature);
  }, 30000);

  it("Burns coins", async () => {
    const tx = await program.methods
      .burnCoinsInstruction(new anchor.BN(0.01 * anchor.web3.LAMPORTS_PER_SOL), symbol)
      .accounts({
        mint,
        source: associatedTokenAccount,
        payer: payer.publicKey,
        feed,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        solVault,
      })
      .transaction();

    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    tx.feePayer = payer.publicKey;

    const signature = await provider.sendAndConfirm(tx, [payer]);
    console.log("Burn transaction:", signature);
  }, 30000);
});
