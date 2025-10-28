# AI + MCP x402 Example (Client/Server)

Pay-per-request APIs using the **x402** open payment standard.
This repo shows:

* a **server** that protects endpoints with `x402-express`
* a **client** that pays with `x402-axios` and then fetches data
* optional **Gemini** agent wiring via `GEMINI.md`

x402 lets services charge stablecoins **over plain HTTP** by reviving the `402 Payment Required` status code; no accounts, sessions, or API keys required. A **facilitator** verifies payment onchain so your server can safely return the data. ([Coinbase Developer Docs][1])

```
AI client (axios + x402-axios)
      │ 1) GET /weather
      ▼
Server (Express + x402-express) ── 2) 402 challenge ──► Client auto-pays
      │                                      │
      │ 4) verify with facilitator ◄────────┘ 3) submit signed payment
      ▼
Blockchain (Base Sepolia → USDC test tokens)
      │
      └─ 5) 200 OK with data
```

> You can also bridge this through an MCP server so desktop AIs (e.g., Claude) can call paid tools. ([Coinbase Developer Docs][2])

---

## Project layout

```
.
├── client/      # axios + x402-axios buyer
│   ├── index.ts
│   └── GEMINI.md  # optional: Gemini tool config
└── server/      # express + x402-express seller
    └── index.ts
```

---

## Prerequisites

* **Node.js 18+** (20 LTS recommended)
* **pnpm** (`npm i -g pnpm`)
* A **wallet private key** funded with test USDC on **Base Sepolia** (for testing)
* A **facilitator URL** (default public testnet facilitator works out-of-the-box) ([Coinbase Developer Docs][3])

---

## Setup

Clone and install both apps:

```bash
pnpm i --filter ./client
pnpm i --filter ./server
```

### 1) Configure the server

Create `server/.env-local`:

```ini
# Where the server receives payments
ADDRESS=0xYOUR_RECEIVING_ADDRESS

# Test facilitator (supports Base Sepolia & Solana Devnet)
FACILITATOR_URL=https://x402.org/facilitator
```

> The public facilitator above is recommended for development. Swap to a mainnet-capable facilitator when you go live. ([Coinbase Developer Docs][3])

Start the server:

```bash
pnpm --filter ./server exec tsx index.ts
# Server listening at http://localhost:4021
```

The server protects `/weather` at **$0.001** on **base-sepolia** via `paymentMiddleware`. ([SeiJS Documentation][4])

### 2) Configure the client

Create `client/.env`:

```ini
# Buyer key used to authorize x402 payments on Base Sepolia
PRIVATE_KEY=0xYOUR_TEST_PRIVATE_KEY

# Your server base URL and endpoint
RESOURCE_SERVER_URL=http://localhost:4021
ENDPOINT_PATH=/weather
```

Run the client:

```bash
pnpm --filter ./client exec tsx index.ts
```

You should see the JSON weather report. The client auto-handles `402` challenges and retries the request after paying, thanks to `x402-axios`. ([SeiJS Documentation][5])

---

## How it works (quick reference)

* **Server**: `x402-express` issues a `402 Payment Required` with pricing metadata. When it later receives a paid request (validated by the facilitator), it returns `200 OK`. ([SeiJS Documentation][4])
* **Client**: `x402-axios` intercepts the `402`, prepares a payment for the specified network/token (Base USDC by default), signs/authorizes it, calls the facilitator, and retries automatically. ([SeiJS Documentation][5])
* **Facilitator**: an independent verifier/settlement layer servers trust to confirm payment intent/settlement onchain. ([Coinbase Developer Docs][6])

> Many flows use **EIP-3009 “transferWithAuthorization”** style signed transfers for ERC-20s, enabling atomic, signature-based token moves without prior approvals. ([Ethereum Improvement Proposals][7])

---

## Environment variables (summary)

**Server (`server/.env-local`)**

