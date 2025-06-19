import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAudioTrackSchema, insertPhysicsSimulationSchema, insertNftCollectionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Audio Track Routes
  app.get("/api/tracks", async (req, res) => {
    try {
      const tracks = await storage.getAllAudioTracks();
      res.json(tracks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tracks" });
    }
  });

  app.post("/api/tracks", async (req, res) => {
    try {
      const trackData = insertAudioTrackSchema.parse(req.body);
      const track = await storage.createAudioTrack(trackData);
      res.json(track);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid track data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create track" });
      }
    }
  });

  app.get("/api/tracks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const track = await storage.getAudioTrack(id);
      
      if (!track) {
        return res.status(404).json({ message: "Track not found" });
      }
      
      res.json(track);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch track" });
    }
  });

  // Physics Simulation Routes
  app.get("/api/simulations", async (req, res) => {
    try {
      const simulations = await storage.getAllPhysicsSimulations();
      res.json(simulations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch simulations" });
    }
  });

  app.post("/api/simulations", async (req, res) => {
    try {
      const simulationData = insertPhysicsSimulationSchema.parse(req.body);
      const simulation = await storage.createPhysicsSimulation(simulationData);
      res.json(simulation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid simulation data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create simulation" });
      }
    }
  });

  // NFT Collection Routes
  app.get("/api/nfts", async (req, res) => {
    try {
      const nfts = await storage.getAllNFTs();
      res.json(nfts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch NFTs" });
    }
  });

  app.post("/api/nfts", async (req, res) => {
    try {
      const nftData = insertNftCollectionSchema.parse(req.body);
      const nft = await storage.createNFT(nftData);
      res.json(nft);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid NFT data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create NFT" });
      }
    }
  });

  // AI Assistant Mock Endpoint
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message } = req.body;
      
      // Mock AI responses for quantum music generation
      const responses = [
        "Analyzing quantum frequencies... I recommend adjusting the resonance to 432Hz for optimal particle alignment.",
        "Your current waveform shows interesting quantum interference patterns. Try increasing the entropy parameter.",
        "Based on the harmonic analysis, I suggest adding more chaos to the particle system for better musical complexity.",
        "The quantum field is responding well to your creative input. Consider exploring the plasma-purple frequency range.",
        "Excellent quantum resonance detected! The particles are dancing in perfect harmony with your composition."
      ];
      
      const response = responses[Math.floor(Math.random() * responses.length)];
      
      res.json({ 
        message: response,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ message: "AI Assistant temporarily unavailable" });
    }
  });

  // VR/AR Session Mock Endpoints
  app.post("/api/vr/session", async (req, res) => {
    try {
      const { type } = req.body; // "3d-studio", "ar-composer", "vr-physics"
      
      res.json({
        sessionId: `session_${Date.now()}`,
        type,
        status: "active",
        startTime: new Date().toISOString(),
        duration: "00:00:00"
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to start VR/AR session" });
    }
  });

  app.get("/api/vr/session/status", async (req, res) => {
    try {
      // Mock active session
      res.json({
        sessionId: "session_active_001",
        type: "vr-physics",
        status: "active",
        startTime: new Date(Date.now() - 23 * 60 * 1000 - 45 * 1000).toISOString(),
        duration: "00:23:45"
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get session status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
