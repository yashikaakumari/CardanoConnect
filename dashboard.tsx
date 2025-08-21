import { useState } from 'react';
import { Sidebar } from '@/components/wallet/sidebar';
import { QuickActions } from '@/components/wallet/quick-actions';
import { AssetsList } from '@/components/wallet/assets-list';
import { TransactionsList } from '@/components/wallet/transactions-list';
import { WalletInfo } from '@/components/wallet/wallet-info';
import { SendModal } from '@/components/wallet/send-modal';
import { ExplorerModal } from '@/components/wallet/explorer-modal';
import { useWallet } from '@/hooks/use-wallet';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showSendModal, setShowSendModal] = useState(false);
  const [showExplorerModal, setShowExplorerModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  
  const { 
    currentWallet, 
    transactions, 
    assets, 
    isLoading, 
    generateNewWallet, 
    importFromFLO,
    formatBalance 
  } = useWallet();
  
  const { toast } = useToast();

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    setSidebarOpen(false);
    
    // Handle specific section actions
    switch (section) {
      case 'send':
        setShowSendModal(true);
        break;
      case 'explorer':
        setShowExplorerModal(true);
        break;
      case 'import':
        setShowImportModal(true);
        break;
    }
  };

  const handleNewWallet = async () => {
    try {
      await generateNewWallet();
      toast({
        title: "Success",
        description: "New wallet generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate new wallet",
        variant: "destructive",
      });
    }
  };

  const handleImportFLO = () => {
    // TODO: Implement FLO import modal
    const floPrivateKey = prompt('Enter your FLO private key:');
    if (floPrivateKey) {
      importFromFLO(floPrivateKey)
        .then(() => {
          toast({
            title: "Success",
            description: "FLO private key imported successfully",
          });
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: "Failed to import FLO private key",
            variant: "destructive",
          });
        });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <i className="fas fa-spinner fa-spin text-4xl mb-4"></i>
          <p>Loading wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-900 text-gray-100">
      <Sidebar
        currentWallet={currentWallet}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={handleNavigate}
        activeSection={activeSection}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden mr-4 text-gray-400 hover:text-white"
                data-testid="sidebar-toggle"
              >
                <i className="fas fa-bars text-xl"></i>
              </button>
              <h2 className="text-xl font-semibold text-white">Dashboard</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Mainnet Connected
              </div>
              <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors">
                <i className="fas fa-bell text-lg"></i>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {/* Quick Actions */}
          <QuickActions
            onSendClick={() => setShowSendModal(true)}
            onReceiveClick={() => setActiveSection('receive')}
            onImportFLOClick={handleImportFLO}
            onNewWalletClick={handleNewWallet}
          />

          {/* Assets and Wallet Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Assets */}
            <div className="lg:col-span-2">
              <AssetsList
                assets={assets}
                adaBalance={currentWallet?.balance || '0'}
                adaBalanceUSD={currentWallet?.balanceUSD || '0.00'}
              />
            </div>

            {/* Wallet Info */}
            <div>
              <WalletInfo wallet={currentWallet} />
            </div>
          </div>

          {/* Recent Transactions */}
          <TransactionsList transactions={transactions} />
        </main>
      </div>

      {/* Modals */}
      <SendModal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
      />

      <ExplorerModal
        isOpen={showExplorerModal}
        onClose={() => setShowExplorerModal(false)}
      />
    </div>
  );
}
