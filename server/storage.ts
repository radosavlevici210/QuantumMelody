
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { audioTracks, physicsSimulations, cryptoTokens, cryptoWallets, transactions, exchangeOrders } from "@shared/schema";
import type { InsertAudioTrack, InsertPhysicsSimulation, InsertCryptoToken, InsertCryptoWallet, InsertTransaction, InsertExchangeOrder } from "@shared/schema";

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

  // Crypto Token operations
  async getAllCryptoTokens() {
    try {
      return await db.select().from(cryptoTokens).orderBy(cryptoTokens.createdAt);
    } catch (error) {
      console.error("Failed to fetch crypto tokens:", error);
      throw error;
    }
  },

  async getCryptoToken(id: number) {
    try {
      const result = await db.select().from(cryptoTokens).where(eq(cryptoTokens.id, id)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error(`Failed to fetch crypto token ${id}:`, error);
      throw error;
    }
  },

  async createCryptoToken(data: InsertCryptoToken) {
    try {
      const result = await db.insert(cryptoTokens).values(data).returning();
      return result[0];
    } catch (error) {
      console.error("Failed to create crypto token:", error);
      throw error;
    }
  },

  async updateCryptoToken(id: number, data: Partial<InsertCryptoToken>) {
    try {
      const result = await db.update(cryptoTokens).set(data).where(eq(cryptoTokens.id, id)).returning();
      return result[0] || null;
    } catch (error) {
      console.error(`Failed to update crypto token ${id}:`, error);
      throw error;
    }
  },

  async deleteCryptoToken(id: number) {
    try {
      await db.delete(cryptoTokens).where(eq(cryptoTokens.id, id));
      return true;
    } catch (error) {
      console.error(`Failed to delete crypto token ${id}:`, error);
      throw error;
    }
  },

  // Crypto Wallet operations
  async getAllCryptoWallets() {
    try {
      return await db.select().from(cryptoWallets).orderBy(cryptoWallets.createdAt);
    } catch (error) {
      console.error("Failed to fetch crypto wallets:", error);
      throw error;
    }
  },

  async getCryptoWallet(id: number) {
    try {
      const result = await db.select().from(cryptoWallets).where(eq(cryptoWallets.id, id)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error(`Failed to fetch crypto wallet ${id}:`, error);
      throw error;
    }
  },

  async getCryptoWalletByAddress(address: string) {
    try {
      const result = await db.select().from(cryptoWallets).where(eq(cryptoWallets.address, address)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error(`Failed to fetch crypto wallet with address ${address}:`, error);
      throw error;
    }
  },

  async createCryptoWallet(data: InsertCryptoWallet) {
    try {
      const result = await db.insert(cryptoWallets).values(data).returning();
      return result[0];
    } catch (error) {
      console.error("Failed to create crypto wallet:", error);
      throw error;
    }
  },

  async updateCryptoWallet(id: number, data: Partial<InsertCryptoWallet>) {
    try {
      const result = await db.update(cryptoWallets).set(data).where(eq(cryptoWallets.id, id)).returning();
      return result[0] || null;
    } catch (error) {
      console.error(`Failed to update crypto wallet ${id}:`, error);
      throw error;
    }
  },

  async deleteCryptoWallet(id: number) {
    try {
      await db.delete(cryptoWallets).where(eq(cryptoWallets.id, id));
      return true;
    } catch (error) {
      console.error(`Failed to delete crypto wallet ${id}:`, error);
      throw error;
    }
  },

  // Transaction operations
  async getAllTransactions() {
    try {
      return await db.select().from(transactions).orderBy(transactions.createdAt);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      throw error;
    }
  },

  async getTransaction(id: number) {
    try {
      const result = await db.select().from(transactions).where(eq(transactions.id, id)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error(`Failed to fetch transaction ${id}:`, error);
      throw error;
    }
  },

  async getTransactionByHash(hash: string) {
    try {
      const result = await db.select().from(transactions).where(eq(transactions.hash, hash)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error(`Failed to fetch transaction with hash ${hash}:`, error);
      throw error;
    }
  },

  async createTransaction(data: InsertTransaction) {
    try {
      const result = await db.insert(transactions).values(data).returning();
      return result[0];
    } catch (error) {
      console.error("Failed to create transaction:", error);
      throw error;
    }
  },

  async updateTransaction(id: number, data: Partial<InsertTransaction>) {
    try {
      const result = await db.update(transactions).set(data).where(eq(transactions.id, id)).returning();
      return result[0] || null;
    } catch (error) {
      console.error(`Failed to update transaction ${id}:`, error);
      throw error;
    }
  },

  // Exchange Order operations
  async getAllExchangeOrders() {
    try {
      return await db.select().from(exchangeOrders).orderBy(exchangeOrders.createdAt);
    } catch (error) {
      console.error("Failed to fetch exchange orders:", error);
      throw error;
    }
  },

  async getExchangeOrder(id: number) {
    try {
      const result = await db.select().from(exchangeOrders).where(eq(exchangeOrders.id, id)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error(`Failed to fetch exchange order ${id}:`, error);
      throw error;
    }
  },

  async createExchangeOrder(data: InsertExchangeOrder) {
    try {
      const result = await db.insert(exchangeOrders).values(data).returning();
      return result[0];
    } catch (error) {
      console.error("Failed to create exchange order:", error);
      throw error;
    }
  },

  async updateExchangeOrder(id: number, data: Partial<InsertExchangeOrder>) {
    try {
      const result = await db.update(exchangeOrders).set(data).where(eq(exchangeOrders.id, id)).returning();
      return result[0] || null;
    } catch (error) {
      console.error(`Failed to update exchange order ${id}:`, error);
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
