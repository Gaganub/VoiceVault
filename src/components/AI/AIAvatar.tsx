import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Sparkles, User } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Memory } from '../../types';

interface AIAvatarProps {
  memory: Memory;
  isPlaying?: boolean;
  onPlayToggle?: () => void;
}

export const AIAvatar: React.FC<AIAvatarProps> = ({ memory, isPlaying = false, onPlayToggle }) => {
  const { theme } = useTheme();
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Simulate AI avatar video generation
  const avatarVideoUrl = `https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop`;

  const handlePlayToggle = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onPlayToggle?.();
    }, 1500); // Simulate AI processing time
  };

  const moodGradients = {
    happy: 'from-yellow-400 to-orange-500',
    sad: 'from-blue-400 to-indigo-600',
    excited: 'from-pink-400 to-red-500',
    reflective: 'from-purple-400 to-indigo-500',
    neutral: 'from-gray-400 to-gray-600',
  };

  return (
    <div 
      className="relative w-full max-w-md mx-auto rounded-3xl overflow-hidden backdrop-blur-sm border border-opacity-20 group"
      style={{ 
        backgroundColor: `${theme.colors.surface}40`,
        borderColor: theme.colors.accent 
      }}
    >
      {/* Avatar Container */}
      <div className="relative aspect-square">
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${moodGradients[memory.mood]} opacity-20`}
        ></div>
        
        <img 
          src={avatarVideoUrl}
          alt="AI Avatar"
          className="w-full h-full object-cover"
        />

        {/* Animated Border for Active State */}
        {isPlaying && (
          <div 
            className="absolute inset-0 rounded-3xl border-4 animate-pulse"
            style={{ borderColor: theme.colors.primary }}
          ></div>
        )}

        {/* Play/Pause Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300">
          <button
            onClick={handlePlayToggle}
            disabled={isLoading}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 transform ${
              isLoading ? 'scale-110 animate-spin' : 'scale-100 hover:scale-110'
            } opacity-0 group-hover:opacity-100`}
            style={{ backgroundColor: `${theme.colors.primary}90` }}
          >
            {isLoading ? (
              <Sparkles 
                className="w-8 h-8" 
                style={{ color: theme.colors.background }}
              />
            ) : isPlaying ? (
              <Pause 
                className="w-8 h-8" 
                style={{ color: theme.colors.background }}
              />
            ) : (
              <Play 
                className="w-8 h-8 ml-1" 
                style={{ color: theme.colors.background }}
              />
            )}
          </button>
        </div>

        {/* Mood Indicator */}
        <div 
          className="absolute top-4 left-4 px-3 py-1 rounded-full backdrop-blur-sm border border-opacity-20 flex items-center space-x-2"
          style={{ 
            backgroundColor: `${theme.colors.surface}80`,
            borderColor: theme.colors.accent 
          }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: theme.colors.primary }}
          ></div>
          <span 
            className="text-xs font-medium capitalize"
            style={{ color: theme.colors.text }}
          >
            {memory.mood}
          </span>
        </div>

        {/* Volume Control */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm border border-opacity-20 transition-all duration-200 hover:scale-110"
          style={{ 
            backgroundColor: `${theme.colors.surface}80`,
            borderColor: theme.colors.accent 
          }}
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
      </div>

      {/* Memory Info */}
      <div className="p-6">
        <h3 
          className="text-lg font-bold mb-2 line-clamp-1"
          style={{ color: theme.colors.text }}
        >
          {memory.title}
        </h3>
        <p 
          className="text-sm leading-relaxed line-clamp-2 mb-4"
          style={{ color: theme.colors.textSecondary }}
        >
          {memory.content}
        </p>

        {/* AI Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles 
              className="w-4 h-4" 
              style={{ color: theme.colors.primary }}
            />
            <span 
              className="text-xs font-medium"
              style={{ color: theme.colors.primary }}
            >
              AI Avatar Ready
            </span>
          </div>
          
          <div 
            className="text-xs"
            style={{ color: theme.colors.textSecondary }}
          >
            {new Date(memory.timestamp).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center backdrop-blur-sm"
          style={{ backgroundColor: `${theme.colors.surface}90` }}
        >
          <div className="text-center">
            <div 
              className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center animate-pulse"
              style={{ backgroundColor: `${theme.colors.primary}20` }}
            >
              <Sparkles 
                className="w-6 h-6 animate-spin" 
                style={{ color: theme.colors.primary }}
              />
            </div>
            <p 
              className="text-sm font-medium"
              style={{ color: theme.colors.text }}
            >
              Generating AI Avatar...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
