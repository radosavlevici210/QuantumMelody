
/**
 * This software is not licensed for open-source or commercial usage.
 * Any use of this code is bound by a 51% royalty for past or future use.
 */

import { pgTable, serial, text, timestamp, integer, decimal, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Audio Tracks Table
export const audioTracks = pgTable("audio_tracks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  duration: integer("duration").notNull(), // in seconds
  frequency: decimal("frequency", { precision: 10, scale: 2 }),
  amplitude: decimal("amplitude", { precision: 10, scale: 2 }),
  waveformData: jsonb("waveform_data"),
  audioUrl: text("audio_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Physics Simulations Table
export const physicsSimulations = pgTable("physics_simulations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  particleCount: integer("particle_count").default(1000),
  particleDensity: decimal("particle_density", { precision: 5, scale: 2 }).default("1.0"),
  quantumField: text("quantum_field").default("stable"),
  parameters: jsonb("parameters"),
  audioTrackId: integer("audio_track_id"),
  isActive: boolean("is_active").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Cryptocurrency Tokens Table
export const cryptoTokens = pgTable("crypto_tokens", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  symbol: text("symbol").notNull(),
  description: text("description"),
  totalSupply: decimal("total_supply", { precision: 20, scale: 8 }).notNull(),
  initialPrice: decimal("initial_price", { precision: 10, scale: 8 }).default("0.01"),
  contractAddress: text("contract_address"),
  blockchain: text("blockchain").default("ethereum"),
  tokenStandard: text("token_standard").default("ERC-20"),
  metadata: jsonb("metadata"),
  audioTrackId: integer("audio_track_id"),
  physicsSimulationId: integer("physics_simulation_id"),
  isLaunched: boolean("is_launched").default(false),
  launchedAt: timestamp("launched_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Crypto Wallets Table
export const cryptoWallets = pgTable("crypto_wallets", {
  id: serial("id").primaryKey(),
  address: text("address").notNull().unique(),
  privateKey: text("private_key").notNull(),
  publicKey: text("public_key").notNull(),
  mnemonic: text("mnemonic"),
  blockchain: text("blockchain").default("ethereum").notNull(),
  balance: decimal("balance", { precision: 20, scale: 8 }).default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Transactions Table
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  hash: text("hash").notNull().unique(),
  fromAddress: text("from_address").notNull(),
  toAddress: text("to_address").notNull(),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  tokenId: integer("token_id"),
  blockchain: text("blockchain").default("ethereum").notNull(),
  status: text("status").default("pending").notNull(), // pending, confirmed, failed
  gasUsed: decimal("gas_used", { precision: 20, scale: 8 }),
  gasPrice: decimal("gas_price", { precision: 20, scale: 8 }),
  blockNumber: integer("block_number"),
  transactionType: text("transaction_type").default("transfer").notNull(), // transfer, exchange, mint
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Exchange Orders Table
export const exchangeOrders = pgTable("exchange_orders", {
  id: serial("id").primaryKey(),
  walletId: integer("wallet_id").notNull(),
  fromTokenId: integer("from_token_id").notNull(),
  toTokenId: integer("to_token_id").notNull(),
  fromAmount: decimal("from_amount", { precision: 20, scale: 8 }).notNull(),
  toAmount: decimal("to_amount", { precision: 20, scale: 8 }).notNull(),
  exchangeRate: decimal("exchange_rate", { precision: 20, scale: 8 }).notNull(),
  status: text("status").default("open").notNull(), // open, partial, filled, cancelled
  orderType: text("order_type").default("market").notNull(), // market, limit
  transactionId: integer("transaction_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Zod schemas for validation
export const insertAudioTrackSchema = createInsertSchema(audioTracks);
export const selectAudioTrackSchema = createSelectSchema(audioTracks);
export const insertPhysicsSimulationSchema = createInsertSchema(physicsSimulations);
export const selectPhysicsSimulationSchema = createSelectSchema(physicsSimulations);
export const insertCryptoTokenSchema = createInsertSchema(cryptoTokens);
export const selectCryptoTokenSchema = createSelectSchema(cryptoTokens);
export const insertCryptoWalletSchema = createInsertSchema(cryptoWallets);
export const selectCryptoWalletSchema = createSelectSchema(cryptoWallets);
export const insertTransactionSchema = createInsertSchema(transactions);
export const selectTransactionSchema = createSelectSchema(transactions);
export const insertExchangeOrderSchema = createInsertSchema(exchangeOrders);
export const selectExchangeOrderSchema = createSelectSchema(exchangeOrders);

// TypeScript types
export type InsertAudioTrack = z.infer<typeof insertAudioTrackSchema>;
export type AudioTrack = z.infer<typeof selectAudioTrackSchema>;
export type InsertPhysicsSimulation = z.infer<typeof insertPhysicsSimulationSchema>;
export type PhysicsSimulation = z.infer<typeof selectPhysicsSimulationSchema>;
export type InsertCryptoToken = z.infer<typeof insertCryptoTokenSchema>;
export type CryptoToken = z.infer<typeof selectCryptoTokenSchema>;
export type InsertCryptoWallet = z.infer<typeof insertCryptoWalletSchema>;
export type CryptoWallet = z.infer<typeof selectCryptoWalletSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = z.infer<typeof selectTransactionSchema>;
export type InsertExchangeOrder = z.infer<typeof insertExchangeOrderSchema>;
export type ExchangeOrder = z.infer<typeof selectExchangeOrderSchema>;
