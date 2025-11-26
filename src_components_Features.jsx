import React from 'react'

const features = [
  { title: 'Wallet Connect', desc: 'Connect with MetaMask or any injected wallet.' },
  { title: 'Live Prices', desc: 'Real-time price data from CoinGecko with safe caching.' },
  { title: 'Accessibility', desc: 'Semantic HTML, visible focus, and keyboard usable controls.' },
  { title: 'Lightweight', desc: 'Small footprint and easy to extend for DeFi features.' }
]

export default function Features() {
  return (
    <section className="container" aria-labelledby="features-heading">
      <h2 id="features-heading">Features</h2>
      <div className="features" role="list">
        {features.map((f) => (
          <article key={f.title} className="feature-card" role="listitem" tabIndex={0}>
            <h3>{f.title}</h3>
            <p className="sub">{f.desc}</p>
          </article>
        ))}
      </div>
    </section>
  )
}