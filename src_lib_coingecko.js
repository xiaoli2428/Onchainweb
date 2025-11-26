// Minimal CoinGecko price fetcher with in-memory TTL cache.
// Usage: const price = await fetchPrice('ethereum', 'usd')
const cache = new Map()
const TTL = 30 * 1000 // 30s

function now() {
  return new Date().getTime()
}

export async function fetchPrices(ids = ['ethereum'], vs = 'usd') {
  // Normalize input
  const idsKey = Array.isArray(ids) ? ids.join(',') : String(ids)
  const cacheKey = `${idsKey}:${vs}`
  const cached = cache.get(cacheKey)
  if (cached && now() - cached.ts < TTL) {
    return cached.data
  }

  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(
      idsKey
    )}&vs_currencies=${encodeURIComponent(vs)}&include_24hr_change=true`
    const res = await fetch(url)
    if (!res.ok) throw new Error('CoinGecko fetch failed')
    const data = await res.json()
    cache.set(cacheKey, { ts: now(), data })
    return data
  } catch (err) {
    // Fallback: if there is cached but stale data, return it
    if (cached && cached.data) return cached.data
    // Otherwise bubble up so caller can show a friendly fallback UI
    throw err
  }
}