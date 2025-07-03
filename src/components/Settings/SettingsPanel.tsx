import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, CreditCard, Palette, Smartphone, Globe, Download, Check, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage, Language } from '../../contexts/LanguageContext';
import { ThemeSelector } from './ThemeSelector';

interface SettingsPanelProps {
  onUpgrade?: () => void;
}

interface NotificationSettings {
  memoryReminders: boolean;
  weeklyInsights: boolean;
  sharingNotifications: boolean;
  backupAlerts: boolean;
}

interface PrivacySettings {
  privateByDefault: boolean;
  blockchainEncryption: boolean;
  twoFactorAuth: boolean;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ onUpgrade }) => {
  const { theme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  
  // Settings state
  const [notifications, setNotifications] = useState<NotificationSettings>({
    memoryReminders: true,
    weeklyInsights: true,
    sharingNotifications: false,
    backupAlerts: true
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    privateByDefault: true,
    blockchainEncryption: false,
    twoFactorAuth: false
  });

  const [isExporting, setIsExporting] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('voicevault-notifications');
    const savedPrivacy = localStorage.getItem('voicevault-privacy');

    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
    if (savedPrivacy) {
      setPrivacy(JSON.parse(savedPrivacy));
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('voicevault-notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('voicevault-privacy', JSON.stringify(privacy));
  }, [privacy]);

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePrivacyChange = (key: keyof PrivacySettings) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    alert(t('common.success') + '! ' + t('settings.language') + ' ' + t('common.confirm'));
  };

  const handleDataExport = async () => {
    setIsExporting(true);
    
    try {
      // Simulate data export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create mock export data
      const exportData = {
        profile: {
          name: 'Demo User',
          email: 'demo@voicevault.app',
          memberSince: 'Demo Session'
        },
        memories: [],
        settings: {
          notifications,
          privacy,
          language
        },
        exportDate: new Date().toISOString()
      };

      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `voicevault-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert(t('common.success') + '! 📁');
    } catch (error) {
      console.error('Export error:', error);
      alert(t('common.error') + '. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const languages = [
    { code: 'en' as Language, name: 'English' },
    { code: 'es' as Language, name: 'Español' },
    { code: 'fr' as Language, name: 'Français' },
    { code: 'de' as Language, name: 'Deutsch' },
    { code: 'ja' as Language, name: '日本語' },
    { code: 'zh' as Language, name: '中文' },
    { code: 'ko' as Language, name: '한국어' },
    { code: 'pt' as Language, name: 'Português' },
    { code: 'ru' as Language, name: 'Русский' },
    { code: 'ar' as Language, name: 'العربية' },
  ];

  const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void; disabled?: boolean }> = ({ 
    checked, 
    onChange, 
    disabled = false 
  }) => (
    <label className={`relative inline-flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only peer"
      />
      <div 
        className={`w-11 h-6 rounded-full peer transition-all duration-200 ${
          checked ? 'peer-checked:after:translate-x-full' : ''
        } peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}
        style={{ 
          backgroundColor: checked ? theme.colors.primary : theme.colors.surface 
        }}
      />
    </label>
  );

  const settingsSections = [
    {
      icon: Palette,
      title: t('settings.appearance'),
      description: 'Customize your visual experience',
      component: <ThemeSelector />
    },
    {
      icon: Bell,
      title: t('settings.notifications'),
      description: 'Control your notification preferences',
      component: (
        <div 
          className="p-6 rounded-2xl backdrop-blur-sm border border-opacity-30"
          style={{ 
            backgroundColor: `${theme.colors.surface}80`,
            borderColor: theme.colors.accent 
          }}
        >
          <div className="space-y-4">
            {[
              { 
                key: 'memoryReminders' as keyof NotificationSettings, 
                label: 'Memory Reminders', 
                description: 'Daily prompts to capture memories' 
              },
              { 
                key: 'weeklyInsights' as keyof NotificationSettings, 
                label: 'Weekly Insights', 
                description: 'AI-generated weekly memory insights' 
              },
              { 
                key: 'sharingNotifications' as keyof NotificationSettings, 
                label: 'Sharing Notifications', 
                description: 'When someone shares a memory with you' 
              },
              { 
                key: 'backupAlerts' as keyof NotificationSettings, 
                label: 'Backup Alerts', 
                description: 'Blockchain backup status updates' 
              }
            ].map((setting) => (
              <div key={setting.key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium" style={{ color: theme.colors.text }}>
                    {setting.label}
                  </p>
                  <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                    {setting.description}
                  </p>
                </div>
                <ToggleSwitch
                  checked={notifications[setting.key]}
                  onChange={() => handleNotificationChange(setting.key)}
                />
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      icon: Shield,
      title: t('settings.privacy'),
      description: 'Manage your privacy and security settings',
      component: (
        <div 
          className="p-6 rounded-2xl backdrop-blur-sm border border-opacity-30"
          style={{ 
            backgroundColor: `${theme.colors.surface}80`,
            borderColor: theme.colors.accent 
          }}
        >
          <div className="space-y-4">
            {[
              { 
                key: 'privateByDefault' as keyof PrivacySettings, 
                label: 'Private by Default', 
                description: 'New memories are private unless shared' 
              },
              { 
                key: 'blockchainEncryption' as keyof PrivacySettings, 
                label: 'Blockchain Encryption', 
                description: 'Store memories on Algorand blockchain' 
              },
              { 
                key: 'twoFactorAuth' as keyof PrivacySettings, 
                label: 'Two-Factor Authentication', 
                description: 'Extra security for your account' 
              }
            ].map((setting) => (
              <div key={setting.key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium" style={{ color: theme.colors.text }}>
                    {setting.label}
                  </p>
                  <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                    {setting.description}
                  </p>
                </div>
                <ToggleSwitch
                  checked={privacy[setting.key]}
                  onChange={() => handlePrivacyChange(setting.key)}
                />
              </div>
            ))}
            
            {/* Data Export */}
            <div className="flex items-center justify-between pt-4 border-t border-opacity-20" style={{ borderColor: theme.colors.accent }}>
              <div>
                <p className="font-medium" style={{ color: theme.colors.text }}>
                  {t('settings.export')}
                </p>
                <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                  Download all your memories and settings
                </p>
              </div>
              <button
                onClick={handleDataExport}
                disabled={isExporting}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50"
                style={{ 
                  backgroundColor: `${theme.colors.primary}30`,
                  color: theme.colors.primary 
                }}
              >
                {isExporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>{t('common.loading')}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>{t('settings.export')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: Globe,
      title: t('settings.language'),
      description: 'Set your language and regional preferences',
      component: (
        <div 
          className="p-6 rounded-2xl backdrop-blur-sm border border-opacity-30"
          style={{ 
            backgroundColor: `${theme.colors.surface}80`,
            borderColor: theme.colors.accent 
          }}
        >
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
              {t('settings.language')}
            </label>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value as Language)}
              className="w-full px-4 py-3 rounded-xl backdrop-blur-sm border border-opacity-30 focus:outline-none focus:ring-2 transition-all"
              style={{ 
                backgroundColor: `${theme.colors.surface}60`,
                borderColor: theme.colors.accent,
                color: theme.colors.text,
                '--tw-ring-color': theme.colors.primary 
              } as React.CSSProperties}
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
            <p className="text-xs mt-2" style={{ color: theme.colors.textSecondary }}>
              Language changes apply immediately to all interface elements
            </p>
          </div>
        </div>
      )
    },
    {
      icon: CreditCard,
      title: t('settings.subscription'),
      description: 'Manage your subscription and billing',
      component: (
        <div 
          className="p-6 rounded-2xl backdrop-blur-sm border border-opacity-30"
          style={{ 
            backgroundColor: `${theme.colors.surface}80`,
            borderColor: theme.colors.accent 
          }}
        >
          <div className="text-center">
            <div 
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: `${theme.colors.primary}30` }}
            >
              <CreditCard 
                className="w-8 h-8" 
                style={{ color: theme.colors.primary }}
              />
            </div>
            <h4 
              className="text-lg font-bold mb-2"
              style={{ color: theme.colors.text }}
            >
              Free Plan
            </h4>
            <p 
              className="mb-4"
              style={{ color: theme.colors.textSecondary }}
            >
              You're currently on the free plan with demo access to all features
            </p>
            <button
              onClick={onUpgrade}
              className="px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
              style={{ 
                backgroundColor: theme.colors.primary,
                color: theme.colors.background 
              }}
            >
              {t('profile.upgradeToPremiun')}
            </button>
          </div>
        </div>
      )
    },
  ];

  return (
    <div 
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div className="mb-8">
        <h1 
          className="text-3xl font-bold mb-2"
          style={{ color: theme.colors.text }}
        >
          {t('settings.title')}
        </h1>
        <p 
          className="text-lg"
          style={{ color: theme.colors.textSecondary }}
        >
          Customize your VoiceVault experience
        </p>
      </div>

      <div className="space-y-8">
        {settingsSections.map((section, index) => (
          <div key={index}>
            <div className="flex items-center space-x-3 mb-4">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${theme.colors.primary}30` }}
              >
                <section.icon 
                  className="w-5 h-5" 
                  style={{ color: theme.colors.primary }}
                />
              </div>
              <div>
                <h2 
                  className="text-xl font-bold"
                  style={{ color: theme.colors.text }}
                >
                  {section.title}
                </h2>
                <p 
                  className="text-sm"
                  style={{ color: theme.colors.textSecondary }}
                >
                  {section.description}
                </p>
              </div>
            </div>
            {section.component}
          </div>
        ))}
      </div>
    </div>
  );
};