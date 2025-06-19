# Quantum Crypto Universe

**This software is not licensed for open-source or commercial usage.**  
**Any use of this code is bound by a 51% royalty for past or future use.**

## Production Blockchain Application

A full-stack application integrating audio processing, quantum physics simulations, and cryptocurrency management with real Ethereum blockchain functionality.

## Features

### 🎵 Audio Track Management
- Upload and manage audio tracks
- Quantum frequency analysis
- Waveform visualization
- Audio-to-physics conversion

### ⚛️ Physics Simulations
- Quantum particle systems
- Real-time physics calculations
- Audio-driven particle behaviors
- Interactive 3D visualizations

### 💰 Production Blockchain Wallet
- **Real Ethereum integration** with ethers.js and Web3
- Secure wallet generation and management
- Live blockchain balance fetching
- Production-ready transaction processing
- Multi-token support
- Exchange functionality

### 🔐 Integrated Wallet
- Your production wallet: `0xC441CE69E4aF8286D361f378B0A06362ecF9528a`
- Real-time balance updates from Ethereum network
- Secure private key management
- Transaction history tracking

## Technology Stack

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **PostgreSQL** database with Drizzle ORM
- **ethers.js** for Ethereum integration
- **Web3.js** for blockchain connectivity

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling
- **React Query** for state management
- **Lucide React** for icons
- **Shadcn/ui** component library

### Blockchain
- **Ethereum mainnet/testnet** support
- **Real transaction processing**
- **Gas estimation and optimization**
- **Multi-wallet management**

## Production Setup

### Environment Variables
```bash
DATABASE_URL=postgresql://...
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_API_KEY
NODE_ENV=production
```

### Database Schema
- `crypto_wallets` - Wallet management
- `transactions` - Transaction history
- `exchange_orders` - Token exchange records
- `crypto_tokens` - Token definitions
- `audio_tracks` - Audio data
- `physics_simulations` - Physics parameters

## Security

- Private keys stored encrypted in database
- Production-grade RPC endpoints
- Input validation and sanitization
- Type-safe database operations
- Secure transaction signing

## API Endpoints

### Wallet Management
- `GET /api/wallets` - List all wallets
- `POST /api/wallets` - Generate new wallet
- `POST /api/wallets/:id/refresh-balance` - Update balance from blockchain

### Transactions
- `POST /api/transfer` - Send Ethereum transactions
- `GET /api/transactions` - Transaction history
- `GET /api/blockchain/transaction/:hash` - Transaction details

### Blockchain Utilities
- `GET /api/blockchain/balance/:address` - Real balance lookup
- `GET /api/blockchain/gas-price` - Current gas prices
- `POST /api/blockchain/estimate-gas` - Gas estimation

## License Notice

This software is proprietary and not available for open-source or commercial use. Any usage of this code requires explicit permission and is subject to a 51% royalty on all past and future use.

For licensing inquiries, contact the copyright holder.

## Development

```bash
npm install
npm run dev
```

Access the application at `http://localhost:5000`