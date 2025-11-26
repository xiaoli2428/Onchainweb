# OnchainWeb (Ported accessibility-first UI + Price feed + Wallet connect)

This patch ports accessible UI from the moekha125-a11y project, adds a CoinGecko price fetcher with an in-memory TTL cache, and a minimal injected-wallet connect (MetaMask) using ethers.

Quick start (local)
1. Create branch:
   git checkout -b feature/port-a11y

2. Install:
   npm install

3. Run the dev server:
   npm run dev

4. Open http://localhost:5173 (or the port printed by Vite)

Manual verification
- Click "Connect Wallet" and accept the request in MetaMask (or any injected wallet).
- The header will show a shortened address and a Disconnect button.
- The Hero shows current ETH price from CoinGecko and (if connected) the wallet's ETH balance.
- Use keyboard navigation to tab through header and connect button — focus styles are visible.

Notes
- CoinGecko public API is used without an API key; respect rate limits. Caching TTL is 30s.
- The wallet connect here is intentionally minimal (connects to injected provider, reads balance). No transaction or signing functionality is included in this initial PR.

Follow-up items (future PRs)
- Add tests (Vitest + React Testing Library).
- Add CI and deployment config.
- Replace in-memory cache with a more robust fetch layer if needed.
- Optionally integrate wagmi if you prefer connectors & providers orchestration.
