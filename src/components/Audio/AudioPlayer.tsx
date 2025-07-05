import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  onPlayStateChange?: (isPlaying: boolean) => void;
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  title,
  onPlayStateChange,
  className = ''
}) => {
  const { theme } = useTheme();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      onPlayStateChange?.(false);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [audioUrl, onPlayStateChange]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
      onPlayStateChange?.(!isPlaying);
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = parseFloat(e.target.value);
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const skipTime = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      className={`p-4 rounded-xl backdrop-blur-sm border border-opacity-20 ${className}`}
      style={{ 
        backgroundColor: `${theme.colors.surface}60`,
        borderColor: theme.colors.accent 
      }}
    >
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      {/* Title */}
      <div className="mb-3">
        <h4 
          className="text-sm font-medium truncate"
          style={{ color: theme.colors.text }}
        >
          {title}
        </h4>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${theme.colors.primary} 0%, ${theme.colors.primary} ${progressPercentage}%, ${theme.colors.surface} ${progressPercentage}%, ${theme.colors.surface} 100%)`,
            }}
          />
        </div>
        <div className="flex justify-between text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Skip Back */}
          <button
            onClick={() => skipTime(-10)}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{ backgroundColor: `${theme.colors.primary}20` }}
          >
            <SkipBack 
              className="w-4 h-4" 
              style={{ color: theme.colors.primary }}
            />
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlayPause}
            disabled={isLoading}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-50"
            style={{ backgroundColor: theme.colors.primary }}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" style={{ color: theme.colors.background }} />
            ) : isPlaying ? (
              <Pause 
                className="w-5 h-5" 
                style={{ color: theme.colors.background }}
              />
            ) : (
              <Play 
                className="w-5 h-5 ml-0.5" 
                style={{ color: theme.colors.background }}
              />
            )}
          </button>

          {/* Skip Forward */}
          <button
            onClick={() => skipTime(10)}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{ backgroundColor: `${theme.colors.primary}20` }}
          >
            <SkipForward 
              className="w-4 h-4" 
              style={{ color: theme.colors.primary }}
            />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleMute}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{ backgroundColor: `${theme.colors.primary}20` }}
          >
            {isMuted ? (
              <VolumeX 
                className="w-4 h-4" 
                style={{ color: theme.colors.textSecondary }}
              />
            ) : (
              <Volume2 
                className="w-4 h-4" 
                style={{ color: theme.colors.primary }}
              />
            )}
          </button>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-16 h-1 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${theme.colors.primary} 0%, ${theme.colors.primary} ${(isMuted ? 0 : volume) * 100}%, ${theme.colors.surface} ${(isMuted ? 0 : volume) * 100}%, ${theme.colors.surface} 100%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
