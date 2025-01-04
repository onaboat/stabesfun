'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode, Suspense } from 'react'
import toast, { Toaster } from 'react-hot-toast'

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

  const tickerItems = [
    { symbol: 'SOL', price: '$216.90', change: 12.5 },
    { symbol: 'USD', price: '$1.00', change: -0.2 },
    { symbol: 'GPD', price: '$0.81', change: 0.8 },
    { symbol: 'EUR', price: '$0.97', change: 0.2 },
    { symbol: 'MNX', price: '$20.63', change: 0.8 },
  ];
  


  return (
    <div className="h-screen flex flex-row">
      <div className="w-1/4 h-screen min-w-[330px]">
        <LHSNAV />
      </div>
      <div className="w-3/4 bg-primary overflow-auto">
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
