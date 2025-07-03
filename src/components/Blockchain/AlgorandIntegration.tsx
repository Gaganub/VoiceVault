import React, { useState, useEffect } from 'react';
import { Shield, Wallet, Check, AlertCircle, Loader, Key, Lock, Database } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface AlgorandIntegrationProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

interface WalletState {
  isConnected: boolean;
  address: string;
  balance: number;
  networkStatus: 'mainnet' | 'testnet' | 'betanet';
}

export const AlgorandIntegration: React.FC<AlgorandIntegrationProps> = ({ onConnect, onDisconnect }) => {
  const { theme } = useTheme();
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: '',
    balance: 0,
    networkStatus: 'testnet'
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string>('');
  const [memoryStats, setMemoryStats] = useState({
    stored: 127,
    encrypted: 127,
    cost: 2.5
  });

  // Simulate Algorand wallet connection
  const connectWallet = async () => {
    setIsConnecting(true);
    setError('');
    
    try {
      // Simulate wallet detection and connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if Algorand wallet is available (simulation)
      if (!window.AlgoSigner && !window.PeraWallet) {
        throw new Error('No Algorand wallet detected. Please install Pera Wallet or AlgoSigner.');
      }
      
      // Mock successful connection
      const mockAddress = 'ALGO7X8K9L2M3N4P5Q6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E0F1G2H3I4J5K6L7M8N9';
      const mockBalance = 125.75;
      
      setWalletState({
        isConnected: true,
        address: mockAddress,
        balance: mockBalance,
        networkStatus: 'testnet'
      });
      
      onConnect?.(mockAddress);
      
      // Initialize memory encryption
      await initializeMemoryEncryption();
      
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    setWalletState({
      isConnected: false,
      address: '',
      balance: 0,
      networkStatus: 'testnet'
    });
    setError('');
    onDisconnect?.();
  };

  const initializeMemoryEncryption = async () => {
    // Simulate setting up encryption keys and smart contracts
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Memory encryption initialized on Algorand');
  };

  const encryptAndStoreMemory = async (memoryData: any) => {
    if (!walletState.isConnected) {
      throw new Error('Wallet not connected');
    }
    
    // Simulate encryption and blockchain storage
    const encryptedData = btoa(JSON.stringify(memoryData)); // Simple base64 encoding for demo
    
    // Simulate transaction to Algorand
    const txnId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('Memory encrypted and stored on Algorand:', {
      transactionId: txnId,
      encryptedSize: encryptedData.length,
      cost: 0.001 // ALGO
    });
    
    return txnId;
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const formatBalance = (balance: number) => {
    return balance.toFixed(3);
  };

  return (
    <div 
      className="p-6 rounded-2xl backdrop-blur-sm border border-opacity-30"
      style={{ 
        backgroundColor: `${theme.colors.surface}80`,
        borderColor: theme.colors.accent 
      }}
    >
      <div className="flex items-center space-x-3 mb-4">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${theme.colors.primary}30` }}
        >
          <Shield 
            className="w-5 h-5" 
            style={{ color: theme.colors.primary }}
          />
        </div>
        <div>
          <h3 
            className="text-lg font-bold"
            style={{ color: theme.colors.text }}
          >
            Algorand Security
          </h3>
          <p 
            className="text-sm"
            style={{ color: theme.colors.textSecondary }}
          >
            Decentralized memory storage and encryption
          </p>
        </div>
      </div>

      {error && (
        <div 
          className="flex items-center space-x-2 p-3 rounded-lg mb-4"
          style={{ backgroundColor: `#ef444430`, borderColor: '#ef4444', border: '1px solid' }}
        >
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span className="text-sm text-red-400">{error}</span>
        </div>
      )}

      {!walletState.isConnected ? (
        <div className="space-y-4">
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 disabled:hover:scale-100 disabled:opacity-70"
            style={{ 
              backgroundColor: theme.colors.primary,
              color: theme.colors.background 
            }}
          >
            {isConnecting ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5" />
                <span>Connect Algorand Wallet</span>
              </>
            )}
          </button>
          
          <div className="text-center">
            <p 
              className="text-xs mb-2"
              style={{ color: theme.colors.textSecondary }}
            >
              Supported wallets:
            </p>
            <div className="flex justify-center space-x-4">
              <div 
                className="px-3 py-1 rounded-full text-xs"
                style={{ 
                  backgroundColor: `${theme.colors.surface}60`,
                  color: theme.colors.textSecondary 
                }}
              >
                Pera Wallet
              </div>
              <div 
                className="px-3 py-1 rounded-full text-xs"
                style={{ 
                  backgroundColor: `${theme.colors.surface}60`,
                  color: theme.colors.textSecondary 
                }}
              >
                AlgoSigner
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Wallet Info */}
          <div 
            className="flex items-center space-x-3 p-4 rounded-xl"
            style={{ backgroundColor: `${theme.colors.primary}20` }}
          >
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <Check 
                className="w-4 h-4" 
                style={{ color: theme.colors.background }}
              />
            </div>
            <div className="flex-1">
              <p 
                className="font-medium"
                style={{ color: theme.colors.text }}
              >
                Wallet Connected
              </p>
              <p 
                className="text-sm font-mono"
                style={{ color: theme.colors.textSecondary }}
              >
                {formatAddress(walletState.address)}
              </p>
            </div>
            <div className="text-right">
              <p 
                className="font-bold"
                style={{ color: theme.colors.text }}
              >
                {formatBalance(walletState.balance)} ALGO
              </p>
              <p 
                className="text-xs capitalize"
                style={{ color: theme.colors.textSecondary }}
              >
                {walletState.networkStatus}
              </p>
            </div>
          </div>

          {/* Memory Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div 
              className="p-3 rounded-lg text-center"
              style={{ backgroundColor: `${theme.colors.surface}60` }}
            >
              <div 
                className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center"
                style={{ backgroundColor: `${theme.colors.primary}30` }}
              >
                <Database 
                  className="w-4 h-4" 
                  style={{ color: theme.colors.primary }}
                />
              </div>
              <div 
                className="text-lg font-bold"
                style={{ color: theme.colors.text }}
              >
                {memoryStats.stored}
              </div>
              <div 
                className="text-xs"
                style={{ color: theme.colors.textSecondary }}
              >
                Stored
              </div>
            </div>
            
            <div 
              className="p-3 rounded-lg text-center"
              style={{ backgroundColor: `${theme.colors.surface}60` }}
            >
              <div 
                className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center"
                style={{ backgroundColor: `${theme.colors.primary}30` }}
              >
                <Lock 
                  className="w-4 h-4" 
                  style={{ color: theme.colors.primary }}
                />
              </div>
              <div 
                className="text-lg font-bold"
                style={{ color: theme.colors.text }}
              >
                {memoryStats.encrypted}
              </div>
              <div 
                className="text-xs"
                style={{ color: theme.colors.textSecondary }}
              >
                Encrypted
              </div>
            </div>
            
            <div 
              className="p-3 rounded-lg text-center"
              style={{ backgroundColor: `${theme.colors.surface}60` }}
            >
              <div 
                className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center"
                style={{ backgroundColor: `${theme.colors.primary}30` }}
              >
                <Key 
                  className="w-4 h-4" 
                  style={{ color: theme.colors.primary }}
                />
              </div>
              <div 
                className="text-lg font-bold"
                style={{ color: theme.colors.text }}
              >
                {memoryStats.cost}
              </div>
              <div 
                className="text-xs"
                style={{ color: theme.colors.textSecondary }}
              >
                ALGO Cost
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <button
              onClick={() => encryptAndStoreMemory({ test: 'data' })}
              className="flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
              style={{ 
                backgroundColor: `${theme.colors.primary}30`,
                color: theme.colors.primary 
              }}
            >
              Encrypt New Memory
            </button>
            <button
              onClick={disconnectWallet}
              className="px-4 py-2 rounded-lg font-medium border transition-all duration-200 hover:scale-105"
              style={{ 
                borderColor: theme.colors.textSecondary,
                color: theme.colors.textSecondary 
              }}
            >
              Disconnect
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-opacity-30" style={{ borderColor: theme.colors.accent }}>
        <div className="flex items-center space-x-2 text-xs" style={{ color: theme.colors.textSecondary }}>
          <Shield className="w-3 h-3" />
          <span>End-to-end encrypted storage on Algorand blockchain</span>
        </div>
      </div>
    </div>
  );
};