# Quantum Audio NFT Platform

## Overview

This is a full-stack web application that combines quantum physics simulations with audio processing and NFT creation. The platform allows users to create and manipulate audio tracks with quantum-inspired physics effects, visualize audio waveforms, and mint NFTs from their creations.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for the user interface
- **Vite** as the build tool and development server
- **Tailwind CSS** with shadcn/ui components for styling
- **Wouter** for client-side routing
- **TanStack Query** for server state management
- **Three.js** for 3D particle visualizations
- **Web Audio API** for real-time audio processing

### Backend Architecture
- **Express.js** server with TypeScript
- **RESTful API** design for audio tracks, physics simulations, and NFT collections
- **Drizzle ORM** for database interactions
- **PostgreSQL** as the primary database (configured but can be provisioned)
- **In-memory storage** fallback for development

### Database Schema
The application uses four main entities:
- **Users**: Authentication and user management
- **Audio Tracks**: Store audio files with metadata (title, duration, BPM, key, genre)
- **Physics Simulations**: Quantum physics parameters and particle configurations
- **NFT Collection**: Tokenized audio tracks with pricing and listing status

## Key Components

### Audio Processing System
- Real-time audio visualization with waveform display
- Web Audio API integration for frequency analysis
- Audio controls for playback, recording, and manipulation
- Support for various audio formats and metadata extraction

### Quantum Physics Simulation
- 3D particle systems with quantum-inspired behaviors
- Configurable parameters (particle count, energy, entropy)
- Interactive visualizations responding to audio input
- Custom particle behaviors based on wave functions

### NFT Integration
- Audio track tokenization system
- Marketplace functionality for listing and pricing
- Integration points for blockchain connectivity
- Metadata association between audio and NFT properties

### UI/UX System
- Modern dark theme with quantum-inspired color palette
- Responsive design with mobile-first approach
- Interactive sliders and controls for real-time parameter adjustment
- Particle background effects synchronized with audio

## Data Flow

1. **Audio Input**: Users upload or record audio tracks through the web interface
2. **Processing**: Audio data is analyzed for frequency, amplitude, and waveform characteristics
3. **Physics Simulation**: Audio parameters drive quantum particle behaviors and visualizations
4. **Storage**: Audio metadata, waveform data, and physics parameters are stored in the database
5. **NFT Creation**: Processed audio tracks can be minted as NFTs with associated metadata
6. **Real-time Updates**: TanStack Query manages state synchronization between client and server

## External Dependencies

### Frontend Dependencies
- **Three.js**: 3D graphics and particle system rendering
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **Date-fns**: Date manipulation utilities
- **Embla Carousel**: Carousel component functionality

### Backend Dependencies
- **Neon Database**: Serverless PostgreSQL provider
- **Drizzle Kit**: Database migration and schema management
- **Connect-pg-simple**: PostgreSQL session store
- **Zod**: Schema validation library

### Development Tools
- **ESBuild**: Fast JavaScript bundler for production builds
- **TSX**: TypeScript execution environment
- **Replit integrations**: Development environment optimizations

## Deployment Strategy

### Development Environment
- Runs on port 5000 with hot reloading
- Vite dev server with React Fast Refresh
- In-memory storage for rapid prototyping
- TypeScript compilation with strict mode enabled

### Production Build
- Vite builds optimized client bundle to `dist/public`
- ESBuild compiles server code to `dist/index.js`
- Static file serving from the Express server
- Database migrations via Drizzle Kit

### Database Configuration
- PostgreSQL 16 configured in Replit environment
- Drizzle ORM with schema-first development
- Migration system for database versioning
- Environment variable configuration for database URL

### Deployment Target
- Replit autoscale deployment
- Port 80 external mapping from internal port 5000
- Parallel workflow execution for development and production

## Changelog
- June 19, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.