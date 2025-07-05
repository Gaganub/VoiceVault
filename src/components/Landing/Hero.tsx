import React, { useEffect, useState } from 'react';
import { Brain, Mic, Shield, Sparkles, ArrowRight, Play, Users, Star, Zap, Globe, Lock, Cpu } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  const { theme } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Cyberpunk floating particles
  const particles = Array.from({ length: 50 }, (_, i) => (
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
    <div 
      className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center"
      style={{ backgroundColor: theme.colors.background }}
    >
      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(${theme.colors.primary}40 1px, transparent 1px),
              linear-gradient(90deg, ${theme.colors.primary}40 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'grid-move 20s linear infinite'
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles}
      </div>

      {/* Animated Background Orbs */}
      <div className="absolute inset-0">
        {/* Primary Orb */}
        <div 
          className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse"
          style={{ 
            backgroundColor: theme.colors.primary,
            left: `${20 + mousePosition.x * 0.02}px`,
            top: `${20 + mousePosition.y * 0.02}px`,
            transform: 'translate(-50%, -50%)',
            animation: 'float 6s ease-in-out infinite'
          }}
        />
        
        {/* Secondary Orb */}
        <div 
          className="absolute w-80 h-80 rounded-full opacity-15 blur-2xl"
          style={{ 
            backgroundColor: theme.colors.accent,
            right: `${10 + mousePosition.x * 0.01}px`,
            bottom: `${10 + mousePosition.y * 0.01}px`,
            animation: 'float 8s ease-in-out infinite reverse',
          }}
        />

        {/* Tertiary Orb */}
        <div 
          className="absolute w-64 h-64 rounded-full opacity-10 blur-xl"
          style={{ 
            backgroundColor: theme.colors.secondary,
            left: '60%',
            top: '20%',
            animation: 'float 10s ease-in-out infinite'
          }}
        />
      </div>

      {/* Neural Network Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.colors.primary} stopOpacity="0.8" />
            <stop offset="100%" stopColor={theme.colors.accent} stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {Array.from({ length: 8 }, (_, i) => (
          <line
            key={i}
            x1={`${Math.random() * 100}%`}
            y1={`${Math.random() * 100}%`}
            x2={`${Math.random() * 100}%`}
            y2={`${Math.random() * 100}%`}
            stroke="url(#lineGradient)"
            strokeWidth="1"
            className="animate-pulse"
            style={{
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </svg>

      {/* Main Content */}
      <div className={`relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-1000 flex-1 flex flex-col justify-center ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Cyberpunk Badge */}
        <div className="mb-8 animate-fade-in">
          <div 
            className="inline-flex items-center space-x-3 px-6 py-3 rounded-full backdrop-blur-sm border border-opacity-30 mb-6 group hover:scale-105 transition-all duration-300"
            style={{ 
              backgroundColor: `${theme.colors.surface}40`,
              borderColor: theme.colors.accent,
              color: theme.colors.textSecondary,
              boxShadow: `0 0 20px ${theme.colors.primary}30`
            }}
          >
            <Zap className="w-5 h-5 animate-pulse" style={{ color: theme.colors.primary }} />
            <span className="text-sm font-medium">AI-Powered Memory Vault</span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" style={{ animationDelay: '0.5s' }} />
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-ping" style={{ animationDelay: '1s' }} />
            </div>
          </div>

          {/* Main Heading with Glitch Effect */}
          <h1 
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight relative"
            style={{ color: theme.colors.text }}
          >
            <span className="relative inline-block">
              Your Memories,
              <div className="absolute inset-0 animate-pulse opacity-50" style={{ color: theme.colors.primary }}>
                Your Memories,
              </div>
            </span>
            <br />
            <span 
              className="bg-gradient-to-r bg-clip-text text-transparent relative inline-block group"
              style={{ 
                backgroundImage: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent}, ${theme.colors.secondary})`,
                backgroundSize: '200% 200%',
                animation: 'gradient-shift 3s ease infinite'
              }}
            >
              Forever Secured
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt" />
            </span>
          </h1>

          {/* Cyberpunk Description */}
          <p 
            className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed"
            style={{ color: theme.colors.textSecondary }}
          >
            Enter the future of memory preservation. Powered by{' '}
            <span className="font-bold text-cyan-400 animate-pulse">quantum AI</span>,{' '}
            secured by{' '}
            <span className="font-bold text-purple-400 animate-pulse">blockchain</span>,{' '}
            and enhanced with{' '}
            <span className="font-bold text-green-400 animate-pulse">neural voice synthesis</span>.
            Your memories, immortalized in the digital realm.
          </p>

          {/* CTA Buttons with Cyberpunk Effects */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={onGetStarted}
              className="group relative px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden"
              style={{ 
                backgroundColor: theme.colors.primary,
                color: theme.colors.background,
                boxShadow: `0 0 30px ${theme.colors.primary}50`
              }}
            >
              {/* Button Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Button Content */}
              <div className="relative flex items-center space-x-3">
                <Brain className="w-6 h-6 group-hover:animate-spin transition-transform duration-300" />
                <span>Enter the Vault</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
              
              {/* Scanning Line Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white to-transparent opacity-20" />
            </button>

            <button
              onClick={onGetStarted}
              className="group relative px-8 py-4 rounded-xl font-semibold text-lg border-2 transition-all duration-300 hover:scale-105 backdrop-blur-sm overflow-hidden"
              style={{ 
                borderColor: theme.colors.primary,
                color: theme.colors.primary,
                backgroundColor: `${theme.colors.primary}10`,
                boxShadow: `0 0 20px ${theme.colors.primary}30`
              }}
            >
              {/* Holographic Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 transform -skew-x-12" />
              
              <div className="relative flex items-center space-x-3">
                <Play className="w-5 h-5 group-hover:scale-125 transition-transform duration-300" />
                <span>Experience Demo</span>
              </div>
            </button>
          </div>
        </div>

        {/* Cyberpunk Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {[
            {
              icon: Cpu,
              title: 'Neural Processing',
              description: 'Advanced AI algorithms decode emotional patterns and preserve the essence of your memories',
              color: theme.colors.primary,
            },
            {
              icon: Lock,
              title: 'Quantum Security',
              description: 'Military-grade encryption meets blockchain immutability for ultimate data protection',
              color: theme.colors.accent,
            },
            {
              icon: Globe,
              title: 'Metaverse Ready',
              description: 'Your memories transcend reality, accessible across all digital dimensions and platforms',
              color: theme.colors.secondary,
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-2xl backdrop-blur-sm border border-opacity-20 hover:scale-105 transition-all duration-500 overflow-hidden"
              style={{ 
                backgroundColor: `${theme.colors.surface}30`,
                borderColor: feature.color,
                boxShadow: `0 0 20px ${feature.color}20`
              }}
            >
              {/* Card Background Animation */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                style={{ 
                  background: `linear-gradient(135deg, ${feature.color}40, transparent)`
                }}
              />
              
              {/* Scanning Lines */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500">
                {Array.from({ length: 3 }, (_, i) => (
                  <div
                    key={i}
                    className="absolute w-full h-px animate-pulse"
                    style={{
                      backgroundColor: feature.color,
                      top: `${20 + i * 30}%`,
                      animationDelay: `${i * 0.5}s`
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10">
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:animate-pulse transition-all duration-300"
                  style={{ 
                    backgroundColor: `${feature.color}20`,
                    boxShadow: `0 0 20px ${feature.color}30`
                  }}
                >
                  <feature.icon 
                    className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" 
                    style={{ color: feature.color }}
                  />
                </div>
                
                <h3 
                  className="text-xl font-bold mb-3 group-hover:text-cyan-400 transition-colors duration-300"
                  style={{ color: theme.colors.text }}
                >
                  {feature.title}
                </h3>
                
                <p 
                  className="leading-relaxed text-sm"
                  style={{ color: theme.colors.textSecondary }}
                >
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Cyberpunk Stats */}
        <div className="mt-16 text-center">
          <p 
            className="text-lg mb-6 font-mono"
            style={{ color: theme.colors.textSecondary }}
          >
            <span className="text-cyan-400 animate-pulse">&gt;</span> SYSTEM STATUS: ONLINE{' '}
            <span className="text-green-400 animate-pulse">&lt;</span>
          </p>
          
          <div className="flex items-center justify-center space-x-12">
            {[
              { label: 'Neural Networks', value: '∞', icon: Brain },
              { label: 'Quantum Bits', value: '2048', icon: Zap },
              { label: 'Security Level', value: 'MAX', icon: Shield },
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <stat.icon 
                    className="w-5 h-5 group-hover:animate-spin" 
                    style={{ color: theme.colors.primary }}
                  />
                  <span 
                    className="text-2xl font-bold font-mono group-hover:text-cyan-400 transition-colors duration-300"
                    style={{ color: theme.colors.primary }}
                  >
                    {stat.value}
                  </span>
                </div>
                <div 
                  className="text-xs font-mono uppercase tracking-wider"
                  style={{ color: theme.colors.textSecondary }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA with Matrix Effect */}
        <div 
          className="mt-12 p-6 rounded-2xl backdrop-blur-sm border border-opacity-20 relative overflow-hidden group"
          style={{ 
            backgroundColor: `${theme.colors.surface}30`,
            borderColor: theme.colors.accent,
            boxShadow: `0 0 30px ${theme.colors.primary}20`
          }}
        >
          {/* Matrix Rain Effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-1000">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                className="absolute text-green-400 text-xs font-mono animate-pulse"
                style={{
                  left: `${i * 5}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              >
                {Math.random().toString(36).substring(7)}
              </div>
            ))}
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Sparkles 
                className="w-5 h-5 animate-spin" 
                style={{ color: theme.colors.primary }}
              />
              <span 
                className="font-semibold font-mono"
                style={{ color: theme.colors.primary }}
              >
                INITIALIZATION READY
              </span>
              <Sparkles 
                className="w-5 h-5 animate-spin" 
                style={{ color: theme.colors.primary }}
              />
            </div>
            
            <p 
              className="text-sm mb-4 font-mono"
              style={{ color: theme.colors.textSecondary }}
            >
              Access granted to the neural memory matrix. No authentication protocols required.
              <br />
              Your consciousness awaits digitization.
            </p>
            
            <button
              onClick={onGetStarted}
              className="group relative px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 overflow-hidden"
              style={{ 
                backgroundColor: `${theme.colors.primary}20`,
                color: theme.colors.primary,
                border: `1px solid ${theme.colors.primary}50`
              }}
            >
              <span className="relative z-10 font-mono">&gt; JACK IN NOW_</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Bolt.new Badge */}
      <div className="relative z-10 w-full flex justify-center pb-8">
        <a
          href="https://bolt.new"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center space-x-2 px-4 py-2 rounded-full backdrop-blur-sm border border-opacity-20 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          style={{ 
            backgroundColor: `${theme.colors.surface}60`,
            borderColor: theme.colors.accent,
            color: theme.colors.textSecondary
          }}
        >
          <Zap 
            className="w-4 h-4 group-hover:animate-pulse transition-all duration-300" 
            style={{ color: theme.colors.primary }}
          />
          <span className="text-sm font-medium group-hover:text-opacity-90 transition-all duration-300">
            Built with Bolt.new
          </span>
          <div className="w-2 h-2 rounded-full bg-green-400 animate-ping opacity-60" />
        </a>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes animate-tilt {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
