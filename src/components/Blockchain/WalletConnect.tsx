import React from 'react';
import { AlgorandIntegration } from './AlgorandIntegration';

interface WalletConnectProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect, onDisconnect }) => {
  return <AlgorandIntegration onConnect={onConnect} onDisconnect={onDisconnect} />;
};
