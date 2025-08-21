import { type Wallet, type Transaction, type Asset, type InsertWallet, type InsertTransaction, type InsertAsset } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Wallet operations
  getWallet(id: string): Promise<Wallet | undefined>;
  getWalletByAddress(address: string): Promise<Wallet | undefined>;
  createWallet(wallet: InsertWallet): Promise<Wallet>;
  updateWalletBalance(id: string, balance: string): Promise<void>;
  getAllWallets(): Promise<Wallet[]>;

  // Transaction operations
  getTransaction(id: string): Promise<Transaction | undefined>;
  getTransactionsByWallet(walletId: string): Promise<Transaction[]>;
  getTransactionsByAddress(address: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransactionStatus(id: string, status: string, blockHeight?: string): Promise<void>;

  // Asset operations
  getAssetsByWallet(walletId: string): Promise<Asset[]>;
  createAsset(asset: InsertAsset): Promise<Asset>;
  updateAssetBalance(id: string, balance: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private wallets: Map<string, Wallet>;
  private transactions: Map<string, Transaction>;
  private assets: Map<string, Asset>;

  constructor() {
    this.wallets = new Map();
    this.transactions = new Map();
    this.assets = new Map();
  }

  async getWallet(id: string): Promise<Wallet | undefined> {
    return this.wallets.get(id);
  }

  async getWalletByAddress(address: string): Promise<Wallet | undefined> {
    return Array.from(this.wallets.values()).find(
      (wallet) => wallet.cardanoAddress === address || wallet.floAddress === address
    );
  }

  async createWallet(insertWallet: InsertWallet): Promise<Wallet> {
    const id = randomUUID();
    const wallet: Wallet = {
      ...insertWallet,
      id,
      createdAt: new Date(),
      floAddress: insertWallet.floAddress || null,
      mnemonic: insertWallet.mnemonic || null,
      balance: insertWallet.balance || "0",
    };
    this.wallets.set(id, wallet);
    return wallet;
  }

  async updateWalletBalance(id: string, balance: string): Promise<void> {
    const wallet = this.wallets.get(id);
    if (wallet) {
      wallet.balance = balance;
      this.wallets.set(id, wallet);
    }
  }

  async getAllWallets(): Promise<Wallet[]> {
    return Array.from(this.wallets.values());
  }

  async getTransaction(id: string): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async getTransactionsByWallet(walletId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (tx) => tx.walletId === walletId
    );
  }

  async getTransactionsByAddress(address: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (tx) => tx.fromAddress === address || tx.toAddress === address
    );
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      createdAt: new Date(),
      fee: insertTransaction.fee || null,
      fromAddress: insertTransaction.fromAddress || null,
      status: insertTransaction.status || "pending",
      blockHeight: insertTransaction.blockHeight || null,
      metadata: insertTransaction.metadata || null,
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransactionStatus(id: string, status: string, blockHeight?: string): Promise<void> {
    const transaction = this.transactions.get(id);
    if (transaction) {
      transaction.status = status;
      if (blockHeight) {
        transaction.blockHeight = blockHeight;
      }
      this.transactions.set(id, transaction);
    }
  }

  async getAssetsByWallet(walletId: string): Promise<Asset[]> {
    return Array.from(this.assets.values()).filter(
      (asset) => asset.walletId === walletId
    );
  }

  async createAsset(insertAsset: InsertAsset): Promise<Asset> {
    const id = randomUUID();
    const asset: Asset = {
      ...insertAsset,
      id,
      displayName: insertAsset.displayName || null,
      symbol: insertAsset.symbol || null,
      decimals: insertAsset.decimals || "0",
      balance: insertAsset.balance || "0",
      metadata: insertAsset.metadata || null,
    };
    this.assets.set(id, asset);
    return asset;
  }

  async updateAssetBalance(id: string, balance: string): Promise<void> {
    const asset = this.assets.get(id);
    if (asset) {
      asset.balance = balance;
      this.assets.set(id, asset);
    }
  }
}

export const storage = new MemStorage();
