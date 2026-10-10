import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  actionHref,
  onActionClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-[#12151D] border border-[#2A3040]/60 my-6">
      <div className="w-16 h-16 rounded-2xl bg-[#202635] flex items-center justify-center text-[#7C5CFC] mb-4 shadow-inner">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-[#F5F7FA] mb-1">{title}</h3>
      <p className="text-sm text-[#A3AABD] max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionText && (
        actionHref ? (
          <Link
            to={actionHref}
            className="px-5 py-2.5 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] text-white font-medium text-sm transition-all shadow-md shadow-[#7C5CFC]/20"
          >
            {actionText}
          </Link>
        ) : (
          <button
            onClick={onActionClick}
            className="px-5 py-2.5 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] text-white font-medium text-sm transition-all shadow-md shadow-[#7C5CFC]/20"
          >
            {actionText}
          </button>
        )
      )}
    </div>
  );
};

export const VideoCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="w-full aspect-video rounded-xl bg-[#181C26] border border-[#2A3040]/50" />
      <div className="flex gap-3 px-1">
        <div className="w-9 h-9 rounded-full bg-[#181C26] shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-[#181C26] rounded-md w-4/5" />
          <div className="h-3 bg-[#181C26] rounded-md w-1/2" />
        </div>
      </div>
    </div>
  );
};
