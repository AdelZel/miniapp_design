import { useState } from 'react';
import type { Subscription } from '../types';
import { PlatformSheet } from './PlatformSheet';
import { ServerSheet } from './ServerSheet';
import { Signal, SignalZero, MapPin } from 'lucide-react';

interface HomePageProps {
  subscription: Subscription | null;
  activateTrial: () => void;
  trialUsed: boolean;
}

export function HomePage({ subscription, activateTrial, trialUsed }: HomePageProps) {
  const [showPlatformSheet, setShowPlatformSheet] = useState(false);
  const [showServerSheet, setShowServerSheet] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentServer, setCurrentServer] = useState({
    id: '1',
    name: 'Нидерланды #1',
    country: 'NL',
    flag: '🇳🇱',
    ping: 45,
    load: 23,
  });

  const getTimeRemaining = (expiresAt: Date) => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days >= 1) {
      return `Осталось ${days} дней ${hours} часа`;
    } else {
      return `Осталось ${hours} часов ${minutes} минут`;
    }
  };

  const getProgress = (expiresAt: Date) => {
    const now = new Date();
    const start = subscription?.isTrial 
      ? new Date(expiresAt.getTime() - 3 * 24 * 60 * 60 * 1000)
      : new Date(expiresAt.getTime() - 30 * 24 * 60 * 60 * 1000);
    const total = expiresAt.getTime() - start.getTime();
    const remaining = expiresAt.getTime() - now.getTime();
    return Math.max(0, Math.min(100, (remaining / total) * 100));
  };

  const handleConnect = () => {
    if (!subscription) {
      // Redirect to subscriptions tab - in full app would use setActiveTab
      return;
    }
    setShowPlatformSheet(true);
  };

  const toggleConnection = () => {
    setIsConnected(!isConnected);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] px-6">
      <div className="text-center w-full max-w-md">
        <h1 className="text-6xl mb-8 tracking-wider">Cloak</h1>
        
        {/* Connection Status Indicator */}
        {subscription && (
          <div className="mb-8">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <div className={`absolute inset-0 rounded-full border-4 transition-all duration-500 ${
                isConnected 
                  ? 'border-[#00BFFF] shadow-[0_0_30px_rgba(0,191,255,0.5)]' 
                  : 'border-gray-600'
              }`} />
              <button
                onClick={toggleConnection}
                className="absolute inset-2 rounded-full bg-[#1A1A1A] hover:bg-[#252525] transition-colors flex items-center justify-center"
                aria-label={isConnected ? 'Отключиться от VPN' : 'Подключиться к VPN'}
              >
                {isConnected ? (
                  <Signal size={48} className="text-[#00BFFF]" />
                ) : (
                  <SignalZero size={48} className="text-gray-400" />
                )}
              </button>
            </div>
            <p className={`text-lg mb-2 transition-colors ${isConnected ? 'text-[#00BFFF]' : 'text-gray-400'}`}>
              {isConnected ? 'Подключено' : 'Не подключено'}
            </p>
          </div>
        )}

        {subscription && (
          <div className="mb-6">
            <p className="text-xl text-white mb-3">
              {subscription.isTrial ? 'Пробный период' : getTimeRemaining(subscription.expiresAt)}
            </p>
            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#00BFFF] to-[#0080FF] transition-all duration-300"
                style={{ width: `${getProgress(subscription.expiresAt)}%` }}
              />
            </div>
          </div>
        )}

        {/* Server Selection */}
        {subscription && (
          <button
            onClick={() => setShowServerSheet(true)}
            className="w-full max-w-xs bg-[#1A1A1A] rounded-xl p-4 mb-4 flex items-center justify-between hover:bg-[#252525] transition-colors"
          >
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-[#00BFFF]" />
              <div className="text-left">
                <p className="text-white text-sm">{currentServer.name}</p>
                <p className="text-gray-400 text-xs">{currentServer.ping}ms</p>
              </div>
            </div>
            <span className="text-2xl">{currentServer.flag}</span>
          </button>
        )}

        <button
          onClick={handleConnect}
          className="bg-[#00BFFF] text-black px-12 py-4 rounded-2xl text-lg w-full max-w-xs mb-4 hover:bg-[#00A5E6] transition-colors"
        >
          Подключиться
        </button>

        {!subscription && !trialUsed && (
          <p className="text-gray-400 text-sm mt-2">
            Активировать пробный период 3 дня
          </p>
        )}
      </div>

      {subscription && (
        <>
          <PlatformSheet 
            isOpen={showPlatformSheet} 
            onClose={() => setShowPlatformSheet(false)}
            vlessLink={subscription.vlessLink}
          />
          <ServerSheet
            isOpen={showServerSheet}
            onClose={() => setShowServerSheet(false)}
            currentServer={currentServer}
            onSelectServer={setCurrentServer}
          />
        </>
      )}
    </div>
  );
}