import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import { VideoControls } from "./components/VideoControls";
import { IVideoState } from "./types/player";

interface IAppState {
  videoState: IVideoState;
  videoUrl: string;
}

const App: React.FC = () => {
  const playerRef = useRef<HTMLVideoElement>(null);
  const [appState, setAppState] = useState<IAppState>({
    videoState: {
      playing: false,
      volume: 0.8,
      muted: false,
      played: 0,
      loaded: 0,
      duration: 0,
      seeking: false,
      playbackRate: 1,
    },
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Sample video
  });

  // Monitor video progress, duration, and playback rate
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current) {
        const video = playerRef.current;
        const currentTime = video.currentTime;
        const duration = video.duration;
        const playbackRate = video.playbackRate;

        if (duration > 0) {
          setAppState((prev) => ({
            ...prev,
            videoState: {
              ...prev.videoState,
              played: currentTime / duration,
              duration: duration,
              playbackRate: playbackRate,
              playing: !video.paused,
            },
          }));
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handlePlay = useCallback(() => {
    setAppState((prev) => ({
      ...prev,
      videoState: { ...prev.videoState, playing: true },
    }));
  }, []);

  const handlePause = useCallback(() => {
    setAppState((prev) => ({
      ...prev,
      videoState: { ...prev.videoState, playing: false },
    }));
  }, []);

  const handleSeek = useCallback((seekTo: number) => {
    if (playerRef.current) {
      const video = playerRef.current;
      const duration = video.duration;
      if (duration > 0) {
        video.currentTime = seekTo * duration;
        setAppState((prev) => ({
          ...prev,
          videoState: { ...prev.videoState, played: seekTo },
        }));
      }
    }
  }, []);

  const handleVolumeChange = useCallback((volume: number) => {
    if (playerRef.current) {
      playerRef.current.volume = volume;
    }
    setAppState((prev) => ({
      ...prev,
      videoState: { ...prev.videoState, volume, muted: volume === 0 },
    }));
  }, []);

  const handleMute = useCallback((muted: boolean) => {
    if (playerRef.current) {
      playerRef.current.muted = muted;
    }
    setAppState((prev) => ({
      ...prev,
      videoState: { ...prev.videoState, muted },
    }));
  }, []);

  const handlePlaybackRateChange = useCallback((playbackRate: number) => {
    if (playerRef.current) {
      playerRef.current.playbackRate = playbackRate;
    }
    setAppState((prev) => ({
      ...prev,
      videoState: { ...prev.videoState, playbackRate },
    }));
  }, []);

  const handleUrlChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setAppState((prev) => ({
        ...prev,
        videoUrl: event.target.value,
      }));
    },
    []
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Player de Vídeo React POC
        </h1>

        {/* URL Input */}
        <div className="mb-6">
          <label htmlFor="video-url" className="block text-sm font-medium mb-2">
            URL do Vídeo:
          </label>
          <input
            id="video-url"
            type="text"
            value={appState.videoUrl}
            onChange={handleUrlChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Digite a URL do vídeo (YouTube, Vimeo ou arquivo direto)"
          />
        </div>

        {/* Video Player Container */}
        <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl h-96">
          <ReactPlayer
            ref={playerRef}
            src={appState.videoUrl}
            playing={appState.videoState.playing}
            volume={appState.videoState.muted ? 0 : appState.videoState.volume}
            playbackRate={appState.videoState.playbackRate}
            width="100%"
            height="100%"
          />

          {/* Video Controls */}
          <div className="absolute bottom-0 left-0 right-0">
            <VideoControls
              videoState={appState.videoState}
              onPlay={handlePlay}
              onPause={handlePause}
              onSeek={handleSeek}
              onVolumeChange={handleVolumeChange}
              onMute={handleMute}
              onPlaybackRateChange={handlePlaybackRateChange}
            />
          </div>
        </div>

        {/* Video Info */}
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Informações do Vídeo</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Status:</span>
              <span className="ml-2">
                {appState.videoState.playing ? "Reproduzindo" : "Pausado"}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Duração:</span>
              <span className="ml-2">
                {Math.floor(appState.videoState.duration)}s
              </span>
            </div>
            <div>
              <span className="text-gray-400">Progresso:</span>
              <span className="ml-2">
                {Math.floor(
                  appState.videoState.played * appState.videoState.duration
                )}
                s
              </span>
            </div>
            <div>
              <span className="text-gray-400">Volume:</span>
              <span className="ml-2">
                {Math.round(appState.videoState.volume * 100)}%
              </span>
            </div>
            <div>
              <span className="text-gray-400">Velocidade:</span>
              <span className="ml-2">{appState.videoState.playbackRate}x</span>
            </div>
            <div>
              <span className="text-gray-400">Mudo:</span>
              <span className="ml-2">
                {appState.videoState.muted ? "Sim" : "Não"}
              </span>
            </div>
          </div>
        </div>

        {/* Debug Panel */}
        <div className="mt-4 p-4 bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-yellow-400">
            Informações de Debug
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-400">Progresso Bruto:</span>
              <span className="ml-2 text-green-400">
                {appState.videoState.played.toFixed(3)}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Duração Bruta:</span>
              <span className="ml-2 text-green-400">
                {appState.videoState.duration.toFixed(1)}s
              </span>
            </div>
            <div>
              <span className="text-gray-400">Velocidade Bruta:</span>
              <span className="ml-2 text-green-400">
                {appState.videoState.playbackRate.toFixed(2)}x
              </span>
            </div>
            <div>
              <span className="text-gray-400">Volume Bruto:</span>
              <span className="ml-2 text-green-400">
                {appState.videoState.volume.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Referência do Player:</span>
              <span className="ml-2 text-green-400">
                {playerRef.current ? "Conectado" : "Não Conectado"}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Intervalo de Atualização:</span>
              <span className="ml-2 text-green-400">Ativo (100ms)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

App.displayName = "App";

export default App;
