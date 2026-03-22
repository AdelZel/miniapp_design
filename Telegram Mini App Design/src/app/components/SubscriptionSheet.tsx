import { useState } from 'react';
import { Drawer } from 'vaul';
import { Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import type { Subscription } from '../types';
import { PlatformSheet } from './PlatformSheet';

interface SubscriptionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription;
}

export function SubscriptionSheet({ isOpen, onClose, subscription }: SubscriptionSheetProps) {
  const [showPlatformSheet, setShowPlatformSheet] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(subscription.vlessLink);
    toast.success('Ссылка скопирована!');
  };

  const handleOpenInApp = () => {
    onClose();
    setShowPlatformSheet(true);
  };

  return (
    <>
      <Drawer.Root open={isOpen} onOpenChange={onClose}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="bg-[#1A1A1A] flex flex-col rounded-t-[24px] h-[60%] mt-24 fixed bottom-0 left-0 right-0">
            <div className="p-6 flex-1 overflow-auto">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-600 mb-6" />
              <h2 className="text-xl text-white mb-6">Ваша подписка</h2>
              
              <div className="bg-[#0F0F0F] rounded-xl p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Идентификатор</p>
                    <p className="text-white">#{subscription.id}</p>
                  </div>
                  <div className="bg-[#2A2A2A] px-3 py-1 rounded-lg">
                    <p className="text-sm text-white">VLESS</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-1">Устройств</p>
                  <p className="text-white">{subscription.devices}</p>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <p className="text-sm text-gray-400 mb-2">Конфигурация VLESS</p>
                  <div className="bg-[#0A0A0A] rounded-lg p-3">
                    <p className="text-xs text-gray-400 break-all">{subscription.vlessLink}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCopy}
                  className="w-full bg-white text-black py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                >
                  <Copy size={20} />
                  Скопировать ссылку
                </button>
                <button
                  onClick={handleOpenInApp}
                  className="w-full bg-[#00BFFF] text-black py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#00A5E6] transition-colors"
                >
                  <ExternalLink size={20} />
                  Открыть в приложении
                </button>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      <PlatformSheet
        isOpen={showPlatformSheet}
        onClose={() => setShowPlatformSheet(false)}
        vlessLink={subscription.vlessLink}
      />
    </>
  );
}