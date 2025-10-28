import axios from "axios";
import { config } from "dotenv";
import { createRequire } from "module";
import type { Hex } from "x402-axios";

const require = createRequire(import.meta.url);
(globalThis as Record<string, unknown>).require = require;

config();

const privateKey = process.env.PRIVATE_KEY as Hex | undefined;
const baseURL = process.env.RESOURCE_SERVER_URL;
const endpointPath = process.env.ENDPOINT_PATH;

if (!privateKey || !baseURL || !endpointPath) {
  console.error("Missing required environment variables");
  process.exit(1);
}

async function main(): Promise<void> {
  const { withPaymentInterceptor, decodeXPaymentResponse, createSigner } = await import("x402-axios");
  const signer = await createSigner("base-sepolia", privateKey);

  const api = withPaymentInterceptor(
    axios.create({
      baseURL,
    }),
    signer,
  );

  const response = await api.get(endpointPath);
  console.log(response.data);

  const paymentHeader = response.headers["x-payment-response"];
  if (paymentHeader) {
    const paymentResponse = decodeXPaymentResponse(paymentHeader);
    console.log(paymentResponse);
  }
}

main().catch((error) => {
  console.error("Failed to fetch protected resource:", error);
  process.exitCode = 1;
});
