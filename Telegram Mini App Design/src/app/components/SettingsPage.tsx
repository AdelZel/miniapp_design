import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import type { Subscription } from '../types';
import { toast } from 'sonner';
import * as Accordion from '@radix-ui/react-accordion';

interface SettingsPageProps {
  subscription: Subscription | null;
  activateTrial: () => void;
  trialUsed: boolean;
}

export function SettingsPage({ subscription, activateTrial, trialUsed }: SettingsPageProps) {
  const [promoCode, setPromoCode] = useState('');

  const userData = {
    name: 'Иван Иванов',
    id: '123456789',
  };

  const faqItems = [
    { q: 'Как настроить VPN на моём устройстве?', a: 'Выберите вашу платформу в разделе "Подключиться", затем следуйте инструкциям для выбранного приложения.' },
    { q: 'Что делать если VPN не подключается?', a: 'Проверьте интернет-соединение, убедитесь что вы скопировали правильную ссылку, попробуйте переустановить приложение.' },
    { q: 'Можно ли использовать одну подписку на нескольких устройствах?', a: 'Да, при покупке подписки вы можете выбрать количество устройств от 1 до 10.' },
    { q: 'Как продлить подписку?', a: 'Перейдите в раздел "Подписки", нажмите кнопку "Продлить" и выберите желаемый период.' },
    { q: 'Что такое реферальная программа?', a: 'Приглашайте друзей и получайте 20% от всех их платежей навсегда. Приглашённый получает 2 дня бесплатно.' },
    { q: 'Как использовать промокод?', a: 'Введите промокод в поле ниже и нажмите "Применить". Промокод может давать дополнительные дни или скидку.' },
    { q: 'Можно ли вернуть деньги?', a: 'Возврат возможен в течение 7 дней с момента покупки, если услуга не была использована.' },
    { q: 'Какие страны доступны для подключения?', a: 'Доступны серверы в 15+ странах включая США, Германию, Нидерланды, Сингапур и другие.' },
  ];

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      toast.error('Введите промокод');
      return;
    }

    // Mock promo code logic
    if (promoCode === 'TRIAL3' && !trialUsed) {
      activateTrial();
      toast.success('Промокод применён! Пробный период активирован.');
      setPromoCode('');
    } else {
      toast.success('Промокод применён!');
      setPromoCode('');
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto pb-8">
      <h2 className="text-2xl mb-6">Настройки</h2>

      {/* User Info */}
      <div className="bg-[#1A1A1A] rounded-2xl p-6 mb-4">
        <p className="text-sm text-gray-400 mb-1">Имя</p>
        <p className="text-white mb-3">{userData.name}</p>
        <p className="text-sm text-gray-400 mb-1">Telegram ID</p>
        <p className="text-white">{userData.id}</p>
      </div>

      {/* Current Subscription */}
      {subscription && (
        <div className="bg-[#1A1A1A] rounded-2xl p-6 mb-4">
          <p className="text-sm text-gray-400 mb-2">Текущая подписка</p>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white">#{subscription.id}</p>
              <p className="text-sm text-gray-400">{subscription.devices} устройств</p>
            </div>
            <div className="bg-[#2A2A2A] px-3 py-1 rounded-lg">
              <p className="text-sm text-white">VLESS</p>
            </div>
          </div>
        </div>
      )}

      {/* Promo Code */}
      <div className="bg-[#1A1A1A] rounded-2xl p-6 mb-4">
        <p className="text-sm text-gray-400 mb-3">Промокод</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Введите промокод"
            className="flex-1 bg-[#0F0F0F] text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-[#00BFFF] transition-colors"
          />
          <button
            onClick={handleApplyPromo}
            className="bg-[#00BFFF] text-black px-6 py-3 rounded-xl hover:bg-[#00A5E6] transition-colors"
          >
            Применить
          </button>
        </div>
      </div>

      {/* How to Setup VPN */}
      <button className="w-full bg-[#1A1A1A] rounded-2xl p-6 mb-4 flex items-center justify-between hover:bg-[#202020] transition-colors">
        <span className="text-white">Как настроить VPN</span>
        <ChevronRight size={20} className="text-gray-400" />
      </button>

      {/* FAQ */}
      <div className="bg-[#1A1A1A] rounded-2xl p-6 mb-4">
        <h3 className="text-lg mb-4">FAQ</h3>
        <Accordion.Root type="single" collapsible>
          {faqItems.map((item, index) => (
            <Accordion.Item key={index} value={`item-${index}`} className="border-b border-gray-700 last:border-0">
              <Accordion.Header>
                <Accordion.Trigger className="w-full py-4 flex items-center justify-between text-left hover:text-[#00BFFF] transition-colors group">
                  <span className="text-white text-sm pr-4">{item.q}</span>
                  <ChevronDown size={20} className="text-gray-400 group-data-[state=open]:rotate-180 transition-transform flex-shrink-0" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="pb-4 text-sm text-gray-300 leading-relaxed">
                {item.a}
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>

      {/* Support */}
      <button className="w-full bg-[#1A1A1A] rounded-2xl p-6 mb-4 flex items-center justify-between hover:bg-[#202020] transition-colors">
        <span className="text-white">Связаться с поддержкой</span>
        <ChevronRight size={20} className="text-gray-400" />
      </button>

      {/* About */}
      <button className="w-full bg-[#1A1A1A] rounded-2xl p-6 flex items-center justify-between hover:bg-[#202020] transition-colors">
        <span className="text-white">О приложении</span>
        <ChevronRight size={20} className="text-gray-400" />
      </button>
    </div>
  );
}