import { useState } from 'react';
import { Drawer } from 'vaul';
import { Smartphone, Apple, Monitor, Laptop } from 'lucide-react';
import { AppSheet } from './AppSheet';

interface PlatformSheetProps {
  isOpen: boolean;
  onClose: () => void;
  vlessLink: string;
}

export function PlatformSheet({ isOpen, onClose, vlessLink }: PlatformSheetProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [showAppSheet, setShowAppSheet] = useState(false);

  const platforms = [
    { id: 'android', label: 'Android', icon: Smartphone },
    { id: 'ios', label: 'iOS', icon: Apple },
    { id: 'windows', label: 'Windows', icon: Monitor },
    { id: 'macos', label: 'macOS', icon: Laptop },
  ];

  const handlePlatformSelect = (platformId: string) => {
    setSelectedPlatform(platformId);
    setShowAppSheet(true);
    // Don't close the platform sheet, just hide it
  };

  const handleAppSheetClose = () => {
    setShowAppSheet(false);
    setSelectedPlatform(null);
    // Show platform sheet again when app sheet closes
  };

  const handlePlatformSheetClose = () => {
    if (!showAppSheet) {
      setSelectedPlatform(null);
      onClose();
    }
  };

  return (
    <>
      <Drawer.Root open={isOpen && !showAppSheet} onOpenChange={handlePlatformSheetClose}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="bg-[#1A1A1A] flex flex-col rounded-t-[24px] h-[50%] mt-24 fixed bottom-0 left-0 right-0">
            <div className="p-6 flex-1 overflow-auto">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-600 mb-6" />
              <h2 className="text-xl text-white mb-6">Выберите платформу</h2>
              
              <div className="space-y-3">
                {platforms.map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <button
                      key={platform.id}
                      onClick={() => handlePlatformSelect(platform.id)}
                      className="w-full bg-[#0F0F0F] hover:bg-[#252525] transition-colors rounded-xl p-4 flex items-center gap-4"
                    >
                      <Icon size={24} className="text-[#00BFFF]" />
                      <span className="text-white text-lg">{platform.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      {selectedPlatform && (
        <AppSheet
          isOpen={showAppSheet}
          onClose={handleAppSheetClose}
          platform={selectedPlatform}
          vlessLink={vlessLink}
        />
      )}
    </>
  );
}