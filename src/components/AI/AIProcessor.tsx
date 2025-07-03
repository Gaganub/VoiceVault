import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, Zap, MessageCircle, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Memory, AIInsights } from '../../types';
import { aiService } from '../../services/aiService';

interface AIProcessorProps {
  memory?: Memory;
  onProcessingComplete?: (insights: AIInsights) => void;
}

export const AIProcessor: React.FC<AIProcessorProps> = ({ memory, onProcessingComplete }) => {
  const { theme } = useTheme();
  const [isProcessing, setIsProcessing] = useState(false);
  const [insights, setInsights] = useState<AIInsights | null>(null);
  const [processingStage, setProcessingStage] = useState('');
  const [warning, setWarning] = useState<string>('');

  // Define stages at component level so it's accessible throughout
  const stages = [
    'Analyzing emotional tone...',
    'Extracting key themes...',
    'Generating insights...',
    'Finding connections...',
    'Finalizing analysis...'
  ];

  const processMemory = async (memoryContent: string, title?: string) => {
    setIsProcessing(true);
    setWarning('');

    try {
      // Simulate processing stages for better UX
      for (let i = 0; i < stages.length; i++) {
        setProcessingStage(stages[i]);
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      // Real AI analysis
      const aiInsights = await aiService.analyzeMemory(memoryContent, title);
      
      setInsights(aiInsights);
      setIsProcessing(false);
      onProcessingComplete?.(aiInsights);
      
      // Check if we're using fallback analysis due to rate limiting
      if (aiInsights.emotionalTone.includes('Basic analysis')) {
        setWarning('Using basic analysis. AI provider may be rate limited - try again in a few minutes for enhanced insights.');
      }
      
    } catch (error: any) {
      console.error('AI processing error:', error);
      setIsProcessing(false);
      
      // This should not happen anymore since analyzeMemory always falls back
      // But keeping as safety net
      const fallbackInsights: AIInsights = {
        sentiment: 'neutral',
        keywords: memoryContent.split(' ').slice(0, 3),
        suggestedTags: ['general'],
        emotionalTone: 'Basic analysis - AI service temporarily unavailable',
        summary: memoryContent.substring(0, 100) + '...',
        relatedMemories: [],
        confidence: 0.5,
        themes: ['personal'],
        mood: 'neutral'
      };
      
      setInsights(fallbackInsights);
      setWarning('AI analysis temporarily unavailable. Using basic analysis.');
      onProcessingComplete?.(fallbackInsights);
    }
  };

  useEffect(() => {
    if (memory && memory.content) {
      processMemory(memory.content, memory.title);
    }
  }, [memory]);

  return (
    <div 
      className="p-6 rounded-2xl backdrop-blur-sm border border-opacity-30"
      style={{ 
        backgroundColor: `${theme.colors.surface}60`,
        borderColor: theme.colors.accent 
      }}
    >
      <div className="flex items-center space-x-3 mb-4">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${theme.colors.primary}30` }}
        >
          <Brain 
            className="w-5 h-5" 
            style={{ color: theme.colors.primary }}
          />
        </div>
        <div>
          <h3 
            className="text-lg font-bold"
            style={{ color: theme.colors.text }}
          >
            AI Analysis
          </h3>
          <p 
            className="text-sm"
            style={{ color: theme.colors.textSecondary }}
          >
            Powered by {aiService.getProviderName()}
          </p>
        </div>
      </div>

      {/* Warning Display */}
      {warning && (
        <div 
          className="flex items-center space-x-2 p-3 rounded-lg mb-4"
          style={{ backgroundColor: '#f59e0b30', border: '1px solid #f59e0b' }}
        >
          <Clock className="w-4 h-4 text-yellow-500" />
          <span className="text-sm text-yellow-600">{warning}</span>
        </div>
      )}

      {isProcessing ? (
        <div className="text-center py-8">
          <div 
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse"
            style={{ backgroundColor: `${theme.colors.primary}20` }}
          >
            <Sparkles 
              className="w-8 h-8 animate-spin" 
              style={{ color: theme.colors.primary }}
            />
          </div>
          <p 
            className="text-sm font-medium mb-2"
            style={{ color: theme.colors.text }}
          >
            {processingStage}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                backgroundColor: theme.colors.primary,
                width: `${((stages.indexOf(processingStage) + 1) / stages.length) * 100}%`
              }}
            ></div>
          </div>
        </div>
      ) : insights ? (
        <div className="space-y-4">
          {/* Success Indicator */}
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400">Analysis Complete</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div 
              className="p-4 rounded-xl"
              style={{ backgroundColor: `${theme.colors.surface}40` }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <MessageCircle 
                  className="w-4 h-4" 
                  style={{ color: theme.colors.primary }}
                />
                <span 
                  className="text-sm font-medium"
                  style={{ color: theme.colors.text }}
                >
                  Sentiment
                </span>
              </div>
              <span 
                className="text-lg font-bold capitalize"
                style={{ color: theme.colors.primary }}
              >
                {insights.sentiment}
              </span>
              <div className="text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
                Confidence: {Math.round(insights.confidence * 100)}%
              </div>
            </div>

            <div 
              className="p-4 rounded-xl"
              style={{ backgroundColor: `${theme.colors.surface}40` }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Zap 
                  className="w-4 h-4" 
                  style={{ color: theme.colors.primary }}
                />
                <span 
                  className="text-sm font-medium"
                  style={{ color: theme.colors.text }}
                >
                  Mood
                </span>
              </div>
              <span 
                className="text-lg font-bold capitalize"
                style={{ color: theme.colors.primary }}
              >
                {insights.mood}
              </span>
            </div>
          </div>

          <div>
            <h4 
              className="text-sm font-medium mb-2"
              style={{ color: theme.colors.text }}
            >
              AI-Suggested Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {insights.suggestedTags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs rounded-full"
                  style={{ 
                    backgroundColor: `${theme.colors.primary}20`,
                    color: theme.colors.primary 
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {insights.themes.length > 0 && (
            <div>
              <h4 
                className="text-sm font-medium mb-2"
                style={{ color: theme.colors.text }}
              >
                Key Themes
              </h4>
              <div className="flex flex-wrap gap-2">
                {insights.themes.map((themeItem, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs rounded-full"
                    style={{ 
                      backgroundColor: `${theme.colors.accent}20`,
                      color: theme.colors.accent 
                    }}
                  >
                    {themeItem}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 
              className="text-sm font-medium mb-2"
              style={{ color: theme.colors.text }}
            >
              Emotional Tone
            </h4>
            <p 
              className="text-sm leading-relaxed"
              style={{ color: theme.colors.textSecondary }}
            >
              {insights.emotionalTone}
            </p>
          </div>

          <div>
            <h4 
              className="text-sm font-medium mb-2"
              style={{ color: theme.colors.text }}
            >
              AI Summary
            </h4>
            <p 
              className="text-sm leading-relaxed"
              style={{ color: theme.colors.textSecondary }}
            >
              {insights.summary}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p 
            className="text-sm"
            style={{ color: theme.colors.textSecondary }}
          >
            Record a memory to see AI analysis
          </p>
        </div>
      )}
    </div>
  );
};