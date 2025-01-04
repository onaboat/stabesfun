'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode, Suspense, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import Image from 'next/image'

import { AccountChecker } from '../account/account-ui'
import { ClusterChecker } from '../cluster/cluster-ui'
import { LHSNAV } from './lhs-nav'
import { TokenCard } from './token-card'
import { Ticker } from './ticker'

interface Props {
  children: ReactNode
  links?: { label: string; path: string }[]
}

export function UiLayout({ children, links }: Props) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const tickerItems = [
    { symbol: 'SOL', price: '$216.90', change: 12.5 },
    { symbol: 'USD', price: '$1.00', change: -0.2 },
    { symbol: 'GPD', price: '$0.81', change: 0.8 },
    { symbol: 'EUR', price: '$0.97', change: 0.2 },
    { symbol: 'MNX', price: '$20.63', change: 0.8 },
  ];
  


  return (
    <div className="h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-base-100 p-4 flex justify-between items-center border-b">
        {/* Menu and Logo */}
        <div className="flex items-center gap-3">
          <button 
            className="btn btn-square btn-ghost"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <Image
            src="/stables.png"
            alt="Logo"
            width={120}
            height={120}
            className="w-8 h-8"
          />
        </div>

        {/* Create Button */}
        <Link
          href="/stablesfun"
          className="btn btn-primary btn-sm"
        >
          Create Your Own Stablecoin
        </Link>
      </div>

      {/* Navigation Sidebar */}
      <div className={`
        w-full md:w-1/4 md:min-w-[330px] 
        ${isMobileMenuOpen ? 'block' : 'hidden'} 
        md:block 
        absolute md:relative 
        z-50 md:z-auto 
        bg-base-100
        h-screen
      `}>
        {/* Close button for mobile */}
        <div className="md:hidden p-4 flex justify-end">
          <button 
            className="btn btn-square btn-ghost"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <LHSNAV />
      </div>

      {/* Main Content */}
      <div className="w-full md:w-3/4 bg-primary overflow-auto">
        <Ticker items={tickerItems} />
        <ClusterChecker>
          <AccountChecker />
          <Suspense fallback={<span className="loading loading-spinner loading-lg"></span>}>
            <div className="p-4">
              {/* {links?.length ? (
                <div className="tabs mb-4">
                  {links.map(({ path, label }) => (
                    <Link
                      key={path}
                      href={path}
                      className={`tab tab-bordered ${pathname === path ? 'tab-active' : ''}`}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              ) : null} */}
            
              {children}
            </div>
          </Suspense>
        </ClusterChecker>
        <Toaster position="bottom-right" />
      </div>
    </div>
  )
}

export function ellipsify(str = '', len = 4) {
  if (str.length > 30) {
    return str.substring(0, len) + '..' + str.substring(str.length - len)
  }
  return str
}

export function useTransactionToast() {
  return (signature: string) => {
    toast.success(
      <div className="font-mono">
        Transaction sent:
        <div>
          <a href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`} target="_blank" rel="noreferrer">
            {ellipsify(signature, 8)}
          </a>
        </div>
      </div>
    )
  }
}

export function AppHero({ 
  children, 
  title, 
  subtitle 
}: { 
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
}) {
  return (
    <div className="hero py-[64px]">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          {title}
          {subtitle}
          {children}
        </div>
      </div>
    </div>
  );
}

export function AppModal({ 
  children, 
  title,
  onClose,
  hide, // for backward compatibility
  show,
  submitDisabled,
  submitLabel,
  submit
}: { 
  children: React.ReactNode;
  title?: string;
  onClose?: () => void;
  hide?: () => void;
  show?: boolean;
  submitDisabled?: boolean;
  submitLabel?: string;
  submit?: () => void;
}) {
  const handleClose = onClose || hide;
  
  if (!show) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        {title && <h3 className="font-bold text-lg">{title}</h3>}
        {children}
        <div className="modal-action">
          {submit && (
            <button 
              className="btn btn-primary" 
              disabled={submitDisabled}
              onClick={submit}
            >
              {submitLabel}
            </button>
          )}
          <button className="btn" onClick={handleClose}>Close</button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
}
