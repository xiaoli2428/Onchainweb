# OnchainWeb (Ported accessibility-first UI + Price feed + Wallet connect)

![Docker Build](https://github.com/xiaoli2428/Onchainweb/actions/workflows/docker-image.yml/badge.svg)

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

## Docker

You can build and run a production-ready container using Docker:

```sh
# Build the image
docker build -t onchainweb .

# Run locally (serves at http://localhost:8080)
docker run --rm -p 8080:80 onchainweb
```

The app will be available at [http://localhost:8080](http://localhost:8080).

### GitHub Actions / CI/CD

This repo builds and pushes the Docker image to Docker Hub automatically when you push or open a PR to `main`.  
You must set the following GitHub secrets for this to work:
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN` (create in DockerHub account > Security > New Access Token)

Change the repo/image name in `.github/workflows/docker-image.yml` if you want a different Docker tag or repo.

---

_Manual verification and follow-up items remain the same._
