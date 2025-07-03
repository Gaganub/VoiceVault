import React from 'react';
import { Check } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { themes } from '../../theme/themes';
import { ThemeName } from '../../types';

export const ThemeSelector: React.FC = () => {
  const { currentTheme, setTheme, theme } = useTheme();

  return (
    <div 
      className="p-6 rounded-2xl backdrop-blur-sm border border-opacity-20"
      style={{ 
        backgroundColor: `${theme.colors.surface}40`,
        borderColor: theme.colors.accent 
      }}
    >
      <h3 
        className="text-xl font-bold mb-4"
        style={{ color: theme.colors.text }}
      >
        Choose Your Theme
      </h3>
      <p 
        className="mb-6"
        style={{ color: theme.colors.textSecondary }}
      >
        Personalize your VoiceVault experience with beautiful color themes
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Object.keys(themes) as ThemeName[]).map((themeKey) => {
          const themeOption = themes[themeKey];
          const isSelected = currentTheme === themeKey;

          return (
            <button
              key={themeKey}
              onClick={() => setTheme(themeKey)}
              className={`relative p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                isSelected ? 'scale-105' : ''
              }`}
              style={{
                borderColor: isSelected ? themeOption.colors.primary : `${themeOption.colors.accent}50`,
                backgroundColor: themeOption.colors.surface,
              }}
            >
              {isSelected && (
                <div 
                  className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: themeOption.colors.primary }}
                >
                  <Check 
                    className="w-4 h-4" 
                    style={{ color: themeOption.colors.background }}
                  />
                </div>
              )}

              <div className="mb-3">
                <div className="flex space-x-2 mb-2">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: themeOption.colors.primary }}
                  ></div>
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: themeOption.colors.secondary }}
                  ></div>
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: themeOption.colors.accent }}
                  ></div>
                </div>
              </div>

              <h4 
                className="font-bold text-sm mb-1"
                style={{ color: themeOption.colors.text }}
              >
                {themeOption.name}
              </h4>
              <p 
                className="text-xs"
                style={{ color: themeOption.colors.textSecondary }}
              >
                {themeKey.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};