import { pgTable, text, serial, integer, boolean, timestamp, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const audioTracks = pgTable("audio_tracks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  duration: real("duration").notNull(),
  bpm: integer("bpm"),
  key: text("key"),
  genre: text("genre"),
  audioData: text("audio_data"), // Base64 encoded audio
  waveformData: jsonb("waveform_data"), // Array of amplitude values
  quantumParameters: jsonb("quantum_parameters"), // Physics simulation parameters
  createdAt: timestamp("created_at").defaultNow(),
});

export const physicsSimulations = pgTable("physics_simulations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  particleCount: integer("particle_count").default(30),
  energy: real("energy").default(3.14),
  entropy: real("entropy").default(42),
  waveFunction: text("wave_function").default("Ψ"),
  parameters: jsonb("parameters"), // Physics parameters
  createdAt: timestamp("created_at").defaultNow(),
});

export const nftCollection = pgTable("nft_collection", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  trackId: integer("track_id").references(() => audioTracks.id),
  name: text("name").notNull(),
  description: text("description"),
  price: real("price"),
  tokenId: text("token_id"),
  isListed: boolean("is_listed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertAudioTrackSchema = createInsertSchema(audioTracks).omit({
  id: true,
  createdAt: true,
});

export const insertPhysicsSimulationSchema = createInsertSchema(physicsSimulations).omit({
  id: true,
  createdAt: true,
});

export const insertNftCollectionSchema = createInsertSchema(nftCollection).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertAudioTrack = z.infer<typeof insertAudioTrackSchema>;
export type AudioTrack = typeof audioTracks.$inferSelect;

export type InsertPhysicsSimulation = z.infer<typeof insertPhysicsSimulationSchema>;
export type PhysicsSimulation = typeof physicsSimulations.$inferSelect;

export type InsertNftCollection = z.infer<typeof insertNftCollectionSchema>;
export type NftCollection = typeof nftCollection.$inferSelect;
