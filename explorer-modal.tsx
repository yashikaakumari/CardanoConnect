import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/hooks/use-wallet';
import { TransactionInfo } from '@/types/wallet';
import { formatDistanceToNow } from 'date-fns';

interface ExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExplorerModal({ isOpen, onClose }: ExplorerModalProps) {
  const [searchAddress, setSearchAddress] = useState('');
  const [searchResults, setSearchResults] = useState<TransactionInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { searchAddressTransactions } = useWallet();
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchAddress.trim()) {
      toast({
        title: "Error",
        description: "Please enter an address to search",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const transactions = await searchAddressTransactions(searchAddress.trim());
      setSearchResults(transactions);
      
      if (transactions.length === 0) {
        toast({
          title: "No Results",
          description: "No transactions found for this address",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search address",
        variant: "destructive",
      });
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClose = () => {
    onClose();
    setSearchAddress('');
    setSearchResults([]);
    setHasSearched(false);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'receive':
        return { icon: 'fas fa-arrow-down', color: 'text-emerald-400' };
      case 'send':
        return { icon: 'fas fa-arrow-up', color: 'text-red-400' };
      default:
        return { icon: 'fas fa-exchange-alt', color: 'text-purple-400' };
    }
  };

  const formatAmount = (amount: string, type: string) => {
    const ada = parseFloat(amount) / 1000000;
    const prefix = type === 'receive' ? '+' : type === 'send' ? '-' : '';
    return `${prefix}${ada.toFixed(2)} ₳`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Address Explorer</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <Label htmlFor="search-address" className="text-gray-300">
                Search Address
              </Label>
              <div className="flex space-x-2 mt-2">
                <Input
                  id="search-address"
                  type="text"
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                  className="flex-1 bg-gray-900 border-gray-600 text-white font-mono text-sm focus:border-indigo-500"
                  placeholder="Enter Cardano address..."
                  data-testid="search-address-input"
                />
                <Button
                  type="submit"
                  disabled={isSearching}
                  className="bg-indigo-600 hover:bg-indigo-700"
                  data-testid="search-address-btn"
                >
                  {isSearching ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    <i className="fas fa-search"></i>
                  )}
                </Button>
              </div>
            </div>
          </form>

          {/* Search Results */}
          <div className="bg-gray-900 border border-gray-600 rounded-lg p-4 min-h-[200px]">
            {!hasSearched ? (
              <div className="text-center text-gray-400 py-8" data-testid="search-placeholder">
                <i className="fas fa-search text-4xl mb-4"></i>
                <p>Enter an address to view its transaction history</p>
              </div>
            ) : isSearching ? (
              <div className="text-center text-gray-400 py-8" data-testid="search-loading">
                <i className="fas fa-spinner fa-spin text-4xl mb-4"></i>
                <p>Searching transactions...</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center text-gray-400 py-8" data-testid="no-search-results">
                <i className="fas fa-inbox text-4xl mb-4"></i>
                <p>No transactions found for this address</p>
              </div>
            ) : (
              <div className="space-y-0">
                <h4 className="text-white font-medium mb-4">
                  Transaction History ({searchResults.length})
                </h4>
                {searchResults.map((transaction, index) => {
                  const iconConfig = getTransactionIcon(transaction.type);
                  
                  return (
                    <div 
                      key={transaction.id}
                      className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0"
                      data-testid={`search-result-${index}`}
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center mr-3">
                          <i className={`${iconConfig.icon} ${iconConfig.color} text-sm`}></i>
                        </div>
                        <div>
                          <div className="text-white text-sm font-medium capitalize">
                            {transaction.type}
                          </div>
                          <div className="text-xs text-gray-400 font-mono">
                            {transaction.txHash.slice(0, 12)}...{transaction.txHash.slice(-6)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${iconConfig.color}`}>
                          {formatAmount(transaction.amount, transaction.type)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatDistanceToNow(new Date(transaction.timestamp), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
