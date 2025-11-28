# Orchestrator Engine — AWS Lambda Host

This repository provides the serverless wrapper for the Orchestrator Engine (OE).  
It exposes the engine through an AWS Lambda function with minimal logic, clean structure, and no vendor lock-in.  
The project is published as an open-source demo showing how to host an AI orchestration engine in a lightweight, cloud-agnostic way.

---

## Architecture Overview

The Lambda acts as a thin execution layer that delegates all reasoning and orchestration logic to the OE core:

Frontend (Next.js SSG)  
↓  
Next.js API Route  
↓  
AWS Lambda Host (this repository)  
↓  
Orchestrator Engine (npm package)  
↓  
Reasoning Providers (OpenAI, Bedrock, others)

---

## Features

- Minimal AWS Lambda wrapper
- Fully typed using TypeScript strict mode
- Clean handler using APIGatewayProxyHandlerV2
- Simple Serverless Framework deployment
- Portable design, cloud-agnostic
- Includes a local smoke test script for manual verification
- No business logic inside the Lambda; pure pass-through to OE

---

## Tech Stack

- AWS Lambda  
- Serverless Framework  
- TypeScript  
- Node.js 20.x  
- Orchestrator Engine npm package  

---

## Project Structure

.
├── handler.ts  
├── serverless.ts  
├── package.json  
├── scripts/  
│   └── smoke-test.ts  
└── README.md  

---

## Local Development

Install dependencies:

npm install

Run Serverless Offline:

npm run dev

(This requires a "dev" script in package.json, such as:  
"dev": "serverless offline")

---

## Deploying to AWS

Deploy to your chosen stage:

serverless deploy --stage dev

Show deployed endpoints:

serverless info

---

## API Contract

### Request  
POST /run

{
  "provider": "openai" | "bedrock",
  "input": "User input",
  "profileId": "default"
}

### Response

{
  "ok": true,
  "provider": "openai",
  "profile": "default",
  "summary": "Human-readable summary",
  "trace": [
    {
      "id": 1,
      "phase": "intake",
      "title": "Alert received",
      "message": "...",
      "timestamp": "...",
      "completed": true
    }
  ]
}

---

## Smoke Test Script

Place this file under: scripts/smoke-test.ts

import fetch from "node-fetch";

async function main() {
  const res = await fetch("http://localhost:3000/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      provider: "openai",
      input: "Test alert",
      profileId: "default"
    })
  });

  const json = await res.json();
  console.log("Smoke test response:", json);
}

main().catch(console.error);

Run it:

npx ts-node scripts/smoke-test.ts

---

## License

MIT License
