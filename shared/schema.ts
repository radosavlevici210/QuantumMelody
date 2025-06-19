
import { pgTable, serial, text, timestamp, integer, numeric, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Audio Tracks Table
export const audioTracks = pgTable("audio_tracks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  duration: numeric("duration").notNull(), // in seconds
  fileUrl: text("file_url").notNull(),
  waveformData: jsonb("waveform_data"), // Store waveform visualization data
  bpm: integer("bpm"),
  key: text("key"), // Musical key
  genre: text("genre"),
  tags: jsonb("tags").$type<string[]>().default([]),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Physics Simulations Table
export const physicsSimulations = pgTable("physics_simulations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  particleCount: integer("particle_count").default(1000),
  energyLevel: numeric("energy_level").default("50"), // 0-100
  entropyLevel: numeric("entropy_level").default("25"), // 0-100
  waveFunction: text("wave_function").default("sine"), // sine, cosine, square, etc.
  colorScheme: text("color_scheme").default("quantum"), // quantum, plasma, fire, etc.
  audioTrackId: integer("audio_track_id").references(() => audioTracks.id),
  simulationData: jsonb("simulation_data"), // Store simulation parameters
  isActive: boolean("is_active").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// NFT Collections Table
export const nftCollections = pgTable("nft_collections", {
  id: serial("id").primaryKey(),
  tokenId: text("token_id").unique(),
  contractAddress: text("contract_address"),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  audioTrackId: integer("audio_track_id").references(() => audioTracks.id),
  physicsSimulationId: integer("physics_simulation_id").references(() => physicsSimulations.id),
  price: numeric("price"), // in ETH or other cryptocurrency
  currency: text("currency").default("ETH"),
  isListed: boolean("is_listed").default(false),
  ownerAddress: text("owner_address"),
  metadata: jsonb("metadata"), // Additional NFT metadata
  royaltyPercentage: numeric("royalty_percentage").default("5"), // Creator royalty %
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Zod schemas for validation
export const insertAudioTrackSchema = createInsertSchema(audioTracks, {
  title: z.string().min(1, "Title is required").max(200),
  artist: z.string().min(1, "Artist is required").max(100),
  duration: z.string().regex(/^\d+(\.\d+)?$/, "Duration must be a valid number"),
  fileUrl: z.string().url("Valid file URL is required"),
  bpm: z.number().int().min(60).max(200).optional(),
  key: z.string().max(10).optional(),
  genre: z.string().max(50).optional(),
});

export const insertPhysicsSimulationSchema = createInsertSchema(physicsSimulations, {
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  particleCount: z.number().int().min(100).max(10000).optional(),
  energyLevel: z.string().regex(/^\d+(\.\d+)?$/, "Energy level must be a valid number"),
  entropyLevel: z.string().regex(/^\d+(\.\d+)?$/, "Entropy level must be a valid number"),
  waveFunction: z.enum(["sine", "cosine", "square", "triangle", "sawtooth"]).optional(),
  colorScheme: z.enum(["quantum", "plasma", "fire", "ice", "rainbow"]).optional(),
});

export const insertNftCollectionSchema = createInsertSchema(nftCollections, {
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(1000).optional(),
  imageUrl: z.string().url().optional(),
  price: z.string().regex(/^\d+(\.\d+)?$/, "Price must be a valid number").optional(),
  currency: z.string().max(10).optional(),
  ownerAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address").optional(),
  royaltyPercentage: z.string().regex(/^\d+(\.\d+)?$/, "Royalty must be a valid number").optional(),
});

// TypeScript types
export type AudioTrack = typeof audioTracks.$inferSelect;
export type InsertAudioTrack = typeof audioTracks.$inferInsert;
export type PhysicsSimulation = typeof physicsSimulations.$inferSelect;
export type InsertPhysicsSimulation = typeof physicsSimulations.$inferInsert;
export type NftCollection = typeof nftCollections.$inferSelect;
export type InsertNftCollection = typeof nftCollections.$inferInsert;
