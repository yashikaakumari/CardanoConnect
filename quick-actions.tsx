interface QuickActionsProps {
  onSendClick: () => void;
  onReceiveClick: () => void;
  onImportFLOClick: () => void;
  onNewWalletClick: () => void;
}

export function QuickActions({ onSendClick, onReceiveClick, onImportFLOClick, onNewWalletClick }: QuickActionsProps) {
  const actions = [
    {
      title: 'Send ADA',
      description: 'Transfer to any address',
      icon: 'fas fa-paper-plane',
      bgColor: 'bg-indigo-600',
      hoverColor: 'hover:border-indigo-500',
      onClick: onSendClick,
      testId: 'action-send'
    },
    {
      title: 'Receive',
      description: 'Get your address',
      icon: 'fas fa-download',
      bgColor: 'bg-emerald-600',
      hoverColor: 'hover:border-emerald-500',
      onClick: onReceiveClick,
      testId: 'action-receive'
    },
    {
      title: 'Import FLO',
      description: 'Use FLO private key',
      icon: 'fas fa-key',
      bgColor: 'bg-amber-600',
      hoverColor: 'hover:border-amber-500',
      onClick: onImportFLOClick,
      testId: 'action-import-flo'
    },
    {
      title: 'New Wallet',
      description: 'Generate new address',
      icon: 'fas fa-plus',
      bgColor: 'bg-purple-600',
      hoverColor: 'hover:border-purple-500',
      onClick: onNewWalletClick,
      testId: 'action-new-wallet'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {actions.map((action) => (
        <button
          key={action.testId}
          onClick={action.onClick}
          className={`bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-xl p-6 text-center transition-all duration-200 hover:scale-105 ${action.hoverColor}`}
          data-testid={action.testId}
        >
          <div className={`w-12 h-12 ${action.bgColor} rounded-xl flex items-center justify-center mx-auto mb-3`}>
            <i className={`${action.icon} text-white text-xl`}></i>
          </div>
          <h3 className="font-semibold text-white mb-1">{action.title}</h3>
          <p className="text-xs text-gray-400">{action.description}</p>
        </button>
      ))}
    </div>
  );
}
