export interface WalletState {
  wallets: WalletInfo[];
  currentWallet: WalletInfo | null;
  isLoading: boolean;
  error: string | null;
}

export interface WalletInfo {
  id: string;
  name: string;
  cardanoAddress: string;
  floAddress?: string;
  balance: string;
  balanceUSD: string;
  assets: AssetInfo[];
}

export interface AssetInfo {
  id: string;
  policyId: string;
  assetName: string;
  displayName: string;
  symbol: string;
  balance: string;
  decimals: number;
  usdValue: string;
}

export interface TransactionInfo {
  id: string;
  txHash: string;
  type: 'send' | 'receive' | 'stake' | 'unstake';
  amount: string;
  fee?: string;
  fromAddress?: string;
  toAddress: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: Date;
  blockHeight?: string;
}

export interface SendTransactionRequest {
  fromAddress: string;
  toAddress: string;
  amount: string;
  walletId: string;
}

export interface CardanoBalance {
  address: string;
  balance: string;
  assets: AssetInfo[];
}
