import { AssetInfo } from '@/types/wallet';

interface AssetsListProps {
  assets: AssetInfo[];
  adaBalance: string;
  adaBalanceUSD: string;
}

export function AssetsList({ assets, adaBalance, adaBalanceUSD }: AssetsListProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Assets</h3>
        <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium" data-testid="view-all-assets">
          View All
        </button>
      </div>
      
      {/* ADA Balance */}
      <div className="flex items-center justify-between py-4 border-b border-gray-700" data-testid="asset-ada">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-cardano rounded-xl flex items-center justify-center mr-4">
            <span className="text-white font-bold text-lg">₳</span>
          </div>
          <div>
            <h4 className="font-medium text-white">Cardano</h4>
            <p className="text-sm text-gray-400">ADA</p>
          </div>
        </div>
        <div className="text-right">
          <div className="font-semibold text-white" data-testid="ada-balance">
            {parseFloat(adaBalance || '0').toFixed(2)} ₳
          </div>
          <div className="text-sm text-gray-400" data-testid="ada-balance-usd">
            ${adaBalanceUSD || '0.00'}
          </div>
        </div>
      </div>

      {/* Native Tokens */}
      {assets.map((asset, index) => (
        <div 
          key={asset.id} 
          className="flex items-center justify-between py-4 border-b border-gray-700 last:border-b-0"
          data-testid={`asset-${index}`}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
              <span className="text-white font-bold text-sm">
                {asset.symbol?.slice(0, 3) || 'TKN'}
              </span>
            </div>
            <div>
              <h4 className="font-medium text-white" data-testid={`asset-name-${index}`}>
                {asset.displayName || asset.assetName}
              </h4>
              <p className="text-sm text-gray-400" data-testid={`asset-symbol-${index}`}>
                {asset.symbol}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-white" data-testid={`asset-balance-${index}`}>
              {parseFloat(asset.balance || '0').toFixed(asset.decimals || 0)} {asset.symbol}
            </div>
            <div className="text-sm text-gray-400" data-testid={`asset-usd-${index}`}>
              ${asset.usdValue || '0.00'}
            </div>
          </div>
        </div>
      ))}

      {/* Empty state */}
      {assets.length === 0 && (
        <div className="text-center py-8 text-gray-400" data-testid="no-assets">
          <i className="fas fa-coins text-4xl mb-4"></i>
          <p>No native tokens found</p>
        </div>
      )}
    </div>
  );
}
