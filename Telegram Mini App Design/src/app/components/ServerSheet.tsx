import { Drawer } from 'vaul';
import { Check, Activity } from 'lucide-react';
import { useState } from 'react';

interface Server {
  id: string;
  name: string;
  country: string;
  flag: string;
  ping: number;
  load: number;
}

interface ServerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectServer: (server: Server) => void;
  currentServer: Server;
}

export function ServerSheet({ isOpen, onClose, onSelectServer, currentServer }: ServerSheetProps) {
  const [selectedServer, setSelectedServer] = useState<Server>(currentServer);

  const servers: Server[] = [
    { id: '1', name: 'Нидерланды #1', country: 'NL', flag: '🇳🇱', ping: 45, load: 23 },
    { id: '2', name: 'Германия #1', country: 'DE', flag: '🇩🇪', ping: 52, load: 34 },
    { id: '3', name: 'США #1', country: 'US', flag: '🇺🇸', ping: 120, load: 45 },
    { id: '4', name: 'США #2', country: 'US', flag: '🇺🇸', ping: 115, load: 28 },
    { id: '5', name: 'Сингапур #1', country: 'SG', flag: '🇸🇬', ping: 180, load: 56 },
    { id: '6', name: 'Япония #1', country: 'JP', flag: '🇯🇵', ping: 165, load: 42 },
    { id: '7', name: 'Великобритания #1', country: 'GB', flag: '🇬🇧', ping: 68, load: 31 },
    { id: '8', name: 'Франция #1', country: 'FR', flag: '🇫🇷', ping: 58, load: 25 },
  ];

  const handleSelect = (server: Server) => {
    setSelectedServer(server);
    onSelectServer(server);
    onClose();
  };

  const getLoadColor = (load: number) => {
    if (load < 40) return 'text-green-500';
    if (load < 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getPingColor = (ping: number) => {
    if (ping < 80) return 'text-green-500';
    if (ping < 150) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Drawer.Root open={isOpen} onOpenChange={onClose}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-[#1A1A1A] flex flex-col rounded-t-[24px] h-[80%] mt-24 fixed bottom-0 left-0 right-0">
          <div className="p-6 flex-1 overflow-auto">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-600 mb-6" />
            <h2 className="text-xl text-white mb-6">Выберите сервер</h2>
            
            <div className="space-y-2">
              {servers.map((server) => {
                const isSelected = selectedServer.id === server.id;
                return (
                  <button
                    key={server.id}
                    onClick={() => handleSelect(server)}
                    className={`w-full rounded-xl p-4 flex items-center justify-between transition-colors ${
                      isSelected 
                        ? 'bg-[#00BFFF]/20 border-2 border-[#00BFFF]' 
                        : 'bg-[#0F0F0F] hover:bg-[#252525] border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{server.flag}</span>
                      <div className="text-left">
                        <p className="text-white">{server.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1">
                            <Activity size={12} className={getPingColor(server.ping)} />
                            <span className={`text-xs ${getPingColor(server.ping)}`}>
                              {server.ping}ms
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className={`text-xs ${getLoadColor(server.load)}`}>
                              Загрузка {server.load}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <Check size={24} className="text-[#00BFFF]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
