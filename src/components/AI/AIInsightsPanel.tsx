import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, TrendingUp, Heart, MessageSquare, Lightbulb, RefreshCw, AlertCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Memory } from '../../types';
import { aiService } from '../../services/aiService';

interface AIInsightsPanelProps {
  memories: Memory[];
}

interface AIInsight {
  type: 'pattern' | 'suggestion' | 'milestone' | 'reflection';
  title: string;
  description: string;
  confidence: number;
  actionable?: boolean;
}

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ memories }) => {
  const { theme } = useTheme();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string>('');

  const generateInsights = async () => {
    if (memories.length === 0) return;
    
    setIsAnalyzing(true);
    setError('');
    
    try {
      // Simulate analysis time for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const generatedInsights = await aiService.generateInsights(memories);
      setInsights(generatedInsights);
      
    } catch (error: any) {
      console.error('Insights generation error:', error);
      setError(error.message || 'Failed to generate insights. Please try again.');
      
      // Fallback insights
      const fallbackInsights: AIInsight[] = [
        {
          type: 'pattern',
          title: 'Memory Collection Growing',
          description: `You've captured ${memories.length} memories so far. Keep building your personal vault of precious moments!`,
          confidence: 1.0,
          actionable: true
        },
        {
          type: 'suggestion',
          title: 'Enable AI Analysis',
          description: `Currently using ${aiService.getProviderName()} for analysis. Consider adding more AI API keys for enhanced features.`,
          confidence: 1.0,
          actionable: true
        }
      ];
      setInsights(fallbackInsights);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (memories.length > 0) {
      generateInsights();
    }
  }, [memories.length]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'pattern': return TrendingUp;
      case 'suggestion': return Lightbulb;
      case 'milestone': return Heart;
      case 'reflection': return MessageSquare;
      default: return Brain;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'pattern': return theme.colors.primary;
      case 'suggestion': return theme.colors.secondary;
      case 'milestone': return '#FFD700';
      case 'reflection': return theme.colors.accent;
      default: return theme.colors.primary;
    }
  };

  return (
    <div 
      className="p-6 rounded-2xl backdrop-blur-sm border border-opacity-30"
      style={{ 
        backgroundColor: `${theme.colors.surface}80`,
        borderColor: theme.colors.accent 
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
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
              AI Insights
            </h3>
            <p 
              className="text-sm"
              style={{ color: theme.colors.textSecondary }}
            >
              Powered by {aiService.getProviderName()}
            </p>
          </div>
        </div>
        
        <button
          onClick={generateInsights}
          disabled={isAnalyzing || memories.length === 0}
          className="p-2 rounded-lg transition-all duration-200 hover:scale-110 disabled:opacity-50"
          style={{ 
            backgroundColor: `${theme.colors.primary}20`,
            color: theme.colors.primary 
          }}
        >
          <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div 
          className="flex items-center space-x-2 p-3 rounded-lg mb-4"
          style={{ backgroundColor: '#ef444430', border: '1px solid #ef4444' }}
        >
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span className="text-sm text-red-400">{error}</span>
        </div>
      )}

      {isAnalyzing ? (
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
            className="text-sm font-medium"
            style={{ color: theme.colors.text }}
          >
            Analyzing your memory patterns...
          </p>
        </div>
      ) : memories.length === 0 ? (
        <div className="text-center py-8">
          <p 
            className="text-sm"
            style={{ color: theme.colors.textSecondary }}
          >
            Create some memories to see AI insights
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const IconComponent = getInsightIcon(insight.type);
            const color = getInsightColor(insight.type);
            
            return (
              <div
                key={index}
                className="p-4 rounded-xl border border-opacity-20 hover:scale-[1.02] transition-all duration-200"
                style={{ 
                  backgroundColor: `${theme.colors.surface}60`,
                  borderColor: color + '30'
                }}
              >
                <div className="flex items-start space-x-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: color + '30' }}
                  >
                    <IconComponent 
                      className="w-4 h-4" 
                      style={{ color }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 
                        className="font-medium"
                        style={{ color: theme.colors.text }}
                      >
                        {insight.title}
                      </h4>
                      <div className="flex items-center space-x-1">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <span 
                          className="text-xs"
                          style={{ color: theme.colors.textSecondary }}
                        >
                          {Math.round(insight.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                    
                    <p 
                      className="text-sm leading-relaxed mb-3"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      {insight.description}
                    </p>
                    
                    {insight.actionable && (
                      <button
                        className="text-xs px-3 py-1 rounded-full transition-all duration-200 hover:scale-105"
                        style={{ 
                          backgroundColor: color + '20',
                          color: color 
                        }}
                      >
                        Take Action
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};