# IQ Check Web App

## Overview
The **IQ Check Web App** is a Next.js-based application that allows users to check their IQ score based on their Twitter (𝕏) username. The app fetches user data, analyzes it using AI, and provides an IQ score with a witty and sarcastic reasoning.

## Features
- **Twitter (𝕏) Integration:** Fetches user details based on their Twitter username.
- **AI-Based IQ Calculation:** Uses GPT-based AI to generate an IQ score and reasoning.
- **Solana Wallet Integration:** Allows users to buy additional IQ checks with SOL.
- **Dynamic Visuals:** Interactive charts and notifications to enhance user experience.
- **Rate Limiting:** Prevents spam requests using DynamoDB.
- **Serverless Architecture:** Powered by SST (Serverless Stack) and AWS Lambda.

## Tech Stack
- **Frontend:** Next.js, React, TypeScript, CSS Modules
- **Backend:** Serverless API routes using Next.js
- **Blockchain:** Solana Wallet Adapter
- **Database:** DynamoDB (AWS) for storing user scores
- **AI:** OpenAI API for generating IQ scores and reasoning
- **Hosting:** Deployed using SST on AWS

## Project Structure
```
/iq/web
├── app
│   ├── api (API routes for IQ checking)
│   ├── components (UI components like charts, notifications, wallet integration)
│   ├── public (Assets, fonts, images)
│   ├── utils (Helper functions for fetching and processing data)
│   ├── hooks (Custom React hooks)
│   ├── pages (Next.js pages)
│   ├── styles (CSS Modules for styling)
├── package.json (Project dependencies and scripts)
├── next.config.ts (Next.js configuration)
├── sst.config.ts (Serverless Stack configuration)
└── README.md (This file)
```

## Getting Started
### Prerequisites
- **Node.js** (Recommended version: 18+)
- **npm/yarn/pnpm** (Package manager)
- **SST CLI** (For serverless deployment)
- **Solana Wallet** (For buying IQ checks)

### Installation
Clone the repository and install dependencies:
```bash
npm install
```

### Running Locally
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables
Create a `.env.local` file and add the following variables:
```env
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_TWITTER_BEARER_TOKEN=your_twitter_bearer_token
NEXT_PUBLIC_SOLANA_RPC=https://solana-mainnet.g.alchemy.com/v2/your_alchemy_key
```

## Deployment
This app is deployed using **SST** (Serverless Stack) on AWS. To deploy:
```bash
npx sst deploy --stage production
```
To remove the deployment:
```bash
npx sst remove --stage production
```

## Usage
1. Enter your Twitter (𝕏) username.
2. Click the **Analyze** button.
3. View your AI-generated IQ score and reasoning.
4. Share your score on Twitter.
5. Purchase more IQ checks using Solana if needed.

## Contributing
We welcome contributions! Feel free to submit a pull request or open an issue.

## License
This project is licensed under the MIT License.

---

**Built with 🖤 by Fiig.**

