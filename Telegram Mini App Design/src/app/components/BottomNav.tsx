import { Home, Key, Users, Settings } from 'lucide-react';
import type { Tab } from '../types';

interface BottomNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const tabs = [
    { id: 'home' as Tab, label: 'Главная', icon: Home },
    { id: 'subscriptions' as Tab, label: 'Подписки', icon: Key },
    { id: 'referrals' as Tab, label: 'Рефералы', icon: Users },
    { id: 'settings' as Tab, label: 'Настройки', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#121212] border-t border-gray-800 px-2 py-2">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-4 py-1 rounded-lg transition-colors ${
                isActive ? 'text-[#00BFFF]' : 'text-gray-400'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}