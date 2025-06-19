
# NFT Marketplace & Physics Simulation Platform

A full-stack web application featuring NFT marketplace functionality and interactive physics simulations, built with React, TypeScript, and Node.js.

## 🚀 Features

### NFT Marketplace
- **Create & Mint NFT Collections**: Full NFT creation workflow with metadata
- **Buy/Sell NFTs**: Complete marketplace functionality
- **User Profiles**: Track owned and created NFTs
- **Transaction History**: Complete audit trail of all NFT activities

### Physics Simulation
- **Interactive Simulations**: Real-time physics engine
- **Particle Systems**: Advanced particle rendering and animation
- **Waveform Visualization**: Audio-reactive visual components
- **Custom Controls**: Fine-tune simulation parameters

### Audio Features
- **Real-time Audio Controls**: Play, pause, volume control
- **Waveform Display**: Visual representation of audio data
- **Audio-reactive Animations**: Sync visuals with audio input

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

## 📁 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   └── pages/          # Application pages
├── server/                 # Backend Express server
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API route definitions
│   └── storage.ts         # Database operations
├── shared/                # Shared TypeScript schemas
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 16
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd <project-name>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file or use Replit Secrets:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/dbname
   NODE_ENV=development
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema changes
- `npm run db:generate` - Generate database migrations

## 🗄 Database Schema

### NFTs Table
```sql
- id: Primary key
- name: NFT collection name
- description: Collection description
- price: NFT price
- image_url: URL to NFT image
- creator_id: User who created the NFT
- owner_id: Current owner
- created_at: Creation timestamp
```

### Users Table
```sql
- id: Primary key
- username: User's display name
- email: User's email address
- wallet_address: Blockchain wallet address
- created_at: Registration timestamp
```

### Physics Simulations Table
```sql
- id: Primary key
- name: Simulation name
- parameters: JSON configuration
- user_id: Creator of the simulation
- created_at: Creation timestamp
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

## 🔧 Configuration

### Database Configuration
- **Development**: Uses Replit's PostgreSQL instance
- **Production**: Configure `DATABASE_URL` environment variable
- **Migrations**: Managed via Drizzle Kit

### Build Configuration
- **Client Build**: Vite builds to `dist/public`
- **Server Build**: ESBuild compiles to `dist/index.js`
- **Static Files**: Served from Express server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests and ensure build passes
5. Submit a pull request

## 📋 API Endpoints

### NFT Endpoints
- `GET /api/nfts` - Get all NFTs
- `POST /api/nfts` - Create new NFT
- `GET /api/nfts/:id` - Get specific NFT
- `PUT /api/nfts/:id` - Update NFT
- `DELETE /api/nfts/:id` - Delete NFT

### User Endpoints
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get specific user

### Physics Simulation Endpoints
- `GET /api/physics-simulations` - Get all simulations
- `POST /api/physics-simulations` - Create new simulation
- `GET /api/physics-simulations/:id` - Get specific simulation

## 🎨 UI Components

The project uses a comprehensive design system with:
- **Shadcn/ui** components for consistent styling
- **Radix UI** primitives for accessibility
- **Tailwind CSS** for custom styling
- **Responsive design** for all screen sizes

## 🔒 Security

- **Input validation** on all API endpoints
- **Environment variable** protection for sensitive data
- **CORS** configuration for secure cross-origin requests
- **Error handling** with appropriate HTTP status codes

## 📊 Performance

- **Code splitting** for optimal loading
- **Image optimization** for faster rendering
- **Database indexing** for quick queries
- **Caching strategies** with TanStack Query

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure `DATABASE_URL` is correctly set
   - Check PostgreSQL service is running

2. **Build Errors**
   - Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npx tsc --noEmit`

3. **Port Issues**
   - Ensure port 5000 is available
   - Check for conflicting processes

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, PostgreSQL
- **Infrastructure**: Replit, Drizzle ORM

---

*Built with ❤️ on Replit*
