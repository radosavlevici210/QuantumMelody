
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAudioTrackSchema, insertPhysicsSimulationSchema, insertNftCollectionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", async (req, res) => {
    try {
      const dbHealth = await storage.healthCheck();
      res.json({ 
        status: "ok", 
        database: dbHealth ? "connected" : "disconnected",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Health check failed" });
    }
  });

  // Audio Track Routes
  // Audio Track Routes
  app.get("/api/tracks", async (req, res) => {
    try {
      const tracks = await storage.getAllAudioTracks();
      res.json(tracks);
    } catch (error) {
      console.error("Error fetching tracks:", error);
      res.status(500).json({ message: "Failed to fetch tracks" });
    }
  });

  app.get("/api/tracks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid track ID" });
      }
      const track = await storage.getAudioTrack(id);
      if (!track) {
        return res.status(404).json({ message: "Track not found" });
      }
      res.json(track);
    } catch (error) {
      console.error("Error fetching track:", error);
      res.status(500).json({ message: "Failed to fetch track" });
    }
  });

  app.post("/api/tracks", async (req, res) => {
    try {
      const validatedData = insertAudioTrackSchema.parse(req.body);
      const track = await storage.createAudioTrack(validatedData);
      res.status(201).json(track);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating track:", error);
      res.status(500).json({ message: "Failed to create track" });
    }
  });

  app.put("/api/tracks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid track ID" });
      }
      const validatedData = insertAudioTrackSchema.partial().parse(req.body);
      const track = await storage.updateAudioTrack(id, validatedData);
      if (!track) {
        return res.status(404).json({ message: "Track not found" });
      }
      res.json(track);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating track:", error);
      res.status(500).json({ message: "Failed to update track" });
    }
  });

  app.delete("/api/tracks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid track ID" });
      }
      await storage.deleteAudioTrack(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting track:", error);
      res.status(500).json({ message: "Failed to delete track" });
    }
  });

  // Physics Simulation Routes
  app.get("/api/simulations", async (req, res) => {
    try {
      const simulations = await storage.getAllPhysicsSimulations();
      res.json(simulations);
    } catch (error) {
      console.error("Error fetching simulations:", error);
      res.status(500).json({ message: "Failed to fetch simulations" });
    }
  });

  app.get("/api/simulations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid simulation ID" });
      }
      const simulation = await storage.getPhysicsSimulation(id);
      if (!simulation) {
        return res.status(404).json({ message: "Simulation not found" });
      }
      res.json(simulation);
    } catch (error) {
      console.error("Error fetching simulation:", error);
      res.status(500).json({ message: "Failed to fetch simulation" });
    }
  });

  app.post("/api/simulations", async (req, res) => {
    try {
      const validatedData = insertPhysicsSimulationSchema.parse(req.body);
      const simulation = await storage.createPhysicsSimulation(validatedData);
      res.status(201).json(simulation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating simulation:", error);
      res.status(500).json({ message: "Failed to create simulation" });
    }
  });

  app.put("/api/simulations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid simulation ID" });
      }
      const validatedData = insertPhysicsSimulationSchema.partial().parse(req.body);
      const simulation = await storage.updatePhysicsSimulation(id, validatedData);
      if (!simulation) {
        return res.status(404).json({ message: "Simulation not found" });
      }
      res.json(simulation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating simulation:", error);
      res.status(500).json({ message: "Failed to update simulation" });
    }
  });

  app.delete("/api/simulations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid simulation ID" });
      }
      await storage.deletePhysicsSimulation(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting simulation:", error);
      res.status(500).json({ message: "Failed to delete simulation" });
    }
  });

  // NFT Collection Routes
  app.get("/api/nfts", async (req, res) => {
    try {
      const nfts = await storage.getAllNFTs();
      res.json(nfts);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      res.status(500).json({ message: "Failed to fetch NFTs" });
    }
  });

  app.get("/api/nfts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid NFT ID" });
      }
      const nft = await storage.getNFT(id);
      if (!nft) {
        return res.status(404).json({ message: "NFT not found" });
      }
      res.json(nft);
    } catch (error) {
      console.error("Error fetching NFT:", error);
      res.status(500).json({ message: "Failed to fetch NFT" });
    }
  });

  app.post("/api/nfts", async (req, res) => {
    try {
      const validatedData = insertNftCollectionSchema.parse(req.body);
      const nft = await storage.createNFT(validatedData);
      res.status(201).json(nft);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating NFT:", error);
      res.status(500).json({ message: "Failed to create NFT" });
    }
  });

  app.put("/api/nfts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid NFT ID" });
      }
      const validatedData = insertNftCollectionSchema.partial().parse(req.body);
      const nft = await storage.updateNFT(id, validatedData);
      if (!nft) {
        return res.status(404).json({ message: "NFT not found" });
      }
      res.json(nft);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating NFT:", error);
      res.status(500).json({ message: "Failed to update NFT" });
    }
  });

  app.delete("/api/nfts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid NFT ID" });
      }
      await storage.deleteNFT(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting NFT:", error);
      res.status(500).json({ message: "Failed to delete NFT" });
    }
  });

  return createServer(app);

  app.post("/api/tracks", async (req, res) => {
    try {
      const trackData = insertAudioTrackSchema.parse(req.body);
      const track = await storage.createAudioTrack(trackData);
      res.status(201).json(track);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid track data", errors: error.errors });
      } else {
        console.error("Error creating track:", error);
        res.status(500).json({ message: "Failed to create track" });
      }
    }
  });

  app.get("/api/tracks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid track ID" });
      }
      
      const track = await storage.getAudioTrack(id);
      if (!track) {
        return res.status(404).json({ message: "Track not found" });
      }
      
      res.json(track);
    } catch (error) {
      console.error("Error fetching track:", error);
      res.status(500).json({ message: "Failed to fetch track" });
    }
  });

  app.put("/api/tracks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid track ID" });
      }
      
      const trackData = insertAudioTrackSchema.partial().parse(req.body);
      const track = await storage.updateAudioTrack(id, trackData);
      
      if (!track) {
        return res.status(404).json({ message: "Track not found" });
      }
      
      res.json(track);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid track data", errors: error.errors });
      } else {
        console.error("Error updating track:", error);
        res.status(500).json({ message: "Failed to update track" });
      }
    }
  });

  app.delete("/api/tracks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid track ID" });
      }
      
      await storage.deleteAudioTrack(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting track:", error);
      res.status(500).json({ message: "Failed to delete track" });
    }
  });

  // Physics Simulation Routes
  app.get("/api/simulations", async (req, res) => {
    try {
      const simulations = await storage.getAllPhysicsSimulations();
      res.json(simulations);
    } catch (error) {
      console.error("Error fetching simulations:", error);
      res.status(500).json({ message: "Failed to fetch simulations" });
    }
  });

  app.post("/api/simulations", async (req, res) => {
    try {
      const simulationData = insertPhysicsSimulationSchema.parse(req.body);
      const simulation = await storage.createPhysicsSimulation(simulationData);
      res.status(201).json(simulation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid simulation data", errors: error.errors });
      } else {
        console.error("Error creating simulation:", error);
        res.status(500).json({ message: "Failed to create simulation" });
      }
    }
  });

  app.get("/api/simulations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid simulation ID" });
      }
      
      const simulation = await storage.getPhysicsSimulation(id);
      if (!simulation) {
        return res.status(404).json({ message: "Simulation not found" });
      }
      
      res.json(simulation);
    } catch (error) {
      console.error("Error fetching simulation:", error);
      res.status(500).json({ message: "Failed to fetch simulation" });
    }
  });

  app.put("/api/simulations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid simulation ID" });
      }
      
      const simulationData = insertPhysicsSimulationSchema.partial().parse(req.body);
      const simulation = await storage.updatePhysicsSimulation(id, simulationData);
      
      if (!simulation) {
        return res.status(404).json({ message: "Simulation not found" });
      }
      
      res.json(simulation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid simulation data", errors: error.errors });
      } else {
        console.error("Error updating simulation:", error);
        res.status(500).json({ message: "Failed to update simulation" });
      }
    }
  });

  app.delete("/api/simulations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid simulation ID" });
      }
      
      await storage.deletePhysicsSimulation(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting simulation:", error);
      res.status(500).json({ message: "Failed to delete simulation" });
    }
  });

  // NFT Collection Routes
  app.get("/api/nfts", async (req, res) => {
    try {
      const nfts = await storage.getAllNFTs();
      res.json(nfts);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      res.status(500).json({ message: "Failed to fetch NFTs" });
    }
  });

  app.post("/api/nfts", async (req, res) => {
    try {
      const nftData = insertNftCollectionSchema.parse(req.body);
      const nft = await storage.createNFT(nftData);
      res.status(201).json(nft);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid NFT data", errors: error.errors });
      } else {
        console.error("Error creating NFT:", error);
        res.status(500).json({ message: "Failed to create NFT" });
      }
    }
  });

  app.get("/api/nfts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid NFT ID" });
      }
      
      const nft = await storage.getNFT(id);
      if (!nft) {
        return res.status(404).json({ message: "NFT not found" });
      }
      
      res.json(nft);
    } catch (error) {
      console.error("Error fetching NFT:", error);
      res.status(500).json({ message: "Failed to fetch NFT" });
    }
  });

  app.put("/api/nfts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid NFT ID" });
      }
      
      const nftData = insertNftCollectionSchema.partial().parse(req.body);
      const nft = await storage.updateNFT(id, nftData);
      
      if (!nft) {
        return res.status(404).json({ message: "NFT not found" });
      }
      
      res.json(nft);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid NFT data", errors: error.errors });
      } else {
        console.error("Error updating NFT:", error);
        res.status(500).json({ message: "Failed to update NFT" });
      }
    }
  });

  app.delete("/api/nfts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid NFT ID" });
      }
      
      await storage.deleteNFT(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting NFT:", error);
      res.status(500).json({ message: "Failed to delete NFT" });
    }
  });

  // AI Assistant Enhanced Endpoint
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, context } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }
      
      // Enhanced AI responses based on context
      const responses = {
        audio: [
          "Analyzing quantum frequencies... I recommend adjusting the resonance to 432Hz for optimal particle alignment.",
          "Your current waveform shows interesting quantum interference patterns. Try increasing the entropy parameter.",
          "The harmonic analysis suggests adding more complexity to the particle system for better musical depth."
        ],
        physics: [
          "Based on the quantum field analysis, I suggest exploring the plasma-purple frequency range.",
          "Excellent quantum resonance detected! The particles are dancing in perfect harmony.",
          "Try adjusting the wave function to create more dynamic particle interactions."
        ],
        nft: [
          "This audio-physics combination would make an excellent NFT. The quantum properties are unique.",
          "The marketplace value for this type of quantum music NFT is trending upward.",
          "Consider adding more metadata to increase the NFT's discoverability."
        ],
        general: [
          "How can I assist you with your quantum music creation today?",
          "I'm here to help optimize your audio-physics simulations.",
          "Let me analyze your current project parameters."
        ]
      };
      
      const contextType = context?.type || 'general';
      const contextResponses = responses[contextType as keyof typeof responses] || responses.general;
      const response = contextResponses[Math.floor(Math.random() * contextResponses.length)];
      
      res.json({ 
        message: response,
        timestamp: new Date().toISOString(),
        context: contextType
      });
    } catch (error) {
      console.error("Error in AI chat:", error);
      res.status(500).json({ message: "AI Assistant temporarily unavailable" });
    }
  });

  // VR/AR Session Enhanced Endpoints
  app.post("/api/vr/session", async (req, res) => {
    try {
      const { type, config } = req.body;
      
      if (!type) {
        return res.status(400).json({ message: "Session type is required" });
      }
      
      const validTypes = ["3d-studio", "ar-composer", "vr-physics"];
      if (!validTypes.includes(type)) {
        return res.status(400).json({ message: "Invalid session type" });
      }
      
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      res.json({
        sessionId,
        type,
        status: "active",
        startTime: new Date().toISOString(),
        duration: "00:00:00",
        config: config || {}
      });
    } catch (error) {
      console.error("Error starting VR/AR session:", error);
      res.status(500).json({ message: "Failed to start VR/AR session" });
    }
  });

  app.get("/api/vr/session/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      // Mock session data - in production, this would come from a session store
      const startTime = new Date(Date.now() - Math.random() * 60 * 60 * 1000); // Random session within last hour
      const duration = Math.floor((Date.now() - startTime.getTime()) / 1000);
      const hours = Math.floor(duration / 3600);
      const minutes = Math.floor((duration % 3600) / 60);
      const seconds = duration % 60;
      
      res.json({
        sessionId,
        type: "vr-physics",
        status: "active",
        startTime: startTime.toISOString(),
        duration: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      });
    } catch (error) {
      console.error("Error getting VR/AR session:", error);
      res.status(500).json({ message: "Failed to get session status" });
    }
  });

  app.delete("/api/vr/session/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      // Mock session termination
      res.json({
        sessionId,
        status: "terminated",
        endTime: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error ending VR/AR session:", error);
      res.status(500).json({ message: "Failed to end session" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
