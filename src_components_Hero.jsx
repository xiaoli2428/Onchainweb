import React, { useEffect, useState } from 'react'
import { fetchPrices } from '../lib/coingecko.js'
import { useWallet } from '../lib/wallet.js'

export default function Hero() {
  const [priceData, setPriceData] = useState(null)
  const [error, setError] = useState(null)
  const { address, balance } = useWallet()

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const data = await fetchPrices(['ethereum'], 'usd')
        if (!mounted) return
        setPriceData(data.ethereum)
      } catch (err) {
        setError('Failed to load prices')
      }
    }
    load()
    const timer = setInterval(load, 30 * 1000) // refresh every 30s
    return () => {
      mounted = false
      clearInterval(timer)
    }
  }, [])

  const ethPrice = priceData?.usd ? `$${Number(priceData.usd).toLocaleString()}` : '—'
  const ethChange = priceData?.usd_24h_change ? `${priceData.usd_24h_change.toFixed(2)}%` : null

  return (
    <div className="container">
      <section className="hero-card" aria-labelledby="market-heading">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <h1 id="market-heading" style={{margin:0}}>Market Overview</h1>
            <p className="sub">Live prices from CoinGecko (public API)</p>
          </div>
          <div aria-hidden="true" style={{textAlign:'right'}}>
            <div className="price" title="Ethereum price in USD">{ethPrice}</div>
            {ethChange && <div className="sub" aria-hidden="true">24h: {ethChange}</div>}
          </div>
        </div>

        <div style={{marginTop:'1rem',display:'flex',gap:'1rem',alignItems:'center',flexWrap:'wrap'}}>
          <div>
            <strong className="sub">Connected wallet</strong>
            <div className="sub" aria-live="polite">{address ? address : 'Not connected'}</div>
          </div>
          <div>
            <strong className="sub">Wallet balance</strong>
            <div className="sub">{balance ? `${Number(balance).toFixed(4)} ETH` : '—'}</div>
          </div>
        </div>

        {error && <div role="alert" style={{color:'salmon',marginTop:'1rem'}}>{error}</div>}
      </section>
    </div>
  )
}