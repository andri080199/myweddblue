import { useState, useEffect } from 'react';

interface ComponentSettings {
  showFullScreenImage: boolean;
  showKutipanAyat: boolean;
  showWelcome: boolean;
  showLoveStory: boolean;
  showTimeline: boolean;
  showWeddingEvent: boolean;
  showAkadInfo: boolean;
  showResepsiInfo: boolean;
  showWeddingGift: boolean;
  showBankCards: boolean;
  showGiftAddress: boolean;
  showGallery: boolean;
  showRSVP: boolean;
  showGuestBook: boolean;
  showFooter: boolean;
  showNavbar: boolean;
  showMusic: boolean;
}

const defaultSettings: ComponentSettings = {
  showFullScreenImage: true,
  showKutipanAyat: true,
  showWelcome: true,
  showLoveStory: true,
  showTimeline: true,
  showWeddingEvent: true,
  showAkadInfo: true,
  showResepsiInfo: true,
  showWeddingGift: true,
  showBankCards: true,
  showGiftAddress: true,
  showGallery: true,
  showRSVP: true,
  showGuestBook: true,
  showFooter: true,
  showNavbar: true,
  showMusic: true,
};

export const useComponentSettings = (clientSlug: string) => {
  const [settings, setSettings] = useState<ComponentSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!clientSlug) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/client-content?clientSlug=${clientSlug}&contentType=component_settings`);
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0 && data[0].content_data) {
            const savedSettings = data[0].content_data;
            // Convert string to boolean
            const convertedSettings: ComponentSettings = { ...defaultSettings };
            Object.keys(defaultSettings).forEach(key => {
              const value = savedSettings[key];
              convertedSettings[key as keyof ComponentSettings] = value === 'true' || value === true;
            });
            setSettings(convertedSettings);
          }
        }
      } catch (error) {
        console.error('Error fetching component settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [clientSlug]);

  return { settings, loading };
};