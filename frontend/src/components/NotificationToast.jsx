import React from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const NotificationToast = () => {
  const { notification, dismissNotification } = useCart();

  if (!notification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-subtle max-w-sm">
      <div className="bg-botanical-800 text-cream-light px-5 py-4 rounded-2xl shadow-card flex items-center gap-3 border border-botanical-700/50">
        {notification.type === 'info' ? (
          <Info className="w-5 h-5 text-earth-300 flex-shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-botanical-300 flex-shrink-0" />
        )}
        <p className="text-sm font-medium leading-snug">{notification.message}</p>
        <button
          onClick={dismissNotification}
          className="ml-auto text-cream-light/60 hover:text-cream-light transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
