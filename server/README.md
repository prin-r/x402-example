# x402-express

An example server using the `x402-express` middleware to paywall an API endpoint.

## Requirements

- Node.js v20+
- pnpm v10
- An address to receive funds
- Coinbase Developer Platform API Key & Secret (if using Base mainnet)

## Getting started

To start, install the dependencies and compile the server.

```bash
pnpm install
pnpm dev
```

Once the server is running, visit `http://localhost:4021/weather` to see the paywall in action.

You will see a 402 response status:

```json
{
  "price": "$0.001",
  "payTo": "0x...",
  "network": "base-sepolia"
}
```

To access the endpoint, you need to make a payment. You can use the example [fetch client](../../../clients/fetch) or [axios client](../../../clients/axios) to see how to do this.

## Configuration

The server is configured with a paywall for two endpoints:

- `GET /weather` - requires $0.001 to access
- `GET /premium/*` - requires a custom token amount to access

You can configure the paywall by editing the `paymentMiddleware` configuration in `index.ts`.

```typescript
app.use(
  paymentMiddleware(
    payTo,
    {
      "GET /weather": {
        // USDC amount in dollars
        price: "$0.001",
        network: "base-sepolia",
      },
      "/premium/*": {
        // Define atomic amounts in any EIP-3009 token
        price: {
          amount: "100000",
          asset: {
            address: "0xabc",
            decimals: 18,
            eip712: {
              name: "WETH",
              version: "1",
            },
          },
        },
        network: "base-sepolia",
      },
    },
    {
      url: facilitatorUrl,
    },
  ),
);
```
