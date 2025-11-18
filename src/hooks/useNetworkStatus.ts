import { useState, useEffect } from 'react';
import * as Network from 'expo-network';

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      const state = await Network.getNetworkStateAsync();
      setIsConnected(state.isConnected ?? false);
      setIsInternetReachable(state.isInternetReachable ?? false);
    }

    checkStatus();

    const interval = setInterval(checkStatus, 5000); // check every 5s
    return () => clearInterval(interval);
  }, []);

  return {
    isConnected,
    isInternetReachable,
    isOnline: isConnected && isInternetReachable,
  };
}