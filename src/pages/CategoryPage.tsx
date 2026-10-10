import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { videoService } from '../services/videoService';
import { Video } from '../types';
import { VideoGrid } from '../components/VideoGrid';
import { Layers } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const formattedCategory = categorySlug
    ? categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).toLowerCase()
    : 'Category';

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const loadCategoryVideos = async () => {
      const data = await videoService.getVideos({
        category: formattedCategory,
      });
      if (isMounted) {
        setVideos(data.filter(v => !v.isShort));
        setIsLoading(false);
      }
    };

    loadCategoryVideos();
    return () => {
      isMounted = false;
    };
  }, [categorySlug, formattedCategory]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3 pb-3 border-b border-[#2A3040]/70">
        <div className="w-10 h-10 rounded-xl bg-[#7C5CFC]/20 text-[#7C5CFC] flex items-center justify-center border border-[#7C5CFC]/30">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#F5F7FA]">{formattedCategory}</h1>
          <p className="text-xs text-[#A3AABD]">Explore curated videos in {formattedCategory}</p>
        </div>
      </div>

      <VideoGrid
        videos={videos}
        isLoading={isLoading}
        emptyTitle={`No videos in ${formattedCategory}`}
        emptyDescription={`There are currently no videos uploaded in the ${formattedCategory} category.`}
      />
    </div>
  );
};
