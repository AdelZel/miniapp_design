export type Tab = 'home' | 'subscriptions' | 'referrals' | 'settings';

export interface Subscription {
  id: string;
  vlessLink: string;
  devices: number;
  expiresAt: Date;
  isTrial: boolean;
  trialUsed: boolean;
}

// Telegram WebApp types
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        openTelegramLink: (url: string) => void;
        close: () => void;
        expand: () => void;
        ready: () => void;
      };
    };
  }
}