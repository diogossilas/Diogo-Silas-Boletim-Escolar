import { useState, useEffect, useCallback } from 'react';
import { ViewTab } from '../types/navigation';

export interface DisplayModeState {
  isTvMode: boolean;
  isFullscreen: boolean;
  isAutoPresenting: boolean;
  toggleTvMode: () => void;
  toggleFullscreen: () => void;
  toggleAutoPresenting: () => void;
}

const PRESENTATION_TABS: ViewTab[] = [
  'all',
  'evolution',
  'radar',
  'heatmap',
  'attendance',
  'qualitative',
  'architecture',
];

export function useDisplayMode(onTabCycle?: (nextTab: ViewTab) => void) {
  const [isTvMode, setIsTvMode] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isAutoPresenting, setIsAutoPresenting] = useState<boolean>(false);

  // Monitor fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleTvMode = useCallback(() => {
    setIsTvMode((prev) => !prev);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // Graceful fallback if fullscreen is blocked by browser/iframe policy
      setIsFullscreen((prev) => !prev);
    }
  }, []);

  const toggleAutoPresenting = useCallback(() => {
    setIsAutoPresenting((prev) => !prev);
  }, []);

  // Auto-cycle through tabs when in TV auto-presentation mode (every 14s)
  useEffect(() => {
    if (!isAutoPresenting || !onTabCycle) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % PRESENTATION_TABS.length;
      onTabCycle(PRESENTATION_TABS[currentIndex]);
    }, 14000);

    return () => clearInterval(interval);
  }, [isAutoPresenting, onTabCycle]);

  return {
    isTvMode,
    isFullscreen,
    isAutoPresenting,
    toggleTvMode,
    toggleFullscreen,
    toggleAutoPresenting,
  };
}
