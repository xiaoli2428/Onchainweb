import React from 'react'
import { useWallet } from '../lib/wallet.js'

export default function Header() {
  const { providerAvailable, connect, disconnect, address } = useWallet()

  const shortAddr = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null

  return (
    <header className="site-header" role="banner" aria-label="Site header">
      <div className="brand" aria-label="OnchainWeb home">
        <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
          <rect width="100%" height="100%" rx="4" fill="url(#g)"></rect>
        </svg>
        <span>OnchainWeb</span>
      </div>
      <nav aria-label="Primary">
        {!providerAvailable ? (
          <span className="sub" aria-live="polite">No wallet detected</span>
        ) : address ? (
          <>
            <span className="sub" style={{marginRight:'.5rem'}}>{shortAddr}</span>
            <button
              className="connect-btn"
              onClick={() => disconnect()}
              aria-label="Disconnect wallet"
            >
              Disconnect
            </button>
          </>
        ) : (
          <button
            className="connect-btn"
            onClick={() => connect().catch(()=>{/* user cancelled or error - ignore for now */})}
            aria-label="Connect wallet"
          >
            Connect Wallet
          </button>
        )}
      </nav>
    </header>
  )
}