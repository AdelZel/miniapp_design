import { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { SubscriptionsPage } from './components/SubscriptionsPage';
import { ReferralsPage } from './components/ReferralsPage';
import { SettingsPage } from './components/SettingsPage';
import { BottomNav } from './components/BottomNav';
import { Toaster, toast } from 'sonner';
import type { Tab, Subscription } from './types';
import { motion, AnimatePresence } from 'motion/react';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [trialUsed, setTrialUsed] = useState(false);

  const activateTrial = () => {
    const newSub: Subscription = {
      id: 'cloak-trial-001',
      vlessLink: 'vless://c502a739-d6e4-4b8f-9f2a-8e7d6c5b4a3b@example.com:443?encryption=none&security=tls&type=ws&host=example.com&path=%2Fws#CloakVPN',
      devices: 1,
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      isTrial: true,
      trialUsed: true,
    };
    setSubscription(newSub);
    setTrialUsed(true);
    toast.success('Пробный период активирован на 3 дня!');
  };

  const updateSubscription = (newDuration: number, devices: number) => {
    if (subscription) {
      const newSub: Subscription = {
        ...subscription,
        devices,
        expiresAt: new Date(Date.now() + newDuration * 30 * 24 * 60 * 60 * 1000),
        isTrial: false,
      };
      setSubscription(newSub);
      toast.success(`Подписка продлена на ${newDuration} месяцев!`);
    }
  };

  // Check for expiring subscription
  useEffect(() => {
    if (subscription) {
      const checkExpiration = () => {
        const now = new Date();
        const diff = subscription.expiresAt.getTime() - now.getTime();
        const hoursLeft = diff / (1000 * 60 * 60);
        
        // Notify if less than 24 hours left
        if (hoursLeft > 0 && hoursLeft < 24 && !subscription.isTrial) {
          const hours = Math.floor(hoursLeft);
          toast.warning(`Подписка истекает через ${hours} часов. Продлите подписку!`, {
            duration: 5000,
          });
        }
      };

      checkExpiration();
      const interval = setInterval(checkExpiration, 3600000); // Check every hour
      
      return () => clearInterval(interval);
    }
  }, [subscription]);

  const renderPage = () => {
    const pageVariants = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    };

    const transition = {
      duration: 0.2,
      ease: 'easeInOut',
    };

    const pages = {
      home: <HomePage subscription={subscription} activateTrial={activateTrial} trialUsed={trialUsed} />,
      subscriptions: <SubscriptionsPage subscription={subscription} activateTrial={activateTrial} trialUsed={trialUsed} updateSubscription={updateSubscription} />,
      referrals: <ReferralsPage />,
      settings: <SettingsPage subscription={subscription} activateTrial={activateTrial} trialUsed={trialUsed} />,
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transition}
        >
          {pages[activeTab]}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white pb-20">
      <Toaster theme="dark" />
      {renderPage()}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;