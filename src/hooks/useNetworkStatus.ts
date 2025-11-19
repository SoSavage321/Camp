import { useState, useEffect, useCallback } from 'react';

// Custom hook for network status with optimized polling
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [connectionType, setConnectionType] = useState<string>('unknown');
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  // Debounced network check to reduce polling frequency
  const checkStatus = useCallback(async () => {
    try {
      // Simple connectivity check using fetch with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch('https://www.google.com', {
        method: 'HEAD',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      setIsOnline(response.ok);
      setConnectionType(response.ok ? 'online' : 'offline');
      setLastChecked(new Date());
    } catch (error) {
      setIsOnline(false);
      setConnectionType('offline');
      setLastChecked(new Date());
    }
  }, []);

  useEffect(() => {
    // Check immediately on mount
    checkStatus();
    
    // Poll less frequently - every 30 seconds instead of 5
    const interval = setInterval(checkStatus, 30000);

    return () => clearInterval(interval);
  }, [checkStatus]);

  return {
    isOnline,
    isConnected: isOnline,
    connectionType,
    lastChecked,
  };
};