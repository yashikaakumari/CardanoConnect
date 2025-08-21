import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWalletSchema, insertTransactionSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Wallet routes
  app.get("/api/wallets", async (req, res) => {
    try {
      const wallets = await storage.getAllWallets();
      res.json(wallets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wallets" });
    }
  });

  app.get("/api/wallets/:id", async (req, res) => {
    try {
      const wallet = await storage.getWallet(req.params.id);
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }
      res.json(wallet);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wallet" });
    }
  });

  app.post("/api/wallets", async (req, res) => {
    try {
      const validation = insertWalletSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: fromZodError(validation.error).toString() 
        });
      }

      const wallet = await storage.createWallet(validation.data);
      res.status(201).json(wallet);
    } catch (error) {
      res.status(500).json({ message: "Failed to create wallet" });
    }
  });

  app.get("/api/wallets/address/:address", async (req, res) => {
    try {
      const wallet = await storage.getWalletByAddress(req.params.address);
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }
      res.json(wallet);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wallet" });
    }
  });

  // Transaction routes
  app.get("/api/wallets/:walletId/transactions", async (req, res) => {
    try {
      const transactions = await storage.getTransactionsByWallet(req.params.walletId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.get("/api/address/:address/transactions", async (req, res) => {
    try {
      const transactions = await storage.getTransactionsByAddress(req.params.address);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const validation = insertTransactionSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: fromZodError(validation.error).toString() 
        });
      }

      const transaction = await storage.createTransaction(validation.data);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  // Asset routes
  app.get("/api/wallets/:walletId/assets", async (req, res) => {
    try {
      const assets = await storage.getAssetsByWallet(req.params.walletId);
      res.json(assets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assets" });
    }
  });

  // Cardano blockchain integration routes
  app.post("/api/cardano/send", async (req, res) => {
    try {
      const { fromAddress, toAddress, amount, walletId } = req.body;
      
      // TODO: Implement actual Cardano transaction submission using Mesh.js
      // For now, create a pending transaction record
      const transaction = await storage.createTransaction({
        walletId,
        txHash: `pending_${Date.now()}`,
        type: "send",
        amount,
        fromAddress,
        toAddress,
        status: "pending"
      });

      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to send transaction" });
    }
  });

  app.get("/api/cardano/address/:address/balance", async (req, res) => {
    try {
      // TODO: Implement actual Cardano balance fetching using Mesh.js
      // For now, return mock balance
      res.json({ 
        address: req.params.address,
        balance: "1247850000", // in lovelace
        assets: []
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch balance" });
    }
  });

  app.post("/api/flo/import", async (req, res) => {
    try {
      const { floPrivateKey } = req.body;
      
      // TODO: Implement FLO private key to Cardano address derivation
      // This is the core cross-chain compatibility feature
      
      res.json({ 
        message: "FLO private key import not yet implemented",
        floPrivateKey: "hidden"
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to import FLO private key" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
