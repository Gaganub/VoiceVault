import React, { useState } from 'react';
import { Calendar, Heart, Lock, Play, Tag, Sparkles, MoreVertical, Edit, Share, Trash2, Clock } from 'lucide-react';
import { Memory } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { AudioPlayer } from '../Audio/AudioPlayer';

interface MemoryCardProps {
  memory: Memory;
  onPlay?: (memory: Memory) => void;
  onEdit?: (memory: Memory) => void;
  onShare?: (memory: Memory) => void;
  onDelete?: (memory: Memory) => void;
  isSelected?: boolean;
  onSelect?: (memory: Memory, selected: boolean) => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({ 
  memory, 
  onPlay, 
  onEdit, 
  onShare, 
  onDelete,
  isSelected = false,
  onSelect
}) => {
  const { theme } = useTheme();
  const { t, formatDate } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);

  const moodColors = {
    happy: '#FFD700',
    sad: '#87CEEB',
    neutral: '#D3D3D3',
    excited: '#FF6B6B',
    reflective: '#9370DB',
  };

  const moodGradients = {
    happy: 'from-yellow-400 to-orange-500',
    sad: 'from-blue-400 to-indigo-600',
    excited: 'from-pink-400 to-red-500',
    reflective: 'from-purple-400 to-indigo-500',
    neutral: 'from-gray-400 to-gray-600',
  };

  const handleMenuAction = (action: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    
    switch (action) {
      case 'edit':
        onEdit?.(memory);
        break;
      case 'share':
        onShare?.(memory);
        break;
      case 'delete':
        onDelete?.(memory);
        break;
    }
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(memory, !isSelected);
    } else {
      onPlay?.(memory);
    }
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(memory, !isSelected);
  };

  const handleAudioPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAudioPlayer(!showAudioPlayer);
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Selection Checkbox */}
      {onSelect && (
        <div 
          className={`absolute top-3 left-3 z-20 transition-all duration-200 ${
            isHovered || isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => {}}
              onClick={handleCheckboxClick}
              className="sr-only"
            />
            <div 
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                isSelected ? 'scale-110' : ''
              }`}
              style={{
                backgroundColor: isSelected ? theme.colors.primary : 'transparent',
                borderColor: isSelected ? theme.colors.primary : theme.colors.textSecondary,
              }}
            >
              {isSelected && (
                <svg className="w-3 h-3" style={{ color: theme.colors.background }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </label>
        </div>
      )}

      {/* Mood Gradient Background */}
      <div 
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${moodGradients[memory.mood]} opacity-10 transition-opacity duration-300 ${
          isHovered || isSelected ? 'opacity-20' : ''
        }`}
      />
      
      <div
        className={`relative p-6 rounded-2xl backdrop-blur-sm border border-opacity-30 transition-all duration-300 cursor-pointer ${
          isSelected ? 'scale-[1.02] shadow-2xl border-opacity-60' : 'hover:scale-[1.02] hover:shadow-2xl'
        }`}
        style={{ 
          backgroundColor: `${theme.colors.surface}70`,
          borderColor: isSelected ? theme.colors.primary : theme.colors.accent 
        }}
        onClick={handleCardClick}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: moodColors[memory.mood] }}
            ></div>
            <span 
              className="text-sm font-medium capitalize"
              style={{ color: theme.colors.textSecondary }}
            >
              {t(`mood.${memory.mood}`)}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {memory.isPrivate && (
              <Lock 
                className="w-4 h-4" 
                style={{ color: theme.colors.textSecondary }}
              />
            )}
            
            {/* Last Edited Indicator */}
            {(memory as any).lastEditedAt && (
              <div className="flex items-center space-x-1" title={t('memory.edit')}>
                <Clock className="w-3 h-3" style={{ color: theme.colors.accent }} />
                <span className="text-xs" style={{ color: theme.colors.accent }}>
                  {t('memory.edit')}
                </span>
              </div>
            )}
            
            {/* Menu Button */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isHovered || showMenu ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                }`}
                style={{ 
                  backgroundColor: `${theme.colors.surface}60`,
                  color: theme.colors.textSecondary 
                }}
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              
              {/* Dropdown Menu */}
              {showMenu && (
                <div 
                  className="absolute right-0 top-full mt-2 w-48 rounded-xl backdrop-blur-sm border border-opacity-30 shadow-xl z-30"
                  style={{ 
                    backgroundColor: `${theme.colors.surface}95`,
                    borderColor: theme.colors.accent 
                  }}
                >
                  <button
                    onClick={(e) => handleMenuAction('edit', e)}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-opacity-50 transition-colors rounded-t-xl"
                    style={{ color: theme.colors.text }}
                  >
                    <Edit className="w-4 h-4" />
                    <span>{t('memory.edit')}</span>
                  </button>
                  <button
                    onClick={(e) => handleMenuAction('share', e)}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-opacity-50 transition-colors"
                    style={{ color: theme.colors.text }}
                  >
                    <Share className="w-4 h-4" />
                    <span>{t('memory.share')}</span>
                  </button>
                  <button
                    onClick={(e) => handleMenuAction('delete', e)}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-opacity-50 transition-colors rounded-b-xl text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{t('memory.delete')}</span>
                  </button>
                </div>
              )}
            </div>
            
            {memory.audioUrl && (
              <button
                onClick={handleAudioPlay}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isHovered ? 'scale-110' : ''
                }`}
                style={{ 
                  backgroundColor: `${theme.colors.primary}30`,
                  color: theme.colors.primary 
                }}
                title={t('audio.play')}
              >
                <Play className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <h3 
          className="text-lg font-bold mb-2 group-hover:text-opacity-90 transition-all line-clamp-2"
          style={{ color: theme.colors.text }}
        >
          {memory.title}
        </h3>

        <p 
          className="mb-4 leading-relaxed line-clamp-3"
          style={{ color: theme.colors.textSecondary }}
        >
          {memory.content}
        </p>

        {/* Audio Player */}
        {showAudioPlayer && memory.audioUrl && (
          <div className="mb-4" onClick={(e) => e.stopPropagation()}>
            <AudioPlayer
              audioUrl={memory.audioUrl}
              title={memory.title}
              onPlayStateChange={(isPlaying) => {
                if (isPlaying) {
                  onPlay?.(memory);
                }
              }}
            />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" style={{ color: theme.colors.textSecondary }} />
            <span 
              className="text-sm"
              style={{ color: theme.colors.textSecondary }}
            >
              {formatDate(memory.timestamp)}
            </span>
          </div>

          {memory.tags.length > 0 && (
            <div className="flex items-center space-x-1">
              <Tag className="w-4 h-4" style={{ color: theme.colors.textSecondary }} />
              <div className="flex space-x-1">
                {memory.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs rounded-full"
                    style={{ 
                      backgroundColor: `${theme.colors.primary}30`,
                      color: theme.colors.primary 
                    }}
                  >
                    {tag}
                  </span>
                ))}
                {memory.tags.length > 2 && (
                  <span
                    className="px-2 py-1 text-xs rounded-full"
                    style={{ 
                      backgroundColor: `${theme.colors.accent}40`,
                      color: theme.colors.textSecondary 
                    }}
                  >
                    +{memory.tags.length - 2}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* AI Enhancement Indicator */}
        {memory.audioUrl && (
          <div 
            className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
              isHovered ? 'scale-110' : ''
            }`}
            style={{ backgroundColor: `${theme.colors.primary}20` }}
          >
            <Sparkles 
              className="w-3 h-3" 
              style={{ color: theme.colors.primary }}
            />
          </div>
        )}
      </div>
      
      {/* Click outside to close menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-20"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};