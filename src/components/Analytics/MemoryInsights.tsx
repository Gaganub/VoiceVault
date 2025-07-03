import React, { useState, useEffect } from 'react';
import { TrendingUp, Heart, Calendar, Tag, BarChart3, PieChart, Brain, Zap, Activity, Target, Star, Sparkles } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Memory } from '../../types';

interface MemoryInsightsProps {
  memories: Memory[];
}

export const MemoryInsights: React.FC<MemoryInsightsProps> = ({ memories }) => {
  const { theme } = useTheme();
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Animate values on mount
    const timer = setTimeout(() => {
      setAnimatedValues({
        totalMemories: memories.length,
        thisMonth: memories.filter(m => 
          new Date(m.timestamp).getMonth() === new Date().getMonth()
        ).length,
        streak: 12,
        happiness: 85
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [memories]);

  // Calculate insights
  const totalMemories = memories.length;
  const thisMonth = memories.filter(m => 
    new Date(m.timestamp).getMonth() === new Date().getMonth()
  ).length;
  
  const moodCounts = memories.reduce((acc, memory) => {
    acc[memory.mood] = (acc[memory.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topMood = Object.entries(moodCounts).sort(([,a], [,b]) => b - a)[0];
  
  const tagCounts = memories.reduce((acc, memory) => {
    memory.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topTags = Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8);

  const moodColors = {
    happy: '#FFD700',
    sad: '#87CEEB',
    neutral: '#D3D3D3',
    excited: '#FF6B6B',
    reflective: '#9370DB',
  };

  const insights = [
    {
      icon: Brain,
      title: 'Neural Activity',
      value: animatedValues.totalMemories || 0,
      description: 'Memories processed',
      color: theme.colors.primary,
      suffix: '',
      animated: true
    },
    {
      icon: Zap,
      title: 'Quantum Flux',
      value: topMood?.[0] || 'neutral',
      description: `${topMood?.[1] || 0} dominant patterns`,
      color: moodColors[topMood?.[0] as keyof typeof moodColors] || theme.colors.accent,
      suffix: '',
      animated: false
    },
    {
      icon: Activity,
      title: 'Temporal Sync',
      value: animatedValues.thisMonth || 0,
      description: 'This cycle',
      color: theme.colors.secondary,
      suffix: '',
      animated: true
    },
    {
      icon: Target,
      title: 'Happiness Index',
      value: animatedValues.happiness || 0,
      description: 'Emotional resonance',
      color: '#00FF88',
      suffix: '%',
      animated: true
    },
  ];

  // Cyberpunk particles
  const particles = Array.from({ length: 30 }, (_, i) => (
    <div
      key={i}
      className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-60"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${2 + Math.random() * 3}s`,
      }}
    />
  ));

  return (
    <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {/* Floating Particles Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {particles}
      </div>

      {/* Cyberpunk Header */}
      <div className="relative">
        <div className="flex items-center space-x-4 mb-6">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center relative overflow-hidden"
            style={{ backgroundColor: `${theme.colors.primary}20` }}
          >
            {/* Scanning line effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30 animate-pulse transform -skew-x-12" />
            <BarChart3 
              className="w-6 h-6 relative z-10" 
              style={{ color: theme.colors.primary }}
            />
          </div>
          <div>
            <h2 
              className="text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent"
              style={{ 
                backgroundImage: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})` 
              }}
            >
              Neural Memory Matrix
            </h2>
            <p 
              className="text-sm font-mono"
              style={{ color: theme.colors.textSecondary }}
            >
              <span className="text-green-400">&gt;</span> ANALYZING CONSCIOUSNESS PATTERNS <span className="text-cyan-400 animate-pulse">_</span>
            </p>
          </div>
        </div>

        {/* Holographic Grid Lines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(${theme.colors.primary}40 1px, transparent 1px),
                linear-gradient(90deg, ${theme.colors.primary}40 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px',
              animation: 'grid-move 15s linear infinite'
            }}
          />
        </div>
      </div>

      {/* Cyberpunk Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="group relative p-6 rounded-2xl backdrop-blur-sm border border-opacity-20 hover:scale-105 transition-all duration-500 overflow-hidden"
            style={{ 
              backgroundColor: `${theme.colors.surface}40`,
              borderColor: insight.color,
              boxShadow: `0 0 20px ${insight.color}20`
            }}
          >
            {/* Holographic background effect */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
              style={{ 
                background: `linear-gradient(135deg, ${insight.color}40, transparent)`
              }}
            />
            
            {/* Data streams */}
            <div className="absolute top-0 right-0 w-full h-1 overflow-hidden">
              <div 
                className="h-full animate-pulse"
                style={{ 
                  background: `linear-gradient(90deg, transparent, ${insight.color}, transparent)`,
                  animation: 'data-stream 2s ease-in-out infinite'
                }}
              />
            </div>

            <div className="relative z-10">
              <div 
                className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:animate-spin transition-all duration-300"
                style={{ 
                  backgroundColor: `${insight.color}20`,
                  boxShadow: `0 0 20px ${insight.color}30`
                }}
              >
                <insight.icon 
                  className="w-6 h-6" 
                  style={{ color: insight.color }}
                />
              </div>
              
              <div 
                className="text-2xl font-bold mb-1 font-mono"
                style={{ color: theme.colors.text }}
              >
                {insight.animated && typeof insight.value === 'number' ? (
                  <CountUpAnimation 
                    end={insight.value} 
                    suffix={insight.suffix}
                    color={insight.color}
                  />
                ) : (
                  <span className="capitalize">{insight.value}{insight.suffix}</span>
                )}
              </div>
              
              <div 
                className="text-sm font-medium mb-1"
                style={{ color: theme.colors.text }}
              >
                {insight.title}
              </div>
              
              <div 
                className="text-xs font-mono"
                style={{ color: theme.colors.textSecondary }}
              >
                {insight.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mood Distribution with Cyberpunk Design */}
      <div 
        className="p-8 rounded-3xl backdrop-blur-sm border border-opacity-20 relative overflow-hidden"
        style={{ 
          backgroundColor: `${theme.colors.surface}40`,
          borderColor: theme.colors.accent 
        }}
      >
        {/* Circuit pattern background */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <defs>
              <pattern id="circuit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 10,0 L 10,10 L 0,10" stroke={theme.colors.primary} strokeWidth="0.5" fill="none"/>
                <circle cx="10" cy="10" r="1" fill={theme.colors.primary}/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)"/>
          </svg>
        </div>

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="relative">
              <PieChart 
                className="w-6 h-6 animate-spin" 
                style={{ color: theme.colors.primary, animationDuration: '8s' }}
              />
              <div className="absolute inset-0 animate-ping">
                <PieChart 
                  className="w-6 h-6 opacity-30" 
                  style={{ color: theme.colors.primary }}
                />
              </div>
            </div>
            <h3 
              className="text-xl font-bold font-mono"
              style={{ color: theme.colors.text }}
            >
              EMOTIONAL_SPECTRUM.exe
            </h3>
          </div>

          <div className="space-y-4">
            {Object.entries(moodCounts).map(([mood, count], index) => {
              const percentage = (count / totalMemories) * 100;
              return (
                <div key={mood} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full relative overflow-hidden"
                        style={{ backgroundColor: moodColors[mood as keyof typeof moodColors] }}
                      >
                        <div className="absolute inset-0 animate-pulse bg-white opacity-30" />
                      </div>
                      <span 
                        className="text-sm font-medium capitalize font-mono"
                        style={{ color: theme.colors.text }}
                      >
                        {mood}.dll
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span 
                        className="text-xs font-mono"
                        style={{ color: theme.colors.textSecondary }}
                      >
                        {count} instances
                      </span>
                      <span 
                        className="text-xs font-bold"
                        style={{ color: moodColors[mood as keyof typeof moodColors] }}
                      >
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div 
                    className="h-3 rounded-full relative overflow-hidden"
                    style={{ backgroundColor: `${theme.colors.surface}60` }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-1000 relative overflow-hidden"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: moodColors[mood as keyof typeof moodColors],
                        animationDelay: `${index * 200}ms`
                      }}
                    >
                      {/* Data flow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tag Cloud with Cyberpunk Effects */}
      <div 
        className="p-8 rounded-3xl backdrop-blur-sm border border-opacity-20 relative overflow-hidden"
        style={{ 
          backgroundColor: `${theme.colors.surface}40`,
          borderColor: theme.colors.accent 
        }}
      >
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="relative">
              <Tag 
                className="w-6 h-6" 
                style={{ color: theme.colors.primary }}
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
            </div>
            <h3 
              className="text-xl font-bold font-mono"
              style={{ color: theme.colors.text }}
            >
              NEURAL_TAGS.matrix
            </h3>
          </div>

          <div className="flex flex-wrap gap-3">
            {topTags.map(([tag, count], index) => (
              <div
                key={tag}
                className="group relative px-4 py-2 rounded-full backdrop-blur-sm border border-opacity-20 hover:scale-110 transition-all duration-300 overflow-hidden"
                style={{ 
                  backgroundColor: `${theme.colors.primary}${15 + index * 5}`,
                  borderColor: theme.colors.accent,
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Holographic effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 transform -skew-x-12" />
                
                <div className="relative z-10 flex items-center space-x-2">
                  <span 
                    className="text-sm font-medium font-mono"
                    style={{ color: theme.colors.text }}
                  >
                    {tag}
                  </span>
                  <span 
                    className="text-xs px-2 py-1 rounded-full font-mono"
                    style={{ 
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.background 
                    }}
                  >
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Neural Network Visualization */}
      <div 
        className="p-8 rounded-3xl backdrop-blur-sm border border-opacity-20 relative overflow-hidden"
        style={{ 
          backgroundColor: `${theme.colors.surface}40`,
          borderColor: theme.colors.accent 
        }}
      >
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <Sparkles 
              className="w-6 h-6 animate-pulse" 
              style={{ color: theme.colors.primary }}
            />
            <h3 
              className="text-xl font-bold font-mono"
              style={{ color: theme.colors.text }}
            >
              CONSCIOUSNESS_GRAPH.neural
            </h3>
          </div>

          <div className="text-center py-8">
            <div className="relative inline-block">
              {/* Central node */}
              <div 
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse"
                style={{ 
                  backgroundColor: `${theme.colors.primary}30`,
                  boxShadow: `0 0 30px ${theme.colors.primary}50`
                }}
              >
                <Brain 
                  className="w-8 h-8" 
                  style={{ color: theme.colors.primary }}
                />
              </div>

              {/* Connecting nodes */}
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className="absolute w-8 h-8 rounded-full flex items-center justify-center animate-pulse"
                  style={{
                    backgroundColor: `${theme.colors.accent}40`,
                    left: `${50 + 40 * Math.cos((i * Math.PI * 2) / 6)}%`,
                    top: `${50 + 40 * Math.sin((i * Math.PI * 2) / 6)}%`,
                    transform: 'translate(-50%, -50%)',
                    animationDelay: `${i * 200}ms`
                  }}
                >
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: theme.colors.accent }}
                  />
                </div>
              ))}

              {/* Connection lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {Array.from({ length: 6 }, (_, i) => (
                  <line
                    key={i}
                    x1="50%"
                    y1="50%"
                    x2={`${50 + 40 * Math.cos((i * Math.PI * 2) / 6)}%`}
                    y2={`${50 + 40 * Math.sin((i * Math.PI * 2) / 6)}%`}
                    stroke={theme.colors.primary}
                    strokeWidth="1"
                    opacity="0.5"
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </svg>
            </div>

            <p 
              className="text-sm font-mono mt-4"
              style={{ color: theme.colors.textSecondary }}
            >
              Neural pathways: <span className="text-green-400">{memories.length * 3}</span> active connections
            </p>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(30px, 30px); }
        }
        
        @keyframes data-stream {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

// Count up animation component
const CountUpAnimation: React.FC<{ end: number; suffix?: string; color: string }> = ({ end, suffix = '', color }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = end / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <span style={{ color }}>
      {count}{suffix}
    </span>
  );
};