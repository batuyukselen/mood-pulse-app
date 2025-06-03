# Mood Pulse App

Mood Pulse App is a web application where users can express their emotional states through emojis and view the emotional states within the community in real-time. This application, running on the Stellar Blockchain network, provides a secure user experience with Freighter wallet integration.


## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Technologies](#technologies)
- [Installation](#installation)
- [Freighter Wallet Integration](#freighter-wallet-integration)
- [Stellar Contract Information](#stellar-contract-information)
- [Using Your Own Stellar Contract ID](#using-your-own-stellar-contract-id)
- [Usage](#usage)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Freighter Wallet Connection**: Users can connect their Freighter wallets running on the Stellar Blockchain to the application.
- **Testnet Support**: Configuration compatible with Stellar Testnet.
- **Mood Emojis**: Users can indicate their emotional state by selecting from five different emojis.
- **Live Chart**: Charts showing the emotional states within the community in real-time.
- **Blockchain Records**: Emoji selections are recorded as transactions on the Stellar Testnet.
- **Responsive Design**: Design compatible with all screen sizes, including mobile devices.
- **Modern Hooks API**: Modern API structure developed using React Hooks.
- **Advanced Error Handling**: User-friendly error messages and tracking.

## Demo

You can access the live demo version of the application [here](https://mood-pulse-app.netlify.app).

## Technologies

Main technologies used in this project:

- **Frontend**: React, TypeScript, TailwindCSS
- **Blockchain**: Stellar Network, Soroban Smart Contracts
- **Wallet Integration**: Freighter API
- **Build Tools**: Vite, PostCSS
- **State Management**: Zustand

## Installation

Follow these steps to run the project in your local environment:

1. Clone the project:
```bash
git clone https://github.com/batuyukselen/mood-pulse-app.git
cd mood-pulse-app
```

2. Install the necessary packages:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Go to `http://localhost:5173` in your browser to view the application.

## Freighter Wallet Integration

Mood Pulse App enables users to perform transactions on the blockchain with [Freighter Wallet](https://www.freighter.app/) integration running on the Stellar Blockchain. Thanks to this integration:

- Users can securely connect to the application
- Perform transactions on the Stellar Testnet network
- View their wallet address

### Freighter Setup

1. Install [Freighter Wallet](https://www.freighter.app/) as a browser extension
2. Create a new wallet or import an existing wallet
3. Select Stellar Testnet: `Settings > Network > Testnet`
4. Get test tokens from the Testnet faucet: [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test)

## Stellar Contract Information

Mood Pulse App records emoji selections and community data on the Stellar Testnet. These processes are carried out using the following methods:

### Transaction Recording Address

The Stellar address used by the application:

```
GAO3FFNMP7VYDBYPOUMMU7URGUM2QGLK5AXYZVEZVATAHPO72SRIKVMA
```

### Stellar Explorer Links

- [View the transaction recording address in Stellar Explorer](https://stellar.expert/explorer/testnet/account/GAO3FFNMP7VYDBYPOUMMU7URGUM2QGLK5AXYZVEZVATAHPO72SRIKVMA)
- [View all transactions on Testnet](https://testnet.stellar.expert/explorer/public)

### Transaction Details

Emoji selections are recorded in Stellar transactions as follows:

1. When a user selects an emoji, a transaction is created on the Stellar Testnet
2. The emoji and mood name are stored in the transaction memo in the format "MoodPulse: [emoji] - [mood name]"
3. These transactions are then queried for community statistics

## Using Your Own Stellar Contract ID

Follow these steps to use the application with your own Stellar Testnet address:

### Prerequisites

- [Freighter Wallet](https://www.freighter.app/) browser extension
- An account on Stellar Testnet (must have Testnet XLM balance)
- Node.js and npm installed

### Setup Steps

1. Use the provided helper script for easy setup:

```bash
npm run deploy-contract
```

This command will automatically perform the following actions:
- You can use an existing Stellar address or create a new one
- Update the Contract ID
- Check your Testnet XLM balance
- Create and fund an account (if necessary)
- Start the application

2. Manual Update (Alternative):

If the helper command doesn't work, you can manually edit the following file:

```bash
src/utils/stellarConstants.ts
```

Update the `MOODPULSE_CONTRACT_ID` variable with your own Stellar address:

```typescript
export const MOODPULSE_CONTRACT_ID = 'YOUR_STELLAR_ADDRESS';
```

### Getting Testnet XLM

You can use the Stellar Testnet Friendbot to get Testnet XLM for your account:

```
https://friendbot.stellar.org/?addr=YOUR_STELLAR_ADDRESS
```

## Usage

1. **Wallet Connection**: Connect your Freighter wallet by clicking the "Connect Wallet" button at the top of the page.
2. **Mood Selection**: Select the emoji that best reflects your current emotional state from the emoji options (😀 Happy, 😢 Sad, 😍 In Love, 😠 Angry, 🤔 Thoughtful) presented under the "How are you feeling today?" heading.
3. **View Live Chart**: You can view live charts and statistics showing the emotional state of the community on the page.
4. **View Transactions**: After your emoji selection, your transaction will be recorded on the Stellar Testnet and a link to your transaction will be displayed.

## Stellar Testnet Version

The current version of Mood Pulse App is actively running on the Stellar Testnet network. The application uses the following Stellar Testnet address:

```
GAO3FFNMP7VYDBYPOUMMU7URGUM2QGLK5AXYZVEZVATAHPO72SRIKVMA
```

This address was specially created for the application and funded with Testnet XLM. You can view this address in [Stellar Expert Explorer](https://stellar.expert/explorer/testnet/account/GAO3FFNMP7VYDBYPOUMMU7URGUM2QGLK5AXYZVEZVATAHPO72SRIKVMA).

## Development

### Project Structure

```
mood-pulse-app/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   ├── sections/
│   │   └── ui/
│   ├── store/
│   ├── hooks/         # React hooks
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── public/
└── package.json
```

### Zustand Stores

The application uses two main stores:
- `walletStore.ts`: Manages Freighter wallet connection and user address
- `emojiStore.ts`: Manages emoji selections and statistics

### React Hooks

The application uses custom hooks for a modern structure:
- `useStellar.ts`: Custom hook for Stellar blockchain integration

## Contributing

If you want to contribute to this project:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the `LICENSE` file for more information.

---

Developer: [Batuhan Yükselen](https://github.com/batuyukselen)
