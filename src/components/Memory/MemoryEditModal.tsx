import React, { useState, useEffect } from 'react';
import { X, Save, Clock, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Memory, AIInsights } from '../../types';
import { aiService } from '../../services/aiService';

interface MemoryEditModalProps {
  memory: Memory;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedMemory: Memory) => void;
}

export const MemoryEditModal: React.FC<MemoryEditModalProps> = ({
  memory,
  isOpen,
  onClose,
  onSave
}) => {
  const { theme } = useTheme();
  const [editedTitle, setEditedTitle] = useState(memory.title);
  const [editedContent, setEditedContent] = useState(memory.content);
  const [editedTags, setEditedTags] = useState(memory.tags.join(', '));
  const [editedMood, setEditedMood] = useState(memory.mood);
  const [isPrivate, setIsPrivate] = useState(memory.isPrivate);
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    if (!isOpen) return;

    const autoSaveTimer = setTimeout(() => {
      if (editedTitle !== memory.title || editedContent !== memory.content) {
        handleAutoSave();
      }
    }, 3000); // Auto-save after 3 seconds of inactivity

    return () => clearTimeout(autoSaveTimer);
  }, [editedTitle, editedContent, isOpen]);

  // Re-analyze content when it changes significantly
  useEffect(() => {
    if (editedContent && editedContent.length > 50 && editedContent !== memory.content) {
      const analyzeTimer = setTimeout(() => {
        handleContentAnalysis();
      }, 2000);

      return () => clearTimeout(analyzeTimer);
    }
  }, [editedContent]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!editedTitle.trim()) {
      newErrors.title = 'Title is required';
    } else if (editedTitle.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (!editedContent.trim()) {
      newErrors.content = 'Content is required';
    } else if (editedContent.length > 5000) {
      newErrors.content = 'Content must be less than 5000 characters';
    }

    if (editedTags.length > 500) {
      newErrors.tags = 'Tags must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAutoSave = async () => {
    if (!validateForm()) return;

    setAutoSaveStatus('saving');
    try {
      // Simulate auto-save (in real app, this would save to backend)
      await new Promise(resolve => setTimeout(resolve, 500));
      setAutoSaveStatus('saved');
      
      setTimeout(() => setAutoSaveStatus(null), 2000);
    } catch (error) {
      setAutoSaveStatus('error');
      setTimeout(() => setAutoSaveStatus(null), 3000);
    }
  };

  const handleContentAnalysis = async () => {
    if (!editedContent.trim()) return;

    setIsAnalyzing(true);
    try {
      const insights = await aiService.analyzeMemory(editedContent, editedTitle);
      setAiInsights(insights);
      
      // Auto-update mood and tags based on AI analysis
      setEditedMood(insights.mood);
      if (insights.suggestedTags.length > 0) {
        setEditedTags(insights.suggestedTags.join(', '));
      }
    } catch (error) {
      console.error('Content analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const updatedMemory: Memory = {
        ...memory,
        title: editedTitle.trim(),
        content: editedContent.trim(),
        tags: editedTags.split(',').map(tag => tag.trim()).filter(tag => tag),
        mood: editedMood,
        isPrivate,
        // Add edit timestamp while preserving original creation date
        lastEditedAt: new Date(),
      };

      await onSave(updatedMemory);
      onClose();
    } catch (error) {
      console.error('Save failed:', error);
      setErrors({ general: 'Failed to save changes. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: `${theme.colors.background}80` }}
        onClick={onClose}
      />
      
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl backdrop-blur-sm border border-opacity-20"
        style={{ 
          backgroundColor: `${theme.colors.surface}95`,
          borderColor: theme.colors.accent 
        }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-opacity-20" style={{ borderColor: theme.colors.accent }}>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: theme.colors.text }}>
              Edit Memory
            </h2>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-2 text-sm" style={{ color: theme.colors.textSecondary }}>
                <Calendar className="w-4 h-4" />
                <span>Created: {new Date(memory.timestamp).toLocaleDateString()}</span>
              </div>
              {autoSaveStatus && (
                <div className="flex items-center space-x-2 text-sm">
                  {autoSaveStatus === 'saving' && (
                    <>
                      <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                      <span style={{ color: theme.colors.textSecondary }}>Auto-saving...</span>
                    </>
                  )}
                  {autoSaveStatus === 'saved' && (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">Auto-saved</span>
                    </>
                  )}
                  {autoSaveStatus === 'error' && (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <span className="text-red-400">Auto-save failed</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{ backgroundColor: `${theme.colors.surface}40` }}
          >
            <X className="w-5 h-5" style={{ color: theme.colors.textSecondary }} />
          </button>
        </div>

        <div className="p-6 grid lg:grid-cols-2 gap-8">
          {/* Edit Form */}
          <div className="space-y-6">
            {/* General Error */}
            {errors.general && (
              <div className="p-4 rounded-xl flex items-center space-x-3" style={{ backgroundColor: '#ef444430', border: '1px solid #ef4444' }}>
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400">{errors.general}</span>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
                Title *
              </label>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl backdrop-blur-sm border border-opacity-30 focus:outline-none focus:ring-2 transition-all ${
                  errors.title ? 'border-red-400' : ''
                }`}
                style={{ 
                  backgroundColor: `${theme.colors.surface}40`,
                  borderColor: errors.title ? '#ef4444' : theme.colors.accent,
                  color: theme.colors.text,
                  '--tw-ring-color': theme.colors.primary 
                } as React.CSSProperties}
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
                Content *
              </label>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows={8}
                className={`w-full px-4 py-3 rounded-xl backdrop-blur-sm border border-opacity-30 focus:outline-none focus:ring-2 transition-all resize-none ${
                  errors.content ? 'border-red-400' : ''
                }`}
                style={{ 
                  backgroundColor: `${theme.colors.surface}40`,
                  borderColor: errors.content ? '#ef4444' : theme.colors.accent,
                  color: theme.colors.text,
                  '--tw-ring-color': theme.colors.primary 
                } as React.CSSProperties}
              />
              {errors.content && (
                <p className="text-red-400 text-sm mt-1">{errors.content}</p>
              )}
              <div className="flex justify-between text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
                <span>{editedContent.length}/5000 characters</span>
                {isAnalyzing && <span>Analyzing content...</span>}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={editedTags}
                onChange={(e) => setEditedTags(e.target.value)}
                placeholder="family, vacation, happy, memories"
                className={`w-full px-4 py-3 rounded-xl backdrop-blur-sm border border-opacity-30 focus:outline-none focus:ring-2 transition-all ${
                  errors.tags ? 'border-red-400' : ''
                }`}
                style={{ 
                  backgroundColor: `${theme.colors.surface}40`,
                  borderColor: errors.tags ? '#ef4444' : theme.colors.accent,
                  color: theme.colors.text,
                  '--tw-ring-color': theme.colors.primary 
                } as React.CSSProperties}
              />
              {errors.tags && (
                <p className="text-red-400 text-sm mt-1">{errors.tags}</p>
              )}
            </div>

            {/* Mood */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
                Mood
              </label>
              <select
                value={editedMood}
                onChange={(e) => setEditedMood(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl backdrop-blur-sm border border-opacity-30 focus:outline-none focus:ring-2 transition-all"
                style={{ 
                  backgroundColor: `${theme.colors.surface}40`,
                  borderColor: theme.colors.accent,
                  color: theme.colors.text,
                  '--tw-ring-color': theme.colors.primary 
                } as React.CSSProperties}
              >
                <option value="happy">Happy</option>
                <option value="sad">Sad</option>
                <option value="neutral">Neutral</option>
                <option value="excited">Excited</option>
                <option value="reflective">Reflective</option>
              </select>
            </div>

            {/* Privacy */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium" style={{ color: theme.colors.text }}>
                  Private Memory
                </label>
                <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
                  Only you can see this memory
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="sr-only peer"
                />
                <div 
                  className={`w-11 h-6 rounded-full peer transition-all duration-200 ${
                    isPrivate ? 'peer-checked:after:translate-x-full' : ''
                  } peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}
                  style={{ 
                    backgroundColor: isPrivate ? theme.colors.primary : theme.colors.surface 
                  }}
                />
              </label>
            </div>
          </div>

          {/* AI Analysis Panel */}
          <div>
            {aiInsights ? (
              <div 
                className="p-6 rounded-2xl backdrop-blur-sm border border-opacity-30"
                style={{ 
                  backgroundColor: `${theme.colors.surface}60`,
                  borderColor: theme.colors.accent 
                }}
              >
                <h3 className="text-lg font-bold mb-4" style={{ color: theme.colors.text }}>
                  AI Analysis Results
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: `${theme.colors.surface}40` }}>
                      <div className="text-sm font-medium mb-1" style={{ color: theme.colors.text }}>
                        Sentiment
                      </div>
                      <div className="text-lg font-bold capitalize" style={{ color: theme.colors.primary }}>
                        {aiInsights.sentiment}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg" style={{ backgroundColor: `${theme.colors.surface}40` }}>
                      <div className="text-sm font-medium mb-1" style={{ color: theme.colors.text }}>
                        Mood
                      </div>
                      <div className="text-lg font-bold capitalize" style={{ color: theme.colors.primary }}>
                        {aiInsights.mood}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
                      Key Themes
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {aiInsights.themes.map((theme, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-xs rounded-full"
                          style={{ 
                            backgroundColor: `${theme.colors.primary}20`,
                            color: theme.colors.primary 
                          }}
                        >
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
                      Emotional Tone
                    </div>
                    <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                      {aiInsights.emotionalTone}
                    </p>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
                      AI Summary
                    </div>
                    <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                      {aiInsights.summary}
                    </p>
                  </div>

                  <div className="text-xs" style={{ color: theme.colors.textSecondary }}>
                    Confidence: {Math.round(aiInsights.confidence * 100)}%
                  </div>
                </div>
              </div>
            ) : (
              <div 
                className="p-8 rounded-2xl backdrop-blur-sm border border-opacity-30 text-center"
                style={{ 
                  backgroundColor: `${theme.colors.surface}40`,
                  borderColor: theme.colors.accent 
                }}
              >
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: `${theme.colors.primary}20` }}>
                  <Clock className="w-8 h-8" style={{ color: theme.colors.primary }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: theme.colors.text }}>
                  AI Analysis
                </h3>
                <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                  {isAnalyzing ? 'Analyzing your content...' : 'Make changes to see updated AI analysis'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end space-x-4 p-6 border-t border-opacity-20" style={{ borderColor: theme.colors.accent }}>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-6 py-3 rounded-xl font-medium border-2 transition-all duration-200 hover:scale-105 disabled:opacity-50"
            style={{ 
              borderColor: theme.colors.textSecondary,
              color: theme.colors.textSecondary 
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || Object.keys(errors).length > 0}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50"
            style={{ 
              backgroundColor: theme.colors.primary,
              color: theme.colors.background 
            }}
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};