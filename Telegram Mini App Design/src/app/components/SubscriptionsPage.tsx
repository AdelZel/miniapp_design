import { useState } from 'react';
import type { Subscription } from '../types';
import { SubscriptionSheet } from './SubscriptionSheet';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as Slider from '@radix-ui/react-slider';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface SubscriptionsPageProps {
  subscription: Subscription | null;
  activateTrial: () => void;
  trialUsed: boolean;
  updateSubscription: (duration: number, devices: number) => void;
}

export function SubscriptionsPage({ subscription, activateTrial, trialUsed, updateSubscription }: SubscriptionsPageProps) {
  const [showSubSheet, setShowSubSheet] = useState(false);
  const [showRenewBlock, setShowRenewBlock] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState('1');
  const [deviceCount, setDeviceCount] = useState([1]);

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

  const handlePayment = () => {
    // Mock payment - in real app would redirect to payment URL
    updateSubscription(parseInt(selectedDuration), deviceCount[0]);
    setShowRenewBlock(false);
    alert('Перенаправление на оплату...');
  };

  const calculatePrice = (months: number, devices: number) => {
    const basePrice = 150; // Base price per month per device
    const monthlyPrice = basePrice * devices;
    
    // Discounts for longer periods
    const discounts: Record<number, number> = {
      1: 0,
      3: 10,
      6: 20,
      12: 30,
    };
    
    const discount = discounts[months] || 0;
    const totalPrice = monthlyPrice * months;
    const discountedPrice = totalPrice * (1 - discount / 100);
    
    return {
      original: totalPrice,
      discounted: Math.round(discountedPrice),
      discount,
    };
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl mb-6">Мои ключи</h2>

      {!subscription ? (
        <div className="text-center py-8">
          <p className="text-gray-400 mb-6">У вас пока нет активных ключей</p>
          
          {!trialUsed && (
            <button
              onClick={activateTrial}
              className="bg-white text-black px-8 py-3 rounded-xl mb-4 w-full hover:bg-gray-200 transition-colors"
            >
              Активировать пробный период 3 дня
            </button>
          )}
          
          <button
            onClick={() => setShowRenewBlock(true)}
            className="bg-[#00BFFF] text-black px-8 py-3 rounded-xl w-full hover:bg-[#00A5E6] transition-colors"
          >
            Купить подписку
          </button>
        </div>
      ) : (
        <div className="bg-[#1A1A1A] rounded-2xl p-6 mb-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Активный ключ</p>
              <p className="text-white">#{subscription.id}</p>
            </div>
            <div className="text-right">
              <p className="bg-[#2A2A2A] px-3 py-1 rounded-lg text-sm mb-1">VLESS</p>
              <p className="text-sm text-gray-400">{subscription.devices} устройств</p>
            </div>
          </div>

          <div className="my-6 py-4 border-y border-gray-700">
            <p className="text-xl text-center mb-4">
              {subscription.isTrial ? 'Пробный период' : getTimeRemaining(subscription.expiresAt)}
            </p>
            
            {/* Traffic Statistics */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-[#0F0F0F] rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <ArrowDown size={16} className="text-green-500" />
                  <p className="text-sm text-gray-400">Загружено</p>
                </div>
                <p className="text-lg text-white">12.3 ГБ</p>
              </div>
              <div className="bg-[#0F0F0F] rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <ArrowUp size={16} className="text-[#00BFFF]" />
                  <p className="text-sm text-gray-400">Отправлено</p>
                </div>
                <p className="text-lg text-white">3.7 ГБ</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowSubSheet(true)}
              className="flex-1 bg-white text-black py-3 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Мой ключ
            </button>
            <button
              onClick={() => setShowRenewBlock(!showRenewBlock)}
              className="flex-1 bg-white text-black py-3 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Продлить
            </button>
          </div>

          {showRenewBlock && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h3 className="text-lg mb-4">Выберите срок подписки</h3>
              
              <RadioGroup.Root value={selectedDuration} onValueChange={setSelectedDuration} className="mb-6">
                {[
                  { value: '1', label: '1 месяц', badge: null },
                  { value: '3', label: '3 месяца', badge: '-10%' },
                  { value: '6', label: '6 месяцев', badge: '-20%' },
                  { value: '12', label: '12 месяцев', badge: '-30%' },
                ].map((option) => {
                  const price = calculatePrice(parseInt(option.value), deviceCount[0]);
                  return (
                    <div key={option.value} className="flex items-center gap-3 mb-3">
                      <RadioGroup.Item
                        value={option.value}
                        className="w-5 h-5 rounded-full border-2 border-gray-400 data-[state=checked]:border-[#00BFFF] data-[state=checked]:bg-[#00BFFF] transition-colors flex-shrink-0"
                      >
                        <RadioGroup.Indicator className="flex items-center justify-center w-full h-full">
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </RadioGroup.Indicator>
                      </RadioGroup.Item>
                      <label className="text-white cursor-pointer flex-1 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span>{option.label}</span>
                          {option.badge && (
                            <span className="bg-green-500 text-black text-xs px-2 py-0.5 rounded-full">
                              {option.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          {price.discount > 0 && (
                            <span className="text-xs text-gray-500 line-through mr-2">
                              {price.original} ₽
                            </span>
                          )}
                          <span className="text-[#00BFFF]">{price.discounted} ₽</span>
                        </div>
                      </label>
                    </div>
                  );
                })}
              </RadioGroup.Root>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-white">Количество устройств</label>
                  <span className="text-[#00BFFF]">{deviceCount[0]}</span>
                </div>
                <Slider.Root
                  value={deviceCount}
                  onValueChange={setDeviceCount}
                  min={1}
                  max={10}
                  step={1}
                  className="relative flex items-center w-full h-5"
                >
                  <Slider.Track className="relative bg-gray-700 grow rounded-full h-2">
                    <Slider.Range className="absolute bg-[#00BFFF] rounded-full h-full" />
                  </Slider.Track>
                  <Slider.Thumb className="block w-5 h-5 bg-white rounded-full shadow-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00BFFF]" />
                </Slider.Root>
              </div>

              <button
                onClick={handlePayment}
                className="bg-[#00BFFF] text-black px-8 py-3 rounded-xl w-full hover:bg-[#00A5E6] transition-colors font-medium"
              >
                Оплатить {calculatePrice(parseInt(selectedDuration), deviceCount[0]).discounted} ₽
              </button>
            </div>
          )}
        </div>
      )}

      {subscription && (
        <SubscriptionSheet 
          isOpen={showSubSheet} 
          onClose={() => setShowSubSheet(false)}
          subscription={subscription}
        />
      )}
    </div>
  );
}