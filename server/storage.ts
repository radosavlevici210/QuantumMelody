
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { audioTracks, physicsSimulations, nftCollections } from "@shared/schema";
import type { InsertAudioTrack, InsertPhysicsSimulation, InsertNftCollection } from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

export const storage = {
  // Audio Track operations
  async getAllAudioTracks() {
    try {
      return await db.select().from(audioTracks).orderBy(audioTracks.createdAt);
    } catch (error) {
      console.error("Failed to fetch audio tracks:", error);
      throw error;
    }
  },

  async getAudioTrack(id: number) {
    try {
      const result = await db.select().from(audioTracks).where(eq(audioTracks.id, id)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error(`Failed to fetch audio track ${id}:`, error);
      throw error;
    }
  },

  async createAudioTrack(data: InsertAudioTrack) {
    try {
      const result = await db.insert(audioTracks).values(data).returning();
      return result[0];
    } catch (error) {
      console.error("Failed to create audio track:", error);
      throw error;
    }
  },

  async updateAudioTrack(id: number, data: Partial<InsertAudioTrack>) {
    try {
      const result = await db.update(audioTracks).set(data).where(eq(audioTracks.id, id)).returning();
      return result[0] || null;
    } catch (error) {
      console.error(`Failed to update audio track ${id}:`, error);
      throw error;
    }
  },

  async deleteAudioTrack(id: number) {
    try {
      await db.delete(audioTracks).where(eq(audioTracks.id, id));
      return true;
    } catch (error) {
      console.error(`Failed to delete audio track ${id}:`, error);
      throw error;
    }
  },

  // Physics Simulation operations
  async getAllPhysicsSimulations() {
    try {
      return await db.select().from(physicsSimulations).orderBy(physicsSimulations.createdAt);
    } catch (error) {
      console.error("Failed to fetch physics simulations:", error);
      throw error;
    }
  },

  async getPhysicsSimulation(id: number) {
    try {
      const result = await db.select().from(physicsSimulations).where(eq(physicsSimulations.id, id)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error(`Failed to fetch physics simulation ${id}:`, error);
      throw error;
    }
  },

  async createPhysicsSimulation(data: InsertPhysicsSimulation) {
    try {
      const result = await db.insert(physicsSimulations).values(data).returning();
      return result[0];
    } catch (error) {
      console.error("Failed to create physics simulation:", error);
      throw error;
    }
  },

  async updatePhysicsSimulation(id: number, data: Partial<InsertPhysicsSimulation>) {
    try {
      const result = await db.update(physicsSimulations).set(data).where(eq(physicsSimulations.id, id)).returning();
      return result[0] || null;
    } catch (error) {
      console.error(`Failed to update physics simulation ${id}:`, error);
      throw error;
    }
  },

  async deletePhysicsSimulation(id: number) {
    try {
      await db.delete(physicsSimulations).where(eq(physicsSimulations.id, id));
      return true;
    } catch (error) {
      console.error(`Failed to delete physics simulation ${id}:`, error);
      throw error;
    }
  },

  // NFT Collection operations
  async getAllNFTs() {
    try {
      return await db.select().from(nftCollections).orderBy(nftCollections.createdAt);
    } catch (error) {
      console.error("Failed to fetch NFT collections:", error);
      throw error;
    }
  },

  async getNFT(id: number) {
    try {
      const result = await db.select().from(nftCollections).where(eq(nftCollections.id, id)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error(`Failed to fetch NFT collection ${id}:`, error);
      throw error;
    }
  },

  async createNFT(data: InsertNftCollection) {
    try {
      const result = await db.insert(nftCollections).values(data).returning();
      return result[0];
    } catch (error) {
      console.error("Failed to create NFT collection:", error);
      throw error;
    }
  },

  async updateNFT(id: number, data: Partial<InsertNftCollection>) {
    try {
      const result = await db.update(nftCollections).set(data).where(eq(nftCollections.id, id)).returning();
      return result[0] || null;
    } catch (error) {
      console.error(`Failed to update NFT collection ${id}:`, error);
      throw error;
    }
  },

  async deleteNFT(id: number) {
    try {
      await db.delete(nftCollections).where(eq(nftCollections.id, id));
      return true;
    } catch (error) {
      console.error(`Failed to delete NFT collection ${id}:`, error);
      throw error;
    }
  },

  // Health check
  async healthCheck() {
    try {
      await db.select().from(audioTracks).limit(1);
      return true;
    } catch (error) {
      console.error("Database health check failed:", error);
      return false;
    }
  }
};
