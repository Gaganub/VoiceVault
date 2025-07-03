import React, { useState, useEffect } from 'react';
import { User, Camera, Mail, Calendar, Crown, Sparkles, Edit2, Save, X, Upload, CreditCard } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { profileService } from '../../lib/supabase';

interface ProfilePanelProps {
  onUpgrade?: () => void;
}

export const ProfilePanel: React.FC<ProfilePanelProps> = ({ onUpgrade }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedEmail, setEditedEmail] = useState(user?.email || '');
  const [profileImage, setProfileImage] = useState(user?.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop');
  const [isUploading, setIsUploading] = useState(false);
  const [memberSince, setMemberSince] = useState('Demo Session');

  // Update local state when user changes
  useEffect(() => {
    if (user) {
      setEditedName(user.name);
      setEditedEmail(user.email);
      setProfileImage(user.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop');
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    
    setIsUploading(true);
    try {
      await profileService.updateProfile(user.id, {
        full_name: editedName,
        avatar_url: profileImage,
        updated_at: new Date().toISOString()
      });
      
      // Update the user object in memory (for demo purposes)
      if (user) {
        user.name = editedName;
        user.avatar = profileImage;
      }
      
      setIsUploading(false);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setIsUploading(false);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditedName(user?.name || '');
    setEditedEmail(user?.email || '');
    setProfileImage(user?.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop');
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpgradeClick = () => {
    if (onUpgrade) {
      onUpgrade();
    }
  };

  const subscriptionInfo = {
    free: { name: 'Free Plan', color: theme.colors.textSecondary, icon: User },
    premium: { name: 'Premium Plan', color: theme.colors.primary, icon: Crown },
    family: { name: 'Family Plan', color: theme.colors.accent, icon: Sparkles },
    enterprise: { name: 'Enterprise Plan', color: theme.colors.secondary, icon: Sparkles },
  };

  const currentSub = subscriptionInfo[user?.subscription || 'free'];

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

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
          Profile
        </h1>
        <p 
          className="text-lg"
          style={{ color: theme.colors.textSecondary }}
        >
          Manage your personal information and preferences
        </p>
      </div>

      <div className="space-y-8">
        {/* Profile Information */}
        <div 
          className="p-8 rounded-2xl backdrop-blur-sm border border-opacity-30"
          style={{ 
            backgroundColor: `${theme.colors.surface}80`,
            borderColor: theme.colors.accent 
          }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <h2 
              className="text-2xl font-bold mb-4 md:mb-0"
              style={{ color: theme.colors.text }}
            >
              Personal Information
            </h2>
            
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                style={{ 
                  backgroundColor: `${theme.colors.primary}30`,
                  color: theme.colors.primary 
                }}
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  disabled={isUploading}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50"
                  style={{ 
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.background 
                  }}
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 border"
                  style={{ 
                    borderColor: theme.colors.textSecondary,
                    color: theme.colors.textSecondary 
                  }}
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4" style={{ borderColor: theme.colors.accent }}>
                <img 
                  src={profileImage} 
                  alt="Profile Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <label className="absolute bottom-2 right-2 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                    style={{ 
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.background 
                    }}
                  >
                    <Upload className="w-5 h-5" />
                  </div>
                </label>
              )}
            </div>

            {/* Profile Details */}
            <div className="flex-1 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: theme.colors.text }}
                  >
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl backdrop-blur-sm border border-opacity-30 focus:outline-none focus:ring-2 transition-all"
                      style={{ 
                        backgroundColor: `${theme.colors.surface}60`,
                        borderColor: theme.colors.accent,
                        color: theme.colors.text,
                        '--tw-ring-color': theme.colors.primary 
                      } as React.CSSProperties}
                    />
                  ) : (
                    <div 
                      className="flex items-center space-x-2 px-4 py-3 rounded-xl backdrop-blur-sm border border-opacity-30"
                      style={{ 
                        backgroundColor: `${theme.colors.surface}40`,
                        borderColor: theme.colors.accent,
                        color: theme.colors.text 
                      }}
                    >
                      <User className="w-5 h-5" style={{ color: theme.colors.textSecondary }} />
                      <span>{editedName}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: theme.colors.text }}
                  >
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl backdrop-blur-sm border border-opacity-30 focus:outline-none focus:ring-2 transition-all"
                      style={{ 
                        backgroundColor: `${theme.colors.surface}60`,
                        borderColor: theme.colors.accent,
                        color: theme.colors.text,
                        '--tw-ring-color': theme.colors.primary 
                      } as React.CSSProperties}
                    />
                  ) : (
                    <div 
                      className="flex items-center space-x-2 px-4 py-3 rounded-xl backdrop-blur-sm border border-opacity-30"
                      style={{ 
                        backgroundColor: `${theme.colors.surface}40`,
                        borderColor: theme.colors.accent,
                        color: theme.colors.text 
                      }}
                    >
                      <Mail className="w-5 h-5" style={{ color: theme.colors.textSecondary }} />
                      <span>{editedEmail}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: theme.colors.text }}
                >
                  Member Since
                </label>
                <div 
                  className="flex items-center space-x-2 px-4 py-3 rounded-xl backdrop-blur-sm border border-opacity-30"
                  style={{ 
                    backgroundColor: `${theme.colors.surface}40`,
                    borderColor: theme.colors.accent,
                    color: theme.colors.text 
                  }}
                >
                  <Calendar className="w-5 h-5" style={{ color: theme.colors.textSecondary }} />
                  <span>{memberSince}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Information */}
        <div 
          className="p-8 rounded-2xl backdrop-blur-sm border border-opacity-30"
          style={{ 
            backgroundColor: `${theme.colors.surface}80`,
            borderColor: theme.colors.accent 
          }}
        >
          <h2 
            className="text-2xl font-bold mb-6"
            style={{ color: theme.colors.text }}
          >
            Subscription
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${currentSub.color}30` }}
              >
                <currentSub.icon 
                  className="w-6 h-6" 
                  style={{ color: currentSub.color }}
                />
              </div>
              <div>
                <h3 
                  className="text-xl font-bold"
                  style={{ color: theme.colors.text }}
                >
                  {currentSub.name}
                </h3>
                <p 
                  className="text-sm"
                  style={{ color: theme.colors.textSecondary }}
                >
                  {user.subscription === 'free' 
                    ? 'Demo access to all features' 
                    : user.subscription === 'premium'
                    ? 'Unlimited memories, AI avatar'
                    : user.subscription === 'family'
                    ? 'Family sharing, multiple avatars'
                    : 'Team features, analytics'
                  }
                </p>
              </div>
            </div>

            {user.subscription === 'free' && (
              <button
                onClick={handleUpgradeClick}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                style={{ 
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.background 
                }}
              >
                <CreditCard className="w-5 h-5" />
                <span>Upgrade to Premium</span>
              </button>
            )}
          </div>
        </div>

        {/* Usage Statistics */}
        <div 
          className="p-8 rounded-2xl backdrop-blur-sm border border-opacity-30"
          style={{ 
            backgroundColor: `${theme.colors.surface}80`,
            borderColor: theme.colors.accent 
          }}
        >
          <h2 
            className="text-2xl font-bold mb-6"
            style={{ color: theme.colors.text }}
          >
            Your Memory Journey
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Memories', value: '0', icon: Sparkles, color: theme.colors.primary },
              { label: 'This Month', value: '0', icon: Calendar, color: theme.colors.secondary },
              { label: 'Voice Hours', value: '0', icon: Crown, color: theme.colors.accent },
              { label: 'Shared', value: '0', icon: User, color: theme.colors.primary },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}30` }}
                >
                  <stat.icon 
                    className="w-8 h-8" 
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
                  className="text-sm"
                  style={{ color: theme.colors.textSecondary }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};