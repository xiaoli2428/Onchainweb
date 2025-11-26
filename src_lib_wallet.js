import React, { createContext, useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'

// A lightweight wallet context using the injected provider (MetaMask).
// Provides: connect, disconnect, address, balanceEth (string), chainId, providerAvailable

const WalletContext = createContext(null)

export function WalletProvider({ children }) {
  const wallet = useProvideWallet()
  return <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>
}

export const useWallet = () => {
  return useContext(WalletContext)
}

function useProvideWallet() {
  const [address, setAddress] = useState(null)
  const [balance, setBalance] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [providerAvailable, setProviderAvailable] = useState(
    typeof window !== 'undefined' && !!window.ethereum
  )

  useEffect(() => {
    if (!providerAvailable) return
    const eth = window.ethereum
    const handleAccounts = (accounts) => {
      if (accounts.length) setAddress(ethers.getAddress(accounts[0]))
      else {
        setAddress(null)
        setBalance(null)
      }
    }
    const handleChain = (chain) => {
      setChainId(chain)
    }
    eth.request({ method: 'eth_accounts' }).then((accounts) => handleAccounts(accounts)).catch(()=>{})
    eth.on && eth.on('accountsChanged', handleAccounts)
    eth.on && eth.on('chainChanged', handleChain)
    return () => {
      eth.removeListener && eth.removeListener('accountsChanged', handleAccounts)
      eth.removeListener && eth.removeListener('chainChanged', handleChain)
    }
  }, [providerAvailable])

  useEffect(() => {
    if (!address) return
    // fetch balance
    const fetchBalance = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const bal = await provider.getBalance(address)
        setBalance(ethers.formatEther(bal))
      } catch (err) {
        setBalance(null)
      }
    }
    fetchBalance()
  }, [address])

  async function connect() {
    if (!providerAvailable) {
      throw new Error('No injected provider found')
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      if (accounts.length) {
        setAddress(ethers.getAddress(accounts[0]))
        const provider = new ethers.BrowserProvider(window.ethereum)
        const bal = await provider.getBalance(accounts[0])
        setBalance(ethers.formatEther(bal))
      }
    } catch (err) {
      throw err
    }
  }

  function disconnect() {
    // Injected wallets don't have programmatic disconnect; clear local state
    setAddress(null)
    setBalance(null)
  }

  return {
    providerAvailable,
    connect,
    disconnect,
    address,
    balance,
    chainId
  }
}