import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Bell, Check } from 'lucide-react';

interface SubscribeButtonProps {
  channelId: string;
  channelName?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SubscribeButton: React.FC<SubscribeButtonProps> = ({
  channelId,
  channelName,
  size = 'md',
}) => {
  const { isSubscribed, toggleSubscribe } = useApp();
  const subscribed = isSubscribed(channelId);

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  }[size];

  return (
    <button
      onClick={() => toggleSubscribe(channelId, channelName)}
      className={`font-semibold rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shrink-0 ${sizeClasses} ${
        subscribed
          ? 'bg-[#202635] hover:bg-[#2A3040] text-[#F5F7FA] border border-[#2A3040]'
          : 'bg-[#7C5CFC] hover:bg-[#9278FF] text-white shadow-md shadow-[#7C5CFC]/25'
      }`}
    >
      {subscribed ? (
        <>
          <Check className="w-4 h-4 text-[#35C98A]" />
          <span>Subscribed</span>
          <Bell className="w-3.5 h-3.5 text-[#A3AABD] ml-0.5" />
        </>
      ) : (
        <span>Subscribe</span>
      )}
    </button>
  );
};
