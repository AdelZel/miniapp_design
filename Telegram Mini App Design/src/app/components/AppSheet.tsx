import { useState } from 'react';
import { Drawer } from 'vaul';
import { Copy, ExternalLink, QrCode, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { QRCodeModal } from './QRCodeModal';

interface AppSheetProps {
  isOpen: boolean;
  onClose: () => void;
  platform: string;
  vlessLink: string;
}

export function AppSheet({ isOpen, onClose, platform, vlessLink }: AppSheetProps) {
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);

  const apps = {
    android: ['Happ', 'V2RayTun', 'Другое'],
    ios: ['Happ', 'Shadowrocket', 'Hiddify', 'Другое'],
    windows: ['Happ', 'v2rayN', 'Nekoray', 'Другое'],
    macos: ['Happ', 'Clash Verge Rev', 'Hiddify', 'Другое'],
  };

  const platformApps = apps[platform as keyof typeof apps] || [];

  const handleCopy = () => {
    navigator.clipboard.writeText(vlessLink);
    toast.success('Ссылка скопирована!');
  };

  const handleOpenApp = (app: string) => {
    if (app === 'Другое') {
      setSelectedApp(app);
    } else {
      // Try to open the app with vless link
      window.open(vlessLink, '_blank');
      toast.info('Если приложение не открылось, скачайте его из магазина');
      setSelectedApp(app);
    }
  };

  const handleBack = () => {
    if (selectedApp) {
      setSelectedApp(null);
    } else {
      onClose();
    }
  };

  const getPlatformName = () => {
    const names: Record<string, string> = {
      android: 'Android',
      ios: 'iOS',
      windows: 'Windows',
      macos: 'macOS',
    };
    return names[platform] || platform;
  };

  const instructions = {
    Happ: [
      '1. Откройте приложение Happ',
      '2. Нажмите кнопку "+" для добавления нового подключения',
      '3. Вставьте скопированную ссылку или отсканируйте QR-код',
    ],
    V2RayTun: [
      '1. Откройте приложение V2RayTun',
      '2. Нажмите "Добавить конфигурацию"',
      '3. Вставьте ссылку в поле или отсканируйте QR-код',
    ],
    default: [
      '1. Откройте ваше VPN-приложение',
      '2. Найдите раздел добавления нового подключения',
      '3. Вставьте скопированную ссылку или отсканируйте QR-код',
    ],
  };

  const getInstructions = (app: string) => {
    return instructions[app as keyof typeof instructions] || instructions.default;
  };

  return (
    <>
      <Drawer.Root open={isOpen} onOpenChange={onClose}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="bg-[#1A1A1A] flex flex-col rounded-t-[24px] h-[70%] mt-24 fixed bottom-0 left-0 right-0">
            <div className="p-6 flex-1 overflow-auto">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-600 mb-6" />
              
              {!selectedApp ? (
                <>
                  <div className="flex items-center mb-6">
                    <button
                      onClick={onClose}
                      className="mr-4 text-gray-400 hover:text-white transition-colors"
                      aria-label="Назад к выбору платформы"
                    >
                      <ArrowLeft size={24} />
                    </button>
                    <h2 className="text-xl text-white">Выберите приложение</h2>
                  </div>
                  <div className="space-y-3">
                    {platformApps.map((app) => (
                      <button
                        key={app}
                        onClick={() => handleOpenApp(app)}
                        className="w-full bg-[#0F0F0F] hover:bg-[#252525] transition-colors rounded-xl p-4 flex items-center justify-between"
                      >
                        <span className="text-white text-lg">{app}</span>
                        <ExternalLink size={20} className="text-gray-400" />
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center mb-4">
                    <button
                      onClick={handleBack}
                      className="mr-4 text-gray-400 hover:text-white transition-colors"
                      aria-label="Назад к выбору приложения"
                    >
                      <ArrowLeft size={24} />
                    </button>
                    <h2 className="text-xl text-white">Применить конфигурацию</h2>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    {selectedApp} · {getPlatformName()}
                  </p>
                  <p className="text-gray-400 text-sm mb-6">
                    Сканируй QR-код или скопируй конфигурацию и вставь в приложение
                  </p>

                  <div className="bg-[#0F0F0F] rounded-xl p-4 mb-4">
                    <p className="text-xs text-gray-400 break-all">{vlessLink}</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <button
                      onClick={() => setShowQR(true)}
                      className="w-full bg-white text-black py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                    >
                      <QrCode size={20} />
                      Показать QR-код
                    </button>
                    <button
                      onClick={handleCopy}
                      className="w-full bg-white text-black py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                    >
                      <Copy size={20} />
                      Скопировать ссылку
                    </button>
                  </div>

                  <div className="bg-[#0F0F0F] rounded-xl p-4">
                    <h3 className="text-white mb-3">Инструкция</h3>
                    {getInstructions(selectedApp).map((step, index) => (
                      <p key={index} className="text-sm text-gray-300 mb-2">
                        {step}
                      </p>
                    ))}
                  </div>
                </>
              )}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      <QRCodeModal
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        content={vlessLink}
      />
    </>
  );
}