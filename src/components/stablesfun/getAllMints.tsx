"use client"
import { useState, useEffect } from 'react'
import { connection, program } from "./constants"
import Link from 'next/link'
import { PublicKey } from '@solana/web3.js'
import { BN } from '@coral-xyz/anchor'
import { TokenCard } from '../ui/token-card'

interface VaultData {
  balance: BN
  mint: PublicKey
  bump: number
  symbol: string
  name: string
  currency: string
  uri: string
  image: string
  description: string
}

export default function GetAllMints() {
  const [isLoading, setIsLoading] = useState(false)
  const [vaults, setVaults] = useState<(VaultData & { pubkey: string })[]>([])

  useEffect(() => {
    fetchAllMints()
  }, [])

  const fetchAllMints = async () => {
    setIsLoading(true)
    try {
      const accounts = await connection.getProgramAccounts(program.programId)
      
      const vaultAccounts = await Promise.all(
        accounts.map(async acc => {
          try {
            const vault = await program.account.vaultAccount.fetch(acc.pubkey)
            return {
              ...vault,
              pubkey: acc.pubkey.toBase58()
            }
          } catch (error) {
            console.error("Error processing vault:", error)
            return null
          }
        })
      )

      setVaults(vaultAccounts.filter((v): v is VaultData & { pubkey: string } => 
        v !== null && 'pubkey' in v && 'mint' in v
      ))
    } catch (error) {
      console.error("Error fetching accounts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4">
      {isLoading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {vaults.map((vault) => (
            <Link 
              href={`/stablecoins/${vault.mint}`} 
              key={vault.pubkey}
            >
              <TokenCard
                imageSrc={vault.image}
                altText={vault.name}
                title={vault.name}
                description={vault.description}
                mintAddress={vault.mint.toBase58()}
                currency={vault.currency}
                symbol={vault.symbol}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}