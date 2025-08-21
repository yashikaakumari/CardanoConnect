import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const wallets = pgTable("wallets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  cardanoAddress: text("cardano_address").notNull().unique(),
  floAddress: text("flo_address"),
  privateKey: text("private_key").notNull(),
  publicKey: text("public_key").notNull(),
  mnemonic: text("mnemonic"),
  balance: decimal("balance", { precision: 18, scale: 6 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletId: varchar("wallet_id").references(() => wallets.id).notNull(),
  txHash: text("tx_hash").notNull().unique(),
  type: text("type").notNull(), // 'send', 'receive', 'stake', 'unstake'
  amount: decimal("amount", { precision: 18, scale: 6 }).notNull(),
  fee: decimal("fee", { precision: 18, scale: 6 }),
  fromAddress: text("from_address"),
  toAddress: text("to_address").notNull(),
  status: text("status").default("pending"), // 'pending', 'confirmed', 'failed'
  blockHeight: decimal("block_height"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const assets = pgTable("assets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletId: varchar("wallet_id").references(() => wallets.id).notNull(),
  policyId: text("policy_id").notNull(),
  assetName: text("asset_name").notNull(),
  displayName: text("display_name"),
  symbol: text("symbol"),
  decimals: decimal("decimals").default("0"),
  balance: decimal("balance", { precision: 18, scale: 6 }).default("0"),
  metadata: jsonb("metadata"),
});

export const insertWalletSchema = createInsertSchema(wallets).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertAssetSchema = createInsertSchema(assets).omit({
  id: true,
});

export type InsertWallet = z.infer<typeof insertWalletSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type InsertAsset = z.infer<typeof insertAssetSchema>;

export type Wallet = typeof wallets.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Asset = typeof assets.$inferSelect;
