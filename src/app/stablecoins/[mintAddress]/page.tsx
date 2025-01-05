'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { connection, program, feed, SOL_VAULT_SEED, NEXT_PUBLIC_PINATA_GATEWAY } from '@/components/stablesfun/constants'
import { PublicKey, Transaction } from '@solana/web3.js'
import { getMint, MintLayout, getAssociatedTokenAddress } from '@solana/spl-token'
import { useWallet } from '@solana/wallet-adapter-react'
import BN from 'bn.js'
import { useParams } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { WalletButton } from '@/components/solana/solana-provider'
import ReactCanvasConfetti from 'react-canvas-confetti';
import type { CreateTypes } from 'canvas-confetti';
import { ellipsify } from '@/components/ui/ui-layout'

export default function StablecoinPage() {
  const { publicKey, sendTransaction } = useWallet()
  const { mintAddress } = useParams()
  const [mintData, setMintData] = useState<any>(null)
  const [accountInfo, setAccountInfo] = useState<any>(null)
  const [vaultAddress, setVaultAddress] = useState<PublicKey | null>(null)
  const [ataAddress, setAtaAddress] = useState<PublicKey | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const refConfetti = useRef<CreateTypes | null>(null);

  const makeShot = useCallback((particleRatio: number, opts: any) => {
    refConfetti.current?.({
      ...opts,
      origin: { y: 0.7 },
      particleCount: Math.floor(200 * particleRatio)
    });
  }, []);

  const fire = useCallback(() => {
    makeShot(0.25, { spread: 26, startVelocity: 55 });
    makeShot(0.2, { spread: 60 });
    makeShot(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    makeShot(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    makeShot(0.1, { spread: 120, startVelocity: 45 });
  }, [makeShot]);

  const mintPubkey = new PublicKey(mintAddress)

  const [amount, setAmount] = useState<number>(0)
  const [burnAmount, setBurnAmount] = useState<number>(0)
  const [activeTab, setActiveTab] = useState('buy');

  useEffect(() => {
    const getInfo = async () => {
      if (!mintAddress) return

      try {
        setIsLoading(true)
        const info = await connection.getAccountInfo(mintPubkey)
        if (!info) {
          console.error("No account info found for mint address")
          return
        }

        setAccountInfo(info)
        const data = MintLayout.decode(info.data)

        // Get vault PDA
        const [vaultAddress] = PublicKey.findProgramAddressSync(
          [Buffer.from("sol_vault"), mintPubkey.toBuffer()],
          program.programId
        );

        setVaultAddress(vaultAddress)

        // Fetch vault account data
        const vaultAccount = await program.account.vaultAccount.fetch(vaultAddress)

        setMintData({
          mintAddress: mintPubkey.toBase58(),
          symbol: vaultAccount.symbol,
          name: vaultAccount.name,
          image: vaultAccount.image,
          description: vaultAccount.description,
          vaultAddress: vaultAddress.toBase58(),
          decimals: data.decimals,
          mintAuthority: data.mintAuthority?.toBase58(),
          supply: data.supply.toString(),
          currency: vaultAccount.currency,
        })
      } catch (error) {
        console.error("Error fetching vault data:", error)
        toast.error("Failed to load token data")
      } finally {
        setIsLoading(false)
      }
    }

    getInfo()
  }, [mintAddress])



  const handleTestMint = async () => {
    console.log("Minting...")
    if (!publicKey) return

    const ata = await getAssociatedTokenAddress(mintPubkey, publicKey)
    console.log("User's ATA:", ata.toBase58())


    // Create the mint instruction
    const ix = await program.methods
      .mintCoinsInstruction(
        new BN(amount * 10 ** mintData.decimals), // 0.02 SOL
        mintData.symbol
      )
      .accounts({
        mint: mintPubkey,
        destination: ata,
        payer: publicKey,
        feed,
        solVault: vaultAddress!,
      })
      .instruction()

    console.log("Created instruction")

    // Create and send transaction
    const tx = new Transaction().add(ix)

    const latestBlockhash = await connection.getLatestBlockhash('confirmed');
    tx.recentBlockhash = latestBlockhash.blockhash;
    tx.feePayer = publicKey;

    // --- Step 5: Simulate Transaction ---
    const simulation = await connection.simulateTransaction(tx);
    console.log("Simulation result:", simulation.value);

    const signature = await sendTransaction(tx, connection)
    console.log("Transaction sent:", signature)

    toast.success("Transaction sent")

    // Wait for confirmation
    const confirmation = await connection.confirmTransaction(signature)
    console.log("Transaction confirmed:", confirmation)

    toast.success("Transaction confirmed")
    fire()
    toast.success(
      <div className="font-mono">
        Transaction:
        <div>
          <a href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`} target="_blank" rel="noreferrer">
            {ellipsify(signature, 8)}
          </a>
        </div>
      </div>
    )
  }

  const handleTestBurn = async () => {
    console.log("Burning...")
    if (!publicKey) return

    const ata = await getAssociatedTokenAddress(mintPubkey, publicKey)
    console.log("User's ATA:", ata.toBase58())


    // Create the mint instruction
    const burnIx = await program.methods
      .burnCoinsInstruction(
        new BN(burnAmount * 10 ** mintData.decimals), // 0.02 SOL
        mintData.symbol
      )
      .accounts({
        mint: mintPubkey,
        source: ata,
        payer: publicKey,
        feed,
        solVault: vaultAddress!,
      })
      .instruction()

    console.log("Created instruction")

    // Create and send transaction
    const burnTx = new Transaction().add(burnIx)

    const latestBlockhash = await connection.getLatestBlockhash('confirmed');
    burnTx.recentBlockhash = latestBlockhash.blockhash;
    burnTx.feePayer = publicKey;

    // --- Step 5: Simulate Transaction ---
    const burnSimulation = await connection.simulateTransaction(burnTx);
    console.log("Simulation result:", burnSimulation.value);

    const burnSignature = await sendTransaction(burnTx, connection)
    console.log("Transaction sent:", burnSignature)

    toast.success("Transaction sent")

    // Wait for confirmation
    const burnConfirmation = await connection.confirmTransaction(burnSignature)
    console.log("Transaction confirmed:", burnConfirmation)

    toast.success("Sell confirmed")
    toast.success(
      <div className="font-mono">
        Transaction:
        <div>
          <a href={`https://explorer.solana.com/tx/${burnSignature}?cluster=devnet`} target="_blank" rel="noreferrer">
            {ellipsify(burnSignature, 8)}
          </a>
        </div>
      </div>
    )

  }


  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[200px]">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  )

  if (!mintData) return (
    <div className="alert alert-error">
      <span>Failed to load token data</span>
    </div>
  )

  return (
    <div className="p-8">
      <ReactCanvasConfetti
        onInit={(instance: { confetti: CreateTypes }) => {
          refConfetti.current = instance.confetti;
        }}
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          zIndex: 50
        }}
      />
      <Link href="/" className="text-3xl font-bold mb-4 block hover:underline">&larr; Back</Link>
      <div className='flex flex-row p-4 gap-4'>
        <div className="w-2/3">
          <div className='flex flex flex-col  gap-4'>

            {mintData.image && (
              <div className="">
                <img
                  src={mintData.image}
                  alt={`${mintData.symbol} token`}
                  className="object-cover"
                />
              </div>
            )}

            <div>
              <h1 className="text-2xl font-bold mb-4">{mintData.name}</h1>
              <h1 className="text-lg mb-4">{mintData.description}</h1>
            </div>

            <div className="stats stats-horizontal bg-wild-cream border border-black ">
              <div className="stat">
                <div className="stat-title">Symbol</div>
                <div className="stat-value">{mintData.symbol}</div>
              </div>

              <div className="stat">
                <div className="stat-title">Total Supply</div>
                <div className="stat-value">{(Number(mintData.supply) / 10 ** mintData.decimals).toLocaleString()}</div>
                <div className="stat-desc">Decimals: {mintData.decimals}</div>
              </div>
            </div>

            <div className="font-mono">mint <br />{mintData.mintAddress}</div>

          </div>
        </div>
        <div className="w-1/3">
          <div className="bg-wild-cream border border-black shadow-[5px_5px_0px_0px_rgba(0,0,0)] w-full max-w-md">
            {!publicKey ? (
              <div className="space-y-4 p-4 min-h-[180px] flex items-center justify-center">
                <div className="">
                  <div className="text-2xl font-bold mb-2">Connect your wallet to mint or redeem tokens</div>
                  <div className="pt-5"><WalletButton style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }} /></div>
                </div>
              </div>
            ) : (
              <>
                <div role="tablist" className="tabs tabs-boxed">
                  <a
                    role="tab"
                    className={`tab ${activeTab === 'buy' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('buy')}
                  >
                    Buy
                  </a>
                  <a
                    role="tab"
                    className={`tab ${activeTab === 'sell' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('sell')}
                  >
                    Sell
                  </a>
                </div>

                {activeTab === 'buy' && (
                  <div className="space-y-4 p-4 min-h-[180px]">
                    <div className="text-2xl font-bold mb-4">BUY <br /> {mintData.symbol} STABLECOIN</div>
                    <div className="flex flex-col gap-2">
                      <div className="join w-full">
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(Number(e.target.value))}
                          placeholder="Enter amount"
                          className="input input-bordered join-item w-full"
                          step="0.000001"
                          min="0.00000000001"
                        />
                        <button
                          onClick={handleTestMint}
                          disabled={!publicKey}
                          className="btn btn-primary join-item"
                        >
                          {publicKey ? `Buy ${mintData.symbol}` : 'Connect Wallet'}
                        </button>
                      </div>
                      <div className="text-sm text-gray-600">
                        {amount > 0 ? `${amount} SOL → ${amount * 176} ${mintData.symbol}` : `Enter amount of SOL to buy ${mintData.symbol}`}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'sell' && (
                  <div className="space-y-4 p-4 min-h-[180px]">
                    <div className="text-2xl font-bold mb-4">SELL <br />{mintData.symbol} STABLECOIN</div>
                    <div className="flex flex-col gap-2">
                      <div className="join w-full">
                        <input
                          type="number"
                          value={burnAmount}
                          onChange={(e) => setBurnAmount(Number(e.target.value))}
                          placeholder="Enter amount"
                          className="input input-bordered join-item w-full"
                          step="0.000001"
                          min="0.00000000001"
                        />
                        <button
                          onClick={handleTestBurn}
                          disabled={!publicKey}
                          className="btn btn-primary join-item"
                        >
                          {publicKey ? `Sell ${mintData.symbol}` : 'Connect Wallet'}
                        </button>
                      </div>
                      <div className="text-sm text-gray-600">
                        {burnAmount > 0 ? `${burnAmount} ${mintData.symbol} → ${burnAmount / 176} SOL` : `Enter amount of ${mintData.symbol} to sell for SOL`}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 