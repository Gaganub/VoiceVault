import React from 'react';
import { Calendar, Clock, Mic, Heart, TrendingUp, Award } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Memory } from '../../types';

interface MemoryStatsProps {
  memories: Memory[];
}

export const MemoryStats: React.FC<MemoryStatsProps> = ({ memories }) => {
  const { theme } = useTheme();

  // Calculate statistics
  const totalMemories = memories.length;
  const thisWeek = memories.filter(m => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(m.timestamp) > weekAgo;
  }).length;

  const totalAudioTime = memories.filter(m => m.audioUrl).length * 2.5; // Assume avg 2.5 min per audio
  
  const longestStreak = 7; // Mock data - would calculate actual streak
  
  const favoriteMemories = memories.filter(m => m.mood === 'happy').length;
  
  const growthRate = thisWeek > 0 ? ((thisWeek / totalMemories) * 100) : 0;

  const stats = [
    {
      icon: Calendar,
      label: 'Total Memories',
      value: totalMemories.toString(),
      subtitle: 'All time',
      color: theme.colors.primary,
    },
    {
      icon: TrendingUp,
      label: 'This Week',
      value: thisWeek.toString(),
      subtitle: `+${growthRate.toFixed(1)}% growth`,
      color: theme.colors.secondary,
    },
    {
      icon: Clock,
      label: 'Audio Time',
      value: `${totalAudioTime.toFixed(1)}h`,
      subtitle: 'Total recorded',
      color: theme.colors.accent,
    },
    {
      icon: Award,
      label: 'Longest Streak',
      value: `${longestStreak} days`,
      subtitle: 'Keep it up!',
      color: '#FFD700',
    },
    {
      icon: Heart,
      label: 'Happy Moments',
      value: favoriteMemories.toString(),
      subtitle: 'Joyful memories',
      color: '#FF6B6B',
    },
    {
      icon: Mic,
      label: 'Voice Memories',
      value: memories.filter(m => m.audioUrl).length.toString(),
      subtitle: 'With audio',
      color: '#9370DB',
    },
  ];

  return (
    <div 
      className="p-6 rounded-2xl backdrop-blur-sm border border-opacity-20 mb-8"
      style={{ 
        backgroundColor: `${theme.colors.surface}40`,
        borderColor: theme.colors.accent 
      }}
    >
      <div className="flex items-center space-x-3 mb-6">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${theme.colors.primary}20` }}
        >
          <TrendingUp 
            className="w-5 h-5" 
            style={{ color: theme.colors.primary }}
          />
        </div>
        <div>
          <h2 
            className="text-xl font-bold"
            style={{ color: theme.colors.text }}
          >
            Your Memory Journey
          </h2>
          <p 
            className="text-sm"
            style={{ color: theme.colors.textSecondary }}
          >
            Track your progress and milestones
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="text-center p-4 rounded-xl backdrop-blur-sm border border-opacity-10 hover:scale-105 transition-all duration-300"
            style={{ 
              backgroundColor: `${stat.color}10`,
              borderColor: `${stat.color}30` 
            }}
          >
            <div 
              className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
              style={{ backgroundColor: `${stat.color}20` }}
            >
              <stat.icon 
                className="w-6 h-6" 
                style={{ color: stat.color }}
              />
            </div>
            
            <div 
              className="text-2xl font-bold mb-1"
              style={{ color: theme.colors.text }}
            >
              {stat.value}
            </div>
            
            <div 
              className="text-sm font-medium mb-1"
              style={{ color: theme.colors.text }}
            >
              {stat.label}
            </div>
            
            <div 
              className="text-xs"
              style={{ color: theme.colors.textSecondary }}
            >
              {stat.subtitle}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};