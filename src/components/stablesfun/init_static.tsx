'use client'

import { FC, useState, ChangeEvent, useRef, useCallback } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { web3 } from '@coral-xyz/anchor'
import { program, METADATA_SEED, TOKEN_METADATA_PROGRAM_ID, SOL_VAULT_SEED, NEXT_PUBLIC_PINATA_JWT, NEXT_PUBLIC_PINATA_GATEWAY } from './constants'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

import { PinataSDK } from "pinata-web3";
import ReactCanvasConfetti from 'react-canvas-confetti';
import type { CreateTypes } from 'canvas-confetti';

const pinata = new PinataSDK({
    pinataJwt: NEXT_PUBLIC_PINATA_JWT,
    pinataGateway: NEXT_PUBLIC_PINATA_GATEWAY,
});

enum Currency {
    USD = "USD",
    EUR = "EUR",
    GBP = "GBP",
    PESO = "MNX"
}

interface InitStaticProps {
    // Add any props if needed
}

const CURRENCIES = [
    { value: 'USD', label: 'US Dollar' },
    { value: 'EUR', label: 'Euro' },
    { value: 'GBP', label: 'British Pound' },
    { value: 'MNX', label: 'Mexican Peso' }
] as const

export const InitStatic: FC<InitStaticProps> = ({ }) => {
    const { connection } = useConnection()
    const { publicKey, sendTransaction } = useWallet()
    const [name, setName] = useState("")
    const [symbol, setSymbol] = useState("")
    const [currency, setCurrency] = useState<typeof CURRENCIES[number]['value']>('USD')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [description, setDescription] = useState("")

    const router = useRouter()

    const TARGET_WIDTH = 256
    const TARGET_HEIGHT = 256

    const refConfetti = useRef<CreateTypes | null>(null);

    const makeShot = useCallback((particleRatio: number, opts: any) => {
        refConfetti.current?.({
            ...opts,
            origin: { y: 0.7 },
            particleCount: Math.floor(200 * particleRatio)
        });
    }, []);

    const fire = useCallback(() => {
        makeShot(0.25, {
            spread: 26,
            startVelocity: 55
        });

        makeShot(0.2, {
            spread: 60
        });

        makeShot(0.35, {
            spread: 100,
            decay: 0.91,
            scalar: 0.8
        });

        makeShot(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2
        });

        makeShot(0.1, {
            spread: 120,
            startVelocity: 45
        });
    }, [makeShot]);

    const resizeImage = (file: File): Promise<File> => {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.src = URL.createObjectURL(file)

            img.onload = () => {
                const canvas = document.createElement('canvas')
                canvas.width = TARGET_WIDTH
                canvas.height = TARGET_HEIGHT
                const ctx = canvas.getContext('2d')

                if (!ctx) {
                    URL.revokeObjectURL(img.src)
                    reject(new Error('Could not get canvas context'))
                    return
                }

                // White background
                ctx.fillStyle = 'white'
                ctx.fillRect(0, 0, canvas.width, canvas.height)

                // Calculate scaling to maintain aspect ratio
                const scale = Math.max(
                    TARGET_WIDTH / img.width,
                    TARGET_HEIGHT / img.height
                )
                const scaledWidth = img.width * scale
                const scaledHeight = img.height * scale
                const x = (TARGET_WIDTH - scaledWidth) / 2
                const y = (TARGET_HEIGHT - scaledHeight) / 2

                ctx.drawImage(img, x, y, scaledWidth, scaledHeight)

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Could not convert canvas to blob'))
                            return
                        }

                        const processedFile = new File([blob], file.name, {
                            type: 'image/png',
                            lastModified: Date.now(),
                        })

                        URL.revokeObjectURL(img.src)
                        resolve(processedFile)
                    },
                    'image/png',
                    0.8
                )
            }
        })
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setSelectedFile(e.target.files[0])
        }
    }

    const handleInitialize = async () => {
        if (!publicKey || !selectedFile || !name || !symbol) return


        toast.success("Uploading image")

        setIsUploading(true)
        try {
            const resizedFile = await resizeImage(selectedFile)
            const imageUpload = await pinata.upload.file(resizedFile)
            const imageIpfsHash = imageUpload.IpfsHash

         
            const uploadedImage = `https://gateway.pinata.cloud/ipfs/${imageIpfsHash}`

            const upload = await pinata.upload.json({
                name,
                symbol,
                description,
                image: uploadedImage,
                currency
            }, {
                metadata: {
                    name: `${symbol}_metadata.json`
                }
            })

            const uploadedUri = `https://gateway.pinata.cloud/ipfs/${upload.IpfsHash}`

            toast.success('Sending transaction');
            
            // Derive the mint PDA
            const [mint] = web3.PublicKey.findProgramAddressSync(
                [Buffer.from("mint"), publicKey.toBuffer(), Buffer.from(symbol)],
                program.programId
            );

            console.log("Initializing mint account:", mint.toBase58());

            const [metadataAddress] = web3.PublicKey.findProgramAddressSync(
                [
                    Buffer.from(METADATA_SEED),
                    TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                    mint.toBuffer(),
                ],
                TOKEN_METADATA_PROGRAM_ID
            );

            const [solVault] = web3.PublicKey.findProgramAddressSync(
                [Buffer.from(SOL_VAULT_SEED), mint.toBuffer()],
                program.programId
            );

            // --- Step 2: Prepare Transaction Context ---
            const context = {
                metadata: metadataAddress,
                mint,
                payer: publicKey,
                rent: web3.SYSVAR_RENT_PUBKEY,
                systemProgram: web3.SystemProgram.programId,
                tokenProgram: TOKEN_PROGRAM_ID,
                tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
                solVault,
            };


            console.log("----- UPloaded -------", uploadedUri)

            // --- Step 3: Create Transaction for initCoin ---
            const tx = await program.methods
                .initCoinInstruction({
                    name,
                    symbol,
                    uri: uploadedUri,
                    decimals: 9,
                },
                    currency,
                    uploadedImage,
                    description,
                )
                .accounts(context)
                .transaction();

            

            // --- Step 4: Sign and Send Transaction ---
            tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
            tx.feePayer = publicKey;


            // --- Step 4.1: Simulate Transaction ---
            const simulation = await connection.simulateTransaction(tx);
            console.log("Simulation Result:", simulation);

            toast.success("Sending transaction...")

            // --- Step 4.2: Send Transaction ---

            const sig = await sendTransaction(tx, connection, {
                skipPreflight: false,
                preflightCommitment: "processed",
                maxRetries: 3,
            });


            // --- Step 5: Confirm Transaction ---
            await connection.confirmTransaction(sig, "confirmed");

            toast.success('Token created successfully!');
            fire();

            setTimeout(() => {
                router.push(`/stablecoins/${mint.toBase58()}`);
            }, 2000);

        } catch (error) {
            toast.error('Error! Only 1 token with the same symbol can be minted per wallet.');
            console.error('Error during upload:', error)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="flex flex-col gap-4 w-full max-w-md mx-auto p-4">
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
            <div className="flex justify-start">
                <h2 className="text-2xl font-bold">Create your stablecoin</h2>
            </div>

            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">Token Name</span>
                </label>
                <input
                    type="text"
                    placeholder="Token Name"
                    className="input input-bordered w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={32}
                />
            </div>

            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">Token Symbol</span>
                </label>
                <input
                    type="text"
                    placeholder="Token Symbol"
                    className="input input-bordered w-full"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    maxLength={4}
                />
            </div>

            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">Token Image</span>
                </label>
                <input
                    type="file"
                    className="file-input file-input-bordered w-full"
                    onChange={handleFileChange}
                    accept="image/*"
                />
                {selectedFile && (
                    <div className="mt-2 mb-4">
                        <img
                            src={URL.createObjectURL(selectedFile)}
                            alt="Preview"
                            className="w-64 h-64 object-cover rounded-lg shadow-lg"
                        />
                    </div>
                )}
            </div>

            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">Description</span>
                </label>
                <textarea
                    maxLength={100}
                    placeholder="Token description"
                    className="textarea textarea-bordered h-24 w-full"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <label className="label">
                    <span className="label-text-alt">{description.length}/100 bytes</span>
                </label>
            </div>

            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">Currency</span>
                </label>
                <select
                    className="select select-bordered w-full"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as Currency)}
                >
                    {Object.values(Currency).map((curr) => (
                        <option key={curr} value={curr}>
                            {curr}
                        </option>
                    ))}
                </select>
            </div>

            <button
                onClick={handleInitialize}
                className="btn btn-secondary w-full"
                disabled={!publicKey || !selectedFile || !name || !symbol || isUploading}
            >
                {isUploading ? 'Uploading...' : 'Initialize Token'}
            </button>
        </div>
    )
}
