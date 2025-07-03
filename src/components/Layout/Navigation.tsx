import React, { useState } from 'react';
import { Brain, Mic, Settings, User, Menu, X, BarChart3, LogOut } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  hasInsights?: boolean;
  user?: any;
  onSignOut?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  currentView, 
  onViewChange, 
  hasInsights = false,
  user,
  onSignOut
}) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: t('nav.memories'), icon: Brain },
    { id: 'record', label: t('nav.record'), icon: Mic },
    ...(hasInsights ? [{ id: 'insights', label: t('nav.insights'), icon: BarChart3 }] : []),
    { id: 'profile', label: t('nav.profile'), icon: User },
    { id: 'settings', label: t('nav.settings'), icon: Settings },
  ];

  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut();
    }
  };

  return (
    <>
      <nav 
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-opacity-20"
        style={{ 
          backgroundColor: `${theme.colors.surface}95`,
          borderColor: theme.colors.accent 
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Brain 
                className="w-8 h-8 transition-transform hover:scale-110" 
                style={{ color: theme.colors.primary }}
              />
              <span 
                className="text-xl font-bold"
                style={{ color: theme.colors.text }}
              >
                VoiceVault
              </span>
              <span 
                className="text-xs px-2 py-1 rounded-full"
                style={{ 
                  backgroundColor: `${theme.colors.primary}20`,
                  color: theme.colors.primary 
                }}
              >
                Demo
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => onViewChange(id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                    currentView === id ? 'backdrop-blur-sm' : ''
                  }`}
                  style={{
                    color: currentView === id ? theme.colors.primary : theme.colors.textSecondary,
                    backgroundColor: currentView === id ? `${theme.colors.primary}20` : 'transparent',
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
              
              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${theme.colors.primary}30` }}
                  >
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User 
                        className="w-4 h-4" 
                        style={{ color: theme.colors.primary }}
                      />
                    )}
                  </div>
                  <span 
                    className="text-sm font-medium"
                    style={{ color: theme.colors.text }}
                  >
                    {user?.name || 'Demo User'}
                  </span>
                </div>
                
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                  style={{ 
                    backgroundColor: `${theme.colors.surface}40`,
                    color: theme.colors.textSecondary 
                  }}
                  title={t('nav.signOut')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ color: theme.colors.text }}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div 
            className="md:hidden backdrop-blur-md border-t border-opacity-20"
            style={{ 
              backgroundColor: `${theme.colors.surface}95`,
              borderColor: theme.colors.accent 
            }}
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    onViewChange(id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    currentView === id ? 'backdrop-blur-sm' : ''
                  }`}
                  style={{
                    color: currentView === id ? theme.colors.primary : theme.colors.textSecondary,
                    backgroundColor: currentView === id ? `${theme.colors.primary}20` : 'transparent',
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
              
              {/* Mobile User Info */}
              <div 
                className="flex items-center justify-between px-4 py-3 rounded-lg border-t border-opacity-20 mt-4"
                style={{ borderColor: theme.colors.accent }}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${theme.colors.primary}30` }}
                  >
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User 
                        className="w-4 h-4" 
                        style={{ color: theme.colors.primary }}
                      />
                    )}
                  </div>
                  <span 
                    className="text-sm font-medium"
                    style={{ color: theme.colors.text }}
                  >
                    {user?.name || 'Demo User'}
                  </span>
                </div>
                
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                  style={{ 
                    backgroundColor: `${theme.colors.surface}40`,
                    color: theme.colors.textSecondary 
                  }}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
      <div className="h-16"></div>
    </>
  );
};