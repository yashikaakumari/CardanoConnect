import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { cardanoService } from '@/lib/cardano';
import { floCompatService } from '@/lib/flo-compat';
import type { WalletInfo, TransactionInfo, SendTransactionRequest } from '@/types/wallet';

export function useWallet() {
  const [currentWallet, setCurrentWallet] = useState<WalletInfo | null>(null);
  const queryClient = useQueryClient();

  // Fetch all wallets
  const { data: wallets = [], isLoading: walletsLoading } = useQuery<WalletInfo[]>({
    queryKey: ['/api/wallets'],
  });

  // Fetch current wallet transactions
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery<TransactionInfo[]>({
    queryKey: ['/api/wallets', currentWallet?.id, 'transactions'],
    enabled: !!currentWallet?.id,
  });

  // Fetch current wallet assets
  const { data: assets = [], isLoading: assetsLoading } = useQuery<any[]>({
    queryKey: ['/api/wallets', currentWallet?.id, 'assets'],
    enabled: !!currentWallet?.id,
  });

  // Create new wallet mutation
  const createWalletMutation = useMutation({
    mutationFn: async (walletData: any) => {
      const response = await apiRequest('POST', '/api/wallets', walletData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wallets'] });
    },
  });

  // Send transaction mutation
  const sendTransactionMutation = useMutation({
    mutationFn: async (txData: SendTransactionRequest) => {
      const response = await apiRequest('POST', '/api/cardano/send', txData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wallets', currentWallet?.id, 'transactions'] });
    },
  });

  // Import FLO private key mutation
  const importFLOKeyMutation = useMutation({
    mutationFn: async (floPrivateKey: string) => {
      // First derive Cardano address from FLO private key
      const keyPair = await floCompatService.deriveCardanoFromFLO(floPrivateKey);
      
      // Create wallet with derived addresses
      const walletData = {
        name: `FLO Imported Wallet`,
        cardanoAddress: keyPair.cardanoAddress,
        floAddress: keyPair.floAddress,
        privateKey: keyPair.privateKey,
        publicKey: keyPair.publicKey,
        balance: "0"
      };
      
      const response = await apiRequest('POST', '/api/wallets', walletData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wallets'] });
    },
  });

  // Generate new wallet
  const generateNewWallet = async (name: string = 'New Wallet') => {
    try {
      // TODO: Implement actual wallet generation using Mesh.js
      // For now, create a mock wallet
      const mockWalletData = {
        name,
        cardanoAddress: `addr1qxy2lpdps2kk2hdc5r5rn7j5c2ljjtk72y2d2pxhg${Date.now()}`,
        privateKey: `mock_private_key_${Date.now()}`,
        publicKey: `mock_public_key_${Date.now()}`,
        balance: "0"
      };
      
      await createWalletMutation.mutateAsync(mockWalletData);
    } catch (error) {
      console.error('Failed to generate wallet:', error);
      throw error;
    }
  };

  // Send ADA transaction
  const sendADA = async (toAddress: string, amount: string) => {
    if (!currentWallet) {
      throw new Error('No wallet selected');
    }

    try {
      const txData: SendTransactionRequest = {
        fromAddress: currentWallet.cardanoAddress,
        toAddress,
        amount: cardanoService.adaToLovelace(amount),
        walletId: currentWallet.id
      };

      await sendTransactionMutation.mutateAsync(txData);
    } catch (error) {
      console.error('Failed to send transaction:', error);
      throw error;
    }
  };

  // Import wallet from FLO private key
  const importFromFLO = async (floPrivateKey: string) => {
    try {
      if (!floCompatService.validateFLOPrivateKey(floPrivateKey)) {
        throw new Error('Invalid FLO private key format');
      }

      await importFLOKeyMutation.mutateAsync(floPrivateKey);
    } catch (error) {
      console.error('Failed to import FLO private key:', error);
      throw error;
    }
  };

  // Search address transactions
  const searchAddressTransactions = async (address: string): Promise<TransactionInfo[]> => {
    try {
      const response = await fetch(`/api/address/${address}/transactions`);
      if (!response.ok) {
        throw new Error('Failed to fetch address transactions');
      }
      return response.json();
    } catch (error) {
      console.error('Failed to search address:', error);
      throw error;
    }
  };

  // Update current wallet balance
  const refreshBalance = async () => {
    if (!currentWallet) return;

    try {
      const balance = await cardanoService.getWalletBalance(currentWallet.cardanoAddress);
      // TODO: Update wallet balance in storage
      console.log(`Updated balance: ${balance}`);
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    }
  };

  // Set current wallet
  const selectWallet = (wallet: WalletInfo) => {
    setCurrentWallet(wallet);
    localStorage.setItem('currentWalletId', wallet.id);
  };

  // Load saved wallet on mount
  useEffect(() => {
    const savedWalletId = localStorage.getItem('currentWalletId');
    if (savedWalletId && wallets.length > 0) {
      const savedWallet = wallets.find((w: WalletInfo) => w.id === savedWalletId);
      if (savedWallet) {
        setCurrentWallet(savedWallet);
      }
    } else if (wallets.length > 0) {
      setCurrentWallet(wallets[0]);
    }
  }, [wallets]);

  return {
    // State
    wallets,
    currentWallet,
    transactions,
    assets,
    
    // Loading states
    isLoading: walletsLoading || transactionsLoading || assetsLoading,
    isSending: sendTransactionMutation.isPending,
    isCreating: createWalletMutation.isPending,
    isImporting: importFLOKeyMutation.isPending,
    
    // Actions
    generateNewWallet,
    importFromFLO,
    sendADA,
    searchAddressTransactions,
    refreshBalance,
    selectWallet,
    
    // Utilities
    formatBalance: (balance: string) => cardanoService.formatLovelace(balance),
  };
}
