import { WalletInfo as WalletInfoType } from '@/types/wallet';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface WalletInfoProps {
  wallet: WalletInfoType | null;
}

export function WalletInfo({ wallet }: WalletInfoProps) {
  const [showQR, setShowQR] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  if (!wallet) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="text-center text-gray-400 py-8">
            <i className="fas fa-wallet text-4xl mb-4"></i>
            <p>No wallet selected</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Address */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Current Address</h3>
        <div className="bg-gray-900 border border-gray-600 rounded-lg p-4 mb-4">
          <div className="text-xs text-gray-400 mb-2">Receive Address</div>
          <div 
            className="font-mono text-sm text-white break-all cursor-pointer hover:text-indigo-400 transition-colors"
            onClick={() => copyToClipboard(wallet.cardanoAddress, 'Address')}
            data-testid="receive-address"
          >
            {wallet.cardanoAddress}
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => copyToClipboard(wallet.cardanoAddress, 'Address')}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            data-testid="copy-address-btn"
          >
            <i className="fas fa-copy mr-2"></i>Copy
          </button>
          <button 
            onClick={() => setShowQR(!showQR)}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            data-testid="qr-code-btn"
          >
            <i className="fas fa-qrcode mr-2"></i>QR Code
          </button>
        </div>
        
        {/* QR Code Display */}
        {showQR && (
          <div className="mt-4 p-4 bg-white rounded-lg text-center">
            <div className="w-48 h-48 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-600">QR Code Placeholder</span>
            </div>
            <p className="text-xs text-gray-600 mt-2">Scan to get address</p>
          </div>
        )}
      </div>

      {/* FLO Cross-Chain Status */}
      {wallet.floAddress && (
        <div className="bg-gradient-to-br from-emerald-800 to-teal-800 border border-emerald-600 rounded-xl p-6">
          <div className="flex items-center mb-3">
            <i className="fas fa-link text-emerald-400 mr-2"></i>
            <h3 className="text-lg font-semibold text-white">FLO Integration</h3>
          </div>
          <p className="text-emerald-100 text-sm mb-4">
            Your FLO private key can manage this Cardano wallet
          </p>
          <div className="bg-emerald-900 border border-emerald-600 rounded-lg p-3">
            <div className="text-xs text-emerald-300 mb-1">FLO Address</div>
            <div 
              className="font-mono text-sm text-emerald-100 break-all cursor-pointer hover:text-emerald-200 transition-colors"
              onClick={() => copyToClipboard(wallet.floAddress!, 'FLO Address')}
              data-testid="flo-address"
            >
              {wallet.floAddress}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
