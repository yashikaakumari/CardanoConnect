import { TransactionInfo } from '@/types/wallet';
import { formatDistanceToNow } from 'date-fns';

interface TransactionsListProps {
  transactions: TransactionInfo[];
}

export function TransactionsList({ transactions }: TransactionsListProps) {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'receive':
        return { icon: 'fas fa-arrow-down', color: 'bg-emerald-600' };
      case 'send':
        return { icon: 'fas fa-arrow-up', color: 'bg-red-600' };
      case 'stake':
      case 'unstake':
        return { icon: 'fas fa-exchange-alt', color: 'bg-purple-600' };
      default:
        return { icon: 'fas fa-exchange-alt', color: 'bg-gray-600' };
    }
  };

  const getAmountColor = (type: string) => {
    switch (type) {
      case 'receive':
        return 'text-emerald-400';
      case 'send':
        return 'text-red-400';
      default:
        return 'text-purple-400';
    }
  };

  const formatAmount = (amount: string, type: string) => {
    const ada = parseFloat(amount) / 1000000;
    const prefix = type === 'receive' ? '+' : type === 'send' ? '-' : '';
    return `${prefix}${ada.toFixed(2)} ₳`;
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
        <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium" data-testid="view-all-transactions">
          View All
        </button>
      </div>

      {/* Transaction List */}
      <div className="space-y-0">
        {transactions.map((transaction, index) => {
          const iconConfig = getTransactionIcon(transaction.type);
          const amountColor = getAmountColor(transaction.type);
          
          return (
            <div 
              key={transaction.id} 
              className="flex items-center justify-between py-4 border-b border-gray-700 last:border-b-0"
              data-testid={`transaction-${index}`}
            >
              <div className="flex items-center">
                <div className={`w-10 h-10 ${iconConfig.color} rounded-xl flex items-center justify-center mr-4`}>
                  <i className={`${iconConfig.icon} text-white`}></i>
                </div>
                <div>
                  <h4 className="font-medium text-white capitalize" data-testid={`transaction-type-${index}`}>
                    {transaction.type}
                  </h4>
                  <p className="text-sm text-gray-400 font-mono" data-testid={`transaction-hash-${index}`}>
                    {transaction.txHash.slice(0, 8)}...{transaction.txHash.slice(-4)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-semibold ${amountColor}`} data-testid={`transaction-amount-${index}`}>
                  {formatAmount(transaction.amount, transaction.type)}
                </div>
                <div className="text-sm text-gray-400" data-testid={`transaction-time-${index}`}>
                  {formatDistanceToNow(new Date(transaction.timestamp), { addSuffix: true })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {transactions.length === 0 && (
        <div className="text-center py-8 text-gray-400" data-testid="no-transactions">
          <i className="fas fa-history text-4xl mb-4"></i>
          <p>No transactions found</p>
        </div>
      )}
    </div>
  );
}
