"use client"

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { InitStatic } from "@/components/stablesfun/init_static";
import Link from 'next/link';
import { WalletButton } from "@/components/solana/solana-provider";

export default function Page() {
  const { publicKey, connected, sendTransaction } = useWallet();
  const [isClient, setIsClient] = useState(false);


  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="p-8 w-full">
      <Link href="/" className="text-3xl font-bold mb-4 block hover:underline">&larr; Back</Link>
      {connected ? (
        <>
          <div>
            <InitStatic />
          </div>
        </>
      ) : (
        <div className="flex flex-col p-4 gap-4">
          <div className="">Connect your wallet to mint your stablecoin </div>
          <WalletButton style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }} />
          <div className="space-y-2 pt-10">
            <img src="/Stables2.png" alt="Stables.fun logo" className="w-3/4 align-center mx-auto" />
            <p className="text-sm font-medium text-center">Mint Stability, Backed by Real Assets.</p>
          </div>
        </div>
      )}
    </div>
  )
}