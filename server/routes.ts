import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAudioTrackSchema, insertPhysicsSimulationSchema, insertCryptoTokenSchema } from "@shared/schema";
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

  // Crypto Token Routes
  app.get("/api/crypto", async (req, res) => {
    try {
      const tokens = await storage.getAllCryptoTokens();
      res.json(tokens);
    } catch (error) {
      console.error("Error fetching crypto tokens:", error);
      res.status(500).json({ message: "Failed to fetch crypto tokens" });
    }
  });

  app.get("/api/crypto/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid token ID" });
      }
      const token = await storage.getCryptoToken(id);
      if (!token) {
        return res.status(404).json({ message: "Token not found" });
      }
      res.json(token);
    } catch (error) {
      console.error("Error fetching crypto token:", error);
      res.status(500).json({ message: "Failed to fetch crypto token" });
    }
  });

  app.post("/api/crypto", async (req, res) => {
    try {
      const validatedData = insertCryptoTokenSchema.parse(req.body);
      const token = await storage.createCryptoToken(validatedData);
      res.status(201).json(token);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating crypto token:", error);
      res.status(500).json({ message: "Failed to create crypto token" });
    }
  });

  app.put("/api/crypto/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid token ID" });
      }
      const validatedData = insertCryptoTokenSchema.partial().parse(req.body);
      const token = await storage.updateCryptoToken(id, validatedData);
      if (!token) {
        return res.status(404).json({ message: "Token not found" });
      }
      res.json(token);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating crypto token:", error);
      res.status(500).json({ message: "Failed to update crypto token" });
    }
  });

  app.delete("/api/crypto/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid token ID" });
      }
      await storage.deleteCryptoToken(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting crypto token:", error);
      res.status(500).json({ message: "Failed to delete crypto token" });
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
          "Analyzing quantum frequencies... I recommend adjusting the resonance to 432Hz for optimal blockchain integration.",
          "Your current waveform shows interesting patterns. Try increasing the entropy parameter for better token generation.",
          "The harmonic analysis suggests adding more complexity to create unique crypto token attributes."
        ],
        physics: [
          "Based on the quantum field analysis, I suggest exploring the plasma-purple frequency range for token generation.",
          "Excellent quantum resonance detected! The particles are creating perfect crypto hash patterns.",
          "Try adjusting the wave function to create more dynamic blockchain integration."
        ],
        crypto: [
          "This audio-physics combination would make an excellent cryptocurrency. The quantum properties are unique.",
          "The market conditions for this type of quantum-based token are trending upward.",
          "Consider adding more technical parameters to increase the token's utility and value."
        ],
        general: [
          "How can I assist you with your quantum crypto creation today?",
          "I'm here to help optimize your audio-physics blockchain integrations.",
          "Let me analyze your current token parameters."
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

  // Blockchain Integration Endpoints
  app.post("/api/blockchain/deploy", async (req, res) => {
    try {
      const { tokenId, blockchain = "ethereum" } = req.body;

      if (!tokenId) {
        return res.status(400).json({ message: "Token ID is required" });
      }

      const token = await storage.getCryptoToken(tokenId);
      if (!token) {
        return res.status(404).json({ message: "Token not found" });
      }

      // Mock blockchain deployment
      const contractAddress = `0x${Math.random().toString(16).substr(2, 40)}`;

      await storage.updateCryptoToken(tokenId, {
        contractAddress,
        isLaunched: true,
        launchedAt: new Date()
      });

      res.json({
        success: true,
        contractAddress,
        blockchain,
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        deployedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error deploying to blockchain:", error);
      res.status(500).json({ message: "Failed to deploy token to blockchain" });
    }
  });

  app.get("/api/blockchain/status/:tokenId", async (req, res) => {
    try {
      const tokenId = parseInt(req.params.tokenId);
      if (isNaN(tokenId)) {
        return res.status(400).json({ message: "Invalid token ID" });
      }

      const token = await storage.getCryptoToken(tokenId);
      if (!token) {
        return res.status(404).json({ message: "Token not found" });
      }

      res.json({
        tokenId,
        deployed: token.isLaunched,
        contractAddress: token.contractAddress,
        blockchain: token.blockchain,
        launchedAt: token.launchedAt,
        totalSupply: token.totalSupply,
        currentPrice: token.initialPrice
      });
    } catch (error) {
      console.error("Error getting blockchain status:", error);
      res.status(500).json({ message: "Failed to get blockchain status" });
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