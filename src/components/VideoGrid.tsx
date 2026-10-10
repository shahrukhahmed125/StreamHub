import React from 'react';
import { Video } from '../types';
import { VideoCard } from './VideoCard';
import { VideoCardSkeleton, EmptyState } from './EmptyState';
import { Film } from 'lucide-react';

interface VideoGridProps {
  videos: Video[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  columns?: 'standard' | 'compact' | 'wide';
}

export const VideoGrid: React.FC<VideoGridProps> = ({
  videos,
  isLoading = false,
  emptyTitle = 'No videos found',
  emptyDescription = 'Try adjusting your search query or filters to discover other content.',
  columns = 'standard',
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <VideoCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <EmptyState
        icon={Film}
        title={emptyTitle}
        description={emptyDescription}
        actionText="Explore Trending"
        actionHref="/trending"
      />
    );
  }

  const gridColsClass = {
    standard: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4',
    compact: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    wide: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
  }[columns];

  return (
    <div className={`grid ${gridColsClass} gap-x-4 gap-y-7`}>
      {videos.map(video => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
};
