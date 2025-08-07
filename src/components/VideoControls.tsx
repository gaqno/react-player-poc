import React from "react";
import { IVideoState } from "../types/player";

interface IVideoControlsProps {
  videoState: IVideoState;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (seekTo: number) => void;
  onVolumeChange: (volume: number) => void;
  onMute: (muted: boolean) => void;
  onPlaybackRateChange: (rate: number) => void;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

export const VideoControls: React.FC<IVideoControlsProps> = ({
  videoState,
  onPlay,
  onPause,
  onSeek,
  onVolumeChange,
  onMute,
  onPlaybackRateChange,
}) => {
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTo = parseFloat(e.target.value);
    onSeek(seekTo);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    onVolumeChange(volume);
  };

  const toggleMute = () => {
    onMute(!videoState.muted);
  };

  const togglePlay = () => {
    if (videoState.playing) {
      onPause();
    } else {
      onPlay();
    }
  };

  return (
    <div className="bg-black/80 p-2.5 rounded-lg mt-2.5">
      <div className="flex items-center gap-4">
        {/* Botão Play/Pause */}
        <button
          className="bg-transparent border-none text-white text-lg cursor-pointer p-1.5 rounded transition-colors hover:bg-white/10"
          onClick={togglePlay}
          aria-label={videoState.playing ? "Pause" : "Play"}
        >
          {videoState.playing ? "⏸️" : "▶️"}
        </button>

        {/* Progress Bar */}
        <div className="flex-1 flex flex-col gap-1.5">
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={videoState.played}
            onChange={handleSeek}
            className="w-full h-1 rounded bg-white/30 outline-none cursor-pointer appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <div className="text-white text-xs text-center">
            {formatTime(videoState.played * videoState.duration)} /{" "}
            {formatTime(videoState.duration)}
          </div>
        </div>

        {/* Volume Controls */}
        <div className="flex items-center gap-2">
          <button
            className="bg-transparent border-none text-white text-lg cursor-pointer p-1.5 rounded transition-colors hover:bg-white/10"
            onClick={toggleMute}
            aria-label={videoState.muted ? "Unmute" : "Mute"}
          >
            {videoState.muted || videoState.volume === 0 ? "🔇" : "🔊"}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={videoState.muted ? 0 : videoState.volume}
            onChange={handleVolumeChange}
            className="w-15 h-1 rounded bg-white/30 outline-none cursor-pointer appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>

        {/* Playback Rate */}
        <select
          value={videoState.playbackRate}
          onChange={(e) => onPlaybackRateChange(parseFloat(e.target.value))}
          className="bg-white/10 border border-white/30 text-white px-2 py-1 rounded text-xs cursor-pointer"
        >
          {playbackRates.map((rate) => (
            <option key={rate} value={rate}>
              {rate}x
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

VideoControls.displayName = "VideoControls";
