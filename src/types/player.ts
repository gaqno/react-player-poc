export interface IVideoProgress {
  played: number;
  playedSeconds: number;
  loaded: number;
  loadedSeconds: number;
}

export interface IVideoState {
  playing: boolean;
  volume: number;
  muted: boolean;
  played: number;
  loaded: number;
  duration: number;
  seeking: boolean;
  playbackRate: number;
}

export interface IVideoAnalytics {
  videoId: string;
  videoUrl: string;
  startTime: Date;
  endTime?: Date;
  totalWatched: number;
  percentageWatched: number;
  completed: boolean;
  userLeftPage: boolean;
  lastPosition: number;
}

export interface IPlayerConfig {
  youtube?: {
    playerVars?: {
      [key: string]: any;
    };
  };
  vimeo?: {
    playerOptions?: {
      [key: string]: any;
    };
  };
  file?: {
    attributes?: {
      [key: string]: any;
    };
  };
}

export interface IVideoSource {
  id: string;
  title: string;
  url: string;
  type: 'youtube' | 'vimeo' | 'file' | 'hls' | 'dash';
  thumbnail?: string;
  duration?: number;
  description?: string;
}

export interface IPlayerProps {
  src: string;
  title?: string;
  onProgress?: (progress: IVideoProgress) => void;
  onDuration?: (duration: number) => void;
  onEnded?: () => void;
  onError?: (error: any) => void;
  onUserLeave?: (analytics: IVideoAnalytics) => void;
  config?: IPlayerConfig;
  controls?: boolean;
  width?: string | number;
  height?: string | number;
  light?: boolean | string;
  playing?: boolean;
  volume?: number;
  muted?: boolean;
  loop?: boolean;
  playbackRate?: number;
} 