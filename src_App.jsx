import React from 'react'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Features from './components/Features.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <div className="app-root" lang="en">
      <Header />
      <main id="main" role="main">
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  )
}