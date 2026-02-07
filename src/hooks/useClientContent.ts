'use client';

import { useState, useEffect } from 'react';

export interface ClientContent {
  couple_info?: {
    brideName: string;
    brideFullName: string;
    brideChildOrder: string;
    brideFatherName: string;
    brideMotherName: string;
    brideImage: string;
    groomName: string;
    groomFullName: string;
    groomChildOrder: string;
    groomFatherName: string;
    groomMotherName: string;
    groomImage: string;
    weddingImage: string;
  };
  wedding_info?: {
    weddingDate: string;
    akadTime: string;
    resepsiTime: string;
    venue: string;
    address: string;
    mapsLink: string;
  };
  akad_info?: {
    weddingDate: string;
    akadTime: string;
    venue: string;
    address: string;
    mapsLink: string;
  };
  resepsi_info?: {
    weddingDate: string;
    resepsiTime: string;
    venue: string;
    address: string;
    mapsLink: string;
  };
  kutipan_ayat?: {
    ayat: string;
    sumber: string;
  };
  love_story?: {
    story1: string;
    story1Visible?: boolean;
    story2: string;
    story2Visible?: boolean;
    story3: string;
    story3Visible?: boolean;
    story4?: string;
    story4Visible?: boolean;
  };
  wedding_gift?: {
    bankType1: string;
    accountNumber: string;
    accountName: string;
    bankType2: string;
    accountNumber2: string;
    accountName2: string;
  };
  gift_address?: {
    address: string;
  };
  gallery_video?: {
    youtubeUrl: string;
  };
}

export const useClientContent = (clientSlug: string) => {
  const [content, setContent] = useState<ClientContent>({});
  const [galleryPhotos, setGalleryPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchContent = async (isRefetch = false) => {
    try {
      // Only show full loading screen on initial load, not on refetch
      if (isRefetch) {
        setIsRefetching(true);
      } else {
        setLoading(true);
      }

      // Fetch all content types with cache busting
      const contentResponse = await fetch(`/api/client-content?clientSlug=${clientSlug}&t=${Date.now()}`);
      if (contentResponse.ok) {
        const contentData = await contentResponse.json();
        const contentMap: ClientContent = {};

        contentData.forEach((item: any) => {
          contentMap[item.content_type as keyof ClientContent] = item.content_data;
        });

        setContent(contentMap);
      }

      // Fetch gallery photos
      const galleryResponse = await fetch(`/api/client-gallery?clientSlug=${clientSlug}&t=${Date.now()}`);
      if (galleryResponse.ok) {
        const galleryData = await galleryResponse.json();
        setGalleryPhotos(galleryData);
      }
    } catch (error) {
      console.error('Error fetching client content:', error);
    } finally {
      setLoading(false);
      setIsRefetching(false);
    }
  };

  useEffect(() => {
    if (!clientSlug) return;
    // Check if this is a refetch (refreshKey > 0)
    fetchContent(refreshKey > 0);
  }, [clientSlug, refreshKey]);

  const refetch = () => {
    setRefreshKey(prev => prev + 1);
  };

  return { content, galleryPhotos, loading, isRefetching, refetch };
};