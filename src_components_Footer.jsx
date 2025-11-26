import React from 'react'

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo" aria-label="Footer">
      <div className="container">
        <small>
          © {new Date().getFullYear()} OnchainWeb — Data from <a href="https://www.coingecko.com" target="_blank" rel="noreferrer">CoinGecko</a>. Wallets use your injected provider.
        </small>
      </div>
    </footer>
  )
}