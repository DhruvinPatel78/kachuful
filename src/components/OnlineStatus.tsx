import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { checkOnlineStatus, setupOnlineStatusListener } from '../utils/pwa';

const OnlineStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(checkOnlineStatus());

  useEffect(() => {
    setupOnlineStatusListener(setIsOnline);
  }, []);

  if (isOnline) {
    return null; // Don't show anything when online
  }

  return (
    <div className="fixed top-16 left-0 right-0 bg-red-600 text-white px-4 py-2 z-50">
      <div className="container mx-auto flex items-center justify-center gap-2">
        <WifiOff size={16} />
        <span className="text-sm font-medium">
          You're offline. Kachuful requires an internet connection.
        </span>
      </div>
    </div>
  );
};

export default OnlineStatus;