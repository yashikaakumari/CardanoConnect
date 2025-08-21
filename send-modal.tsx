import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/hooks/use-wallet';
import { cardanoService } from '@/lib/cardano';

interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SendModal({ isOpen, onClose }: SendModalProps) {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isValidAddress, setIsValidAddress] = useState(true);
  const { currentWallet, sendADA, isSending } = useWallet();
  const { toast } = useToast();

  const estimatedFee = '0.17'; // ADA

  const validateAddress = (address: string) => {
    // Basic Cardano address validation
    const isValid = address.startsWith('addr1') && address.length > 50;
    setIsValidAddress(isValid);
    return isValid;
  };

  const handleAddressChange = (value: string) => {
    setRecipientAddress(value);
    if (value) {
      validateAddress(value);
    } else {
      setIsValidAddress(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentWallet) {
      toast({
        title: "Error",
        description: "No wallet selected",
        variant: "destructive",
      });
      return;
    }

    if (!recipientAddress || !amount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!isValidAddress) {
      toast({
        title: "Error",
        description: "Invalid recipient address",
        variant: "destructive",
      });
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: "Error",
        description: "Invalid amount",
        variant: "destructive",
      });
      return;
    }

    const walletBalance = cardanoService.lovelaceToAda(currentWallet.balance);
    if (amountNum + parseFloat(estimatedFee) > walletBalance) {
      toast({
        title: "Error",
        description: "Insufficient balance",
        variant: "destructive",
      });
      return;
    }

    try {
      await sendADA(recipientAddress, amount);
      toast({
        title: "Success",
        description: "Transaction submitted successfully",
      });
      onClose();
      setRecipientAddress('');
      setAmount('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send transaction",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    onClose();
    setRecipientAddress('');
    setAmount('');
    setIsValidAddress(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Send ADA</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="recipient" className="text-gray-300">
              Recipient Address
            </Label>
            <Input
              id="recipient"
              type="text"
              value={recipientAddress}
              onChange={(e) => handleAddressChange(e.target.value)}
              className={`mt-2 bg-gray-900 border-gray-600 text-white font-mono text-sm ${
                !isValidAddress ? 'border-red-500' : 'focus:border-indigo-500'
              }`}
              placeholder="addr1qxy2lpdps2kk2hdc5r5rn7j5c2ljjtk..."
              data-testid="recipient-input"
            />
            {!isValidAddress && (
              <p className="text-red-400 text-sm mt-1">Invalid Cardano address</p>
            )}
          </div>

          <div>
            <Label htmlFor="amount" className="text-gray-300">
              Amount
            </Label>
            <div className="relative mt-2">
              <Input
                id="amount"
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-gray-900 border-gray-600 text-white pr-12 focus:border-indigo-500"
                placeholder="0.00"
                data-testid="amount-input"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                ₳
              </span>
            </div>
          </div>

          <div>
            <Label className="text-gray-300">Transaction Fee</Label>
            <div className="bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Network Fee</span>
                <span className="text-white font-medium" data-testid="transaction-fee">
                  {estimatedFee} ₳
                </span>
              </div>
            </div>
          </div>

          {/* Balance Info */}
          {currentWallet && (
            <div className="bg-gray-900 border border-gray-600 rounded-lg px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Available Balance</span>
                <span className="text-white font-medium" data-testid="available-balance">
                  {cardanoService.formatLovelace(currentWallet.balance)} ₳
                </span>
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <Button
              type="button"
              onClick={handleClose}
              variant="secondary"
              className="flex-1 bg-gray-700 hover:bg-gray-600"
              data-testid="cancel-send-btn"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSending || !recipientAddress || !amount || !isValidAddress}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              data-testid="send-transaction-btn"
            >
              {isSending ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Sending...
                </>
              ) : (
                'Send Transaction'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
