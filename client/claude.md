# Claude Code Project

name: x402-global-client description: > A Claude Code project that calls an x402-protected API using viem + x402-fetch. The main entry point is index.ts, which performs a crypto payment and fetches paid data (e.g. /weather endpoint).

# 🔧 Environment variables

env: PRIVATE_KEY: "0xYOUR_PRIVATE_KEY" RESOURCE_SERVER_URL: "http://localhost:4021" ENDPOINT_PATH: "/weather"

# 🧱 Dependencies Claude Code should install

dependencies:

- dotenv
- viem
- x402-fetch
- tsx
- typescript

# 🗂️ Files Claude should include

files:

- index.ts
- .env

# ▶️ Commands Claude Code can run

commands: setup: - echo "📦 Installing dependencies globally for x402 client..." - pnpm install dotenv viem x402-fetch tsx typescript pay: - echo "🚀 Calling x402 paywalled API from index.ts..." - pnpm exec tsx index.ts pay-custom: - echo "💡 Running custom endpoint payment..." - pnpm exec tsx index.ts --endpoint "$ENDPOINT_PATH"

# 💡 Notes for Claude

notes: | This configuration lets Claude Code (or Codex CLI) run a wallet-enabled TypeScript client that pays for API access using Coinbase's x402 protocol. It loads PRIVATE_KEY and RESOURCE_SERVER_URL from .env.

- Run `claude run pay` to fetch the /weather endpoint.
- Or override ENDPOINT_PATH for other paywalled endpoints.
