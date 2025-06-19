# Quantum Crypto Platform & Physics Simulation

A full-stack web application featuring cryptocurrency creation and interactive physics simulations, built with React, TypeScript, and Node.js.

## 🚀 Features

### Cryptocurrency Creation
- **Create & Launch Tokens**: Full cryptocurrency creation workflow with tokenomics
- **Blockchain Deployment**: Deploy tokens to blockchain networks
- **Token Management**: Track created tokens and their market status
- **Trading Interface**: Complete trading functionality for launched tokens

### Physics Simulation
- **Interactive Simulations**: Real-time physics engine
- **Particle Systems**: Advanced particle rendering and animation
- **Waveform Visualization**: Audio-reactive visual components
- **Custom Controls**: Fine-tune simulation parameters

### Audio Integration
- **Real-time Audio Controls**: Play, pause, volume control
- **Waveform Display**: Visual representation of audio data
- **Audio-reactive Token Generation**: Sync token creation with audio input

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TanStack Query** for data fetching and caching
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Drizzle ORM** for database operations
- **PostgreSQL 16** for data persistence

### Development Tools
- **ESBuild** for fast compilation
- **TSX** for TypeScript execution
- **Drizzle Kit** for database migrations

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quantum-crypto-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment template
   cp .env.example .env

   # Edit .env with your configuration
   DATABASE_URL=your_postgresql_connection_string
   ```

4. **Initialize the database**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🗄 Database Schema

### Crypto Tokens Table
```sql
- id: Primary key
- name: Token name (e.g., "QuantumCoin")
- symbol: Token symbol (e.g., "QTC")
- description: Token description
- total_supply: Total token supply
- initial_price: Initial token price in USD
- contract_address: Blockchain contract address
- blockchain: Target blockchain (default: ethereum)
- token_standard: Token standard (default: ERC-20)
- is_launched: Deployment status
- launched_at: Deployment timestamp
```

### Audio Tracks Table
```sql
- id: Primary key
- title: Track title
- artist: Artist name
- duration: Track duration in seconds
- frequency: Audio frequency data
- amplitude: Audio amplitude data
- waveform_data: JSON waveform visualization data
```

### Physics Simulations Table
```sql
- id: Primary key
- name: Simulation name
- particle_count: Number of particles
- particle_density: Particle density
- quantum_field: Quantum field configuration
- parameters: JSON simulation parameters
- is_active: Simulation status
```

## 🚀 Deployment

### Replit Deployment
This project is configured for Replit's autoscale deployment:

1. **Build Process**: Automatic build via `npm run build`
2. **Production Start**: `npm run start`
3. **Port Configuration**: Internal port 5000 → External port 80
4. **Database**: PostgreSQL 16 included in Replit environment

### Manual Deployment
For other platforms:

1. Build the project: `npm run build`
2. Set environment variables
3. Run database migrations: `npm run db:push`
4. Start the server: `npm run start`

## 📋 API Endpoints

### Crypto Token Endpoints
- `GET /api/crypto` - Get all crypto tokens
- `POST /api/crypto` - Create new crypto token
- `GET /api/crypto/:id` - Get specific token
- `PUT /api/crypto/:id` - Update token
- `DELETE /api/crypto/:id` - Delete token

### Blockchain Endpoints
- `POST /api/blockchain/deploy` - Deploy token to blockchain
- `GET /api/blockchain/status/:tokenId` - Get deployment status

### Audio Track Endpoints
- `GET /api/tracks` - Get all audio tracks
- `POST /api/tracks` - Create new track
- `GET /api/tracks/:id` - Get specific track

### Physics Simulation Endpoints
- `GET /api/simulations` - Get all simulations
- `POST /api/simulations` - Create new simulation
- `GET /api/simulations/:id` - Get specific simulation

## 🎨 UI Components

The project uses a comprehensive design system with:
- **Shadcn/ui** components for consistent styling
- **Radix UI** primitives for accessibility
- **Tailwind CSS** for custom styling
- **Responsive design** for all screen sizes

## 🔒 Security

- **Input validation** on all API endpoints
- **Environment variable** protection for sensitive data
- **Type-safe** operations with TypeScript and Zod validation

## 🛠 Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type check TypeScript
- `npm run db:push` - Push database schema changes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests and ensure build passes
5. Submit a pull request

## 🔧 Configuration

### Database Configuration
- **Development**: Uses Replit's PostgreSQL instance
- **Production**: Configure `DATABASE_URL` environment variable
- **Migrations**: Managed via Drizzle Kit

### Build Configuration
- **Client Build**: Vite builds to `dist/public`
- **Server Build**: ESBuild compiles to `dist/index.js`
- **Static Files**: Served from Express server

## 📈 Features Roadmap

- [ ] Multi-blockchain support (Ethereum, BSC, Polygon)
- [ ] Advanced trading features (limit orders, stop-loss)
- [ ] DeFi integration (staking, liquidity pools)
- [ ] Real-time price feeds
- [ ] Mobile app development
- [ ] Advanced audio analysis for token generation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.