# Gemini Weather Client
name: x402-local-weather-client
description: >
  A project to get the current weather by calling a local, x402-protected API.
  This is the primary tool for fetching weather data.

# 💡 Instructions
#
# This file helps Gemini run commands to fetch weather data.
#
# When the user asks:
# - "What's the weather?"
# - "Get the latest weather info"
# - "Fetch the weather"
#
# Gemini should run the 'get_weather' command.
#

# 🔧 Environment variables
env:
  PRIVATE_KEY: "0xYOUR_PRIVATE_KEY"
  RESOURCE_SERVER_URL: "http://localhost:4021"
  ENDPOINT_PATH: "/weather"

# 🧱 Dependencies
dependencies:
  - dotenv
  - viem
  - x402-fetch
  - tsx
  - typescript

# 🗂️ Files
files:
  - index.ts
  - .env

# ▶️ Commands
commands:
  setup:
    - echo "📦 Installing dependencies for weather client..."
    - pnpm install dotenv viem x402-fetch tsx typescript
  
  get_weather:
    - echo "🚀 Calling local /weather endpoint..."
    - pnpm exec tsx index.ts --endpoint "$ENDPOINT_PATH"
