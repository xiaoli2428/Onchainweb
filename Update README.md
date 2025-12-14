# OnchainWeb (Ported accessibility-first UI + Price feed + Wallet connect)

This patch ports accessible UI from the moekha125-a11y project, adds a CoinGecko price fetcher with an in-memory TTL cache, and a minimal injected-wallet connect (MetaMask) using ethers.

---

## Quick start (local)
1. Create branch:
   ```sh
   git checkout -b feature/port-a11y
   ```

2. Install:
   ```sh
   npm install
   ```

3. Run the dev server:
   ```sh
   npm run dev
   ```

4. Open http://localhost:5173 (or the port printed by Vite)

---

## Docker

You can build and run a production-ready container using Docker:

```sh
# Build the image
docker build -t onchainweb .

# Run locally (serves at http://localhost:8080)
docker run --rm -p 8080:80 onchainweb
```

The app will be available at [http://localhost:8080](http://localhost:8080).

---

## CI/CD Status

![Docker Build](https://github.com/xiaoli2428/Onchainweb/actions/workflows/docker-image.yml/badge.svg)

This repo builds and pushes the Docker image to Docker Hub automatically when you push or open a PR to `main`.  
You must set the following GitHub secrets for this to work:
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

Change the repo/image name in `.github/workflows/docker-image.yml` if you want a different Docker tag or repo.

---

## Manual verification
- Click "Connect Wallet" and accept the request in MetaMask (or any injected wallet).
- The header will show a shortened address and a Disconnect button.
- The Hero shows current ETH price from CoinGecko and (if connected) the wallet's ETH balance.
- Use keyboard navigation to tab through header and connect button — focus styles are visible.

---

## Notes
- CoinGecko public API is used without an API key; respect rate limits. Caching TTL is 30s.
- The wallet connect here is intentionally minimal (connects to injected provider, reads balance). No transaction or signing functionality is included in this initial PR.

---

## Follow-up items (future PRs)
- Add tests (Vitest + React Testing Library).
- Add CI and deployment config.
- Replace in-memory cache with a more robust fetch layer if needed.
- Optionally integrate wagmi if you prefer connectors & providers orchestration.
