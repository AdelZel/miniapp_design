import { Copy, Check, Users, Gift, Share2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const referralLink = 'https://t.me/CloakVPNBot?start=ref_12345';
  const stats = {
    invited: 12,
    daysGifted: 45,
    totalEarnings: 120,
  };

  const recentReferrals = [
    { id: 1, name: 'Иван И.', date: '2 дня назад', status: 'Активен', earned: 15 },
    { id: 2, name: 'Мария С.', date: '5 дней назад', status: 'Активен', earned: 25 },
    { id: 3, name: 'Алексей К.', date: '1 неделя назад', status: 'Истёк', earned: 10 },
    { id: 4, name: 'Ольга В.', date: '2 недели назад', status: 'Активен', earned: 30 },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Ссылка скопирована!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const text = encodeURIComponent('Попробуй Cloak VPN - быстрый и надёжный VPN! Получи 2 дня бесплатно по моей ссылке 🚀');
    const url = encodeURIComponent(referralLink);
    
    // Try Telegram share if available
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${url}&text=${text}`);
    } else {
      // Fallback to Web Share API
      if (navigator.share) {
        navigator.share({
          title: 'Cloak VPN',
          text: 'Попробуй Cloak VPN - быстрый и надёжный VPN! Получи 2 дня бесплатно по моей ссылке 🚀',
          url: referralLink,
        }).catch(() => {
          toast.error('Не удалось поделиться');
        });
      } else {
        handleCopy();
      }
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl mb-6">Рефералы</h2>

      <div className="bg-[#1A1A1A] rounded-2xl p-6 mb-6">
        <p className="text-sm text-gray-400 mb-2">Ваша реферальная ссылка</p>
        <div className="flex items-center gap-2 bg-[#0F0F0F] rounded-xl p-3 mb-3">
          <p className="text-sm text-white flex-1 truncate">{referralLink}</p>
          <button
            onClick={handleCopy}
            className="bg-[#00BFFF] text-black p-2 rounded-lg hover:bg-[#00A5E6] transition-colors"
            aria-label="Копировать ссылку"
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </div>
        <button
          onClick={handleShare}
          className="w-full bg-[#00BFFF] text-black py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#00A5E6] transition-colors"
        >
          <Share2 size={20} />
          Поделиться ссылкой
        </button>
      </div>

      <div className="bg-[#1A1A1A] rounded-2xl p-6 mb-6">
        <h3 className="text-lg mb-4">Статистика</h3>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div className="bg-[#0F0F0F] rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users size={20} className="text-[#00BFFF]" />
            </div>
            <p className="text-3xl text-[#00BFFF] mb-1">{stats.invited}</p>
            <p className="text-sm text-gray-400">Приглашено</p>
          </div>
          <div className="bg-[#0F0F0F] rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Gift size={20} className="text-[#00BFFF]" />
            </div>
            <p className="text-3xl text-[#00BFFF] mb-1">{stats.daysGifted}</p>
            <p className="text-sm text-gray-400">Дней подарено</p>
          </div>
        </div>
        <div className="bg-[#0F0F0F] rounded-xl p-4 text-center">
          <p className="text-sm text-gray-400 mb-1">Заработано</p>
          <p className="text-2xl text-white">{stats.totalEarnings} ₽</p>
        </div>
      </div>

      {/* Recent Referrals */}
      <div className="bg-[#1A1A1A] rounded-2xl p-6 mb-6">
        <h3 className="text-lg mb-4">Последние рефералы</h3>
        <div className="space-y-3">
          {recentReferrals.map((referral) => (
            <div
              key={referral.id}
              className="bg-[#0F0F0F] rounded-xl p-3 flex items-center justify-between"
            >
              <div>
                <p className="text-white text-sm">{referral.name}</p>
                <p className="text-xs text-gray-400">{referral.date}</p>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm mb-1 ${
                    referral.status === 'Активен' ? 'text-green-500' : 'text-gray-400'
                  }`}
                >
                  {referral.status}
                </p>
                <p className="text-xs text-[#00BFFF]">+{referral.earned} ₽</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#1A1A1A] rounded-2xl p-6">
        <h3 className="text-lg mb-3">Правила программы</h3>
        <p className="text-sm text-gray-300 leading-relaxed">
          Приглашённый получает 2 дня бесплатно. Вы получаете 20% от всех его платежей навсегда.
        </p>
      </div>
    </div>
  );
}