* `ADDRESS` — your receiving wallet (`0x…` or Solana address)
* `FACILITATOR_URL` — facilitator endpoint (e.g., `https://x402.org/facilitator`) ([Coinbase Developer Docs][3])

**Client (`client/.env`)**

* `PRIVATE_KEY` — buyer key used by the signer
* `RESOURCE_SERVER_URL` — e.g., `http://localhost:4021`
* `ENDPOINT_PATH` — e.g., `/weather`

---

## Scripts & common commands

If you don’t have scripts, use `tsx` directly:

```bash
# Server
pnpm --filter ./server exec tsx index.ts

# Client
pnpm --filter ./client exec tsx index.ts
```

---

## Optional: run via Gemini

`client/GEMINI.md` includes a minimal config so Gemini can invoke the **get_weather** command that calls your local x402-protected API. It wires the same env vars used by `index.ts`.

---

## Switching networks / going live

* Change each protected route’s `{ network: "base-sepolia" }` to the appropriate mainnet (e.g., `"base"`), and use a facilitator that supports it. See the Coinbase docs’ “Running on Mainnet” and facilitator listings. ([Coinbase Developer Docs][8])
* Ensure your receiving address and buyer wallet hold the correct token on that network.

---

## Troubleshooting

* **Client loops on 402** → Make sure the buyer key is funded with the right token on the right network, and that `FACILITATOR_URL` is reachable. ([Coinbase Developer Docs][9])
* **CORS from browsers** → Put the server behind your app’s domain and configure CORS headers.
* **Wrong network** → The server route and client signer must agree on `network` (e.g., `base-sepolia`).
* **Local dev** → If you change env files, restart both processes.

---

## Security notes

* Use **test keys** on testnets. Never commit `.env` files (already ignored).
* Treat a facilitator like any other critical dependency; use HTTPS and consider self-hosting or trusted providers for production. ([GitHub][10])

---

## References

* x402 overview & quickstarts (buyers/sellers) — Coinbase Dev Docs. ([Coinbase Developer Docs][1])
* Facilitators & testnet default — x402.org ecosystem. ([x402][11])
* `x402-axios` and `x402-express` packages. ([SeiJS Documentation][5])
* EIP-3009 “Transfer With Authorization”. ([Ethereum Improvement Proposals][7])

---

### License

This example is for educational use. Review licenses of third-party packages before production.

[1]: https://docs.cdp.coinbase.com/x402/welcome?utm_source=chatgpt.com "Welcome to x402 - Coinbase Developer Documentation"
[2]: https://docs.cdp.coinbase.com/x402/mcp-server?utm_source=chatgpt.com "MCP Server with x402 - Coinbase Developer Documentation"
[3]: https://docs.cdp.coinbase.com/x402/network-support?utm_source=chatgpt.com "Network & Token Support - x402"
[4]: https://sei-js.docs.sei.io/x402/packages/x402-express?utm_source=chatgpt.com "x402-express - SeiJS Documentation"
[5]: https://sei-js.docs.sei.io/x402/packages/x402-axios?utm_source=chatgpt.com "x402-axios - SeiJS Documentation"
[6]: https://docs.cdp.coinbase.com/x402/core-concepts/facilitator?utm_source=chatgpt.com "Facilitator - Coinbase Developer Documentation"
[7]: https://eips.ethereum.org/EIPS/eip-3009?utm_source=chatgpt.com "ERC-3009: Transfer With Authorization"
[8]: https://docs.cdp.coinbase.com/x402/quickstart-for-sellers?utm_source=chatgpt.com "Quickstart for Sellers - Coinbase Developer Documentation"
[9]: https://docs.cdp.coinbase.com/x402/quickstart-for-buyers?utm_source=chatgpt.com "Quickstart for Buyers - x402"
[10]: https://github.com/x402-rs/x402-rs?utm_source=chatgpt.com "x402-rs/x402-rs: x402 payments in Rust"
[11]: https://www.x402.org/ecosystem?utm_source=chatgpt.com "Explore the x402 Ecosystem"
