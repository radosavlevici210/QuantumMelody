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

// NFT Collections Table
export const nftCollections = pgTable("nft_collections", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  tokenId: text("token_id").unique(),
  contractAddress: text("contract_address"),
  metadata: jsonb("metadata"),
  audioTrackId: integer("audio_track_id"),
  physicsSimulationId: integer("physics_simulation_id"),
  mintedAt: timestamp("minted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Zod schemas for validation
export const insertAudioTrackSchema = createInsertSchema(audioTracks);
export const selectAudioTrackSchema = createSelectSchema(audioTracks);
export const insertPhysicsSimulationSchema = createInsertSchema(physicsSimulations);
export const selectPhysicsSimulationSchema = createSelectSchema(physicsSimulations);
export const insertNftCollectionSchema = createInsertSchema(nftCollections);
export const selectNftCollectionSchema = createSelectSchema(nftCollections);

// TypeScript types
export type InsertAudioTrack = z.infer<typeof insertAudioTrackSchema>;
export type AudioTrack = z.infer<typeof selectAudioTrackSchema>;
export type InsertPhysicsSimulation = z.infer<typeof insertPhysicsSimulationSchema>;
export type PhysicsSimulation = z.infer<typeof selectPhysicsSimulationSchema>;
export type InsertNftCollection = z.infer<typeof insertNftCollectionSchema>;
export type NftCollection = z.infer<typeof selectNftCollectionSchema>;