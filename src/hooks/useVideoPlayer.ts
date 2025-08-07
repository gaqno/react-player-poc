import { useState, useEffect, useRef, useCallback } from 'react';
import { IVideoState, IVideoProgress, IVideoAnalytics } from '../types/player';

export const useVideoPlayer = (videoUrl: string, videoId: string) => {
  const [videoState, setVideoState] = useState<IVideoState>({
    playing: false,
    volume: 0.8,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    seeking: false,
    playbackRate: 1,
  });

  const [analytics, setAnalytics] = useState<IVideoAnalytics>({
    videoId,
    videoUrl,
    startTime: new Date(),
    totalWatched: 0,
    percentageWatched: 0,
    completed: false,
    userLeftPage: false,
    lastPosition: 0,
  });

  const startTimeRef = useRef<Date>(new Date());
  const lastProgressRef = useRef<IVideoProgress | null>(null);
  const isPageVisibleRef = useRef<boolean>(true);

  // Detectar quando o usuário sai da página
  useEffect(() => {
    const handleVisibilityChange = () => {
      isPageVisibleRef.current = !document.hidden;

      if (document.hidden && videoState.playing) {
        // Usuário saiu da página durante a reprodução
        setAnalytics(prev => ({
          ...prev,
          userLeftPage: true,
          lastPosition: videoState.played,
        }));
      }
    };

    const handleBeforeUnload = () => {
      if (videoState.playing) {
        setAnalytics(prev => ({
          ...prev,
          userLeftPage: true,
          lastPosition: videoState.played,
          endTime: new Date(),
        }));
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [videoState.playing, videoState.played]);

  const handleProgress = useCallback((progress: IVideoProgress) => {
    setVideoState(prev => ({
      ...prev,
      played: progress.played,
      loaded: progress.loaded,
    }));

    // Calcular tempo assistido
    if (lastProgressRef.current) {
      const timeDiff = progress.playedSeconds - lastProgressRef.current.playedSeconds;
      if (timeDiff > 0 && isPageVisibleRef.current) {
        setAnalytics(prev => ({
          ...prev,
          totalWatched: prev.totalWatched + timeDiff,
          percentageWatched: (progress.played / videoState.duration) * 100,
        }));
      }
    }

    lastProgressRef.current = progress;
  }, [videoState.duration]);

  const handleDuration = useCallback((duration: number) => {
    setVideoState(prev => ({
      ...prev,
      duration,
    }));
  }, []);

  const handleEnded = useCallback(() => {
    setVideoState(prev => ({
      ...prev,
      playing: false,
      played: 1,
    }));

    setAnalytics(prev => ({
      ...prev,
      completed: true,
      endTime: new Date(),
      percentageWatched: 100,
    }));
  }, []);

  const handlePlay = useCallback(() => {
    setVideoState(prev => ({
      ...prev,
      playing: true,
    }));

    if (!startTimeRef.current) {
      startTimeRef.current = new Date();
    }
  }, []);

  const handlePause = useCallback(() => {
    setVideoState(prev => ({
      ...prev,
      playing: false,
    }));
  }, []);

  const handleSeek = useCallback((seekTo: number) => {
    setVideoState(prev => ({
      ...prev,
      played: seekTo,
    }));
  }, []);

  const handleVolumeChange = useCallback((volume: number) => {
    setVideoState(prev => ({
      ...prev,
      volume,
    }));
  }, []);

  const handleMute = useCallback((muted: boolean) => {
    setVideoState(prev => ({
      ...prev,
      muted,
    }));
  }, []);

  const handlePlaybackRateChange = useCallback((playbackRate: number) => {
    setVideoState(prev => ({
      ...prev,
      playbackRate,
    }));
  }, []);

  const getAnalytics = useCallback(() => {
    return {
      ...analytics,
      endTime: analytics.endTime || new Date(),
    };
  }, [analytics]);

  return {
    videoState,
    analytics,
    handleProgress,
    handleDuration,
    handleEnded,
    handlePlay,
    handlePause,
    handleSeek,
    handleVolumeChange,
    handleMute,
    handlePlaybackRateChange,
    getAnalytics,
  };
}; 