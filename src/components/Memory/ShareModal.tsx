import React, { useState, useEffect } from 'react';
import { X, Share2, Mail, Link, Facebook, Twitter, Copy, Clock, Users, Eye, EyeOff, Calendar, CheckCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Memory } from '../../types';

interface ShareModalProps {
  memory: Memory;
  isOpen: boolean;
  onClose: () => void;
}

interface ShareLink {
  id: string;
  url: string;
  expiresAt: Date | null;
  accessCount: number;
  maxAccess?: number;
  allowedEmails?: string[];
  isPublic: boolean;
  createdAt: Date;
}

export const ShareModal: React.FC<ShareModalProps> = ({ memory, isOpen, onClose }) => {
  const { theme } = useTheme();
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedExpiration, setSelectedExpiration] = useState<string>('7days');
  const [isPublic, setIsPublic] = useState(true);
  const [allowedEmails, setAllowedEmails] = useState('');
  const [maxAccess, setMaxAccess] = useState<number | undefined>();
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [shareHistory, setShareHistory] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadShareHistory();
    }
  }, [isOpen]);

  const loadShareHistory = () => {
    // Load existing share links from localStorage (in real app, from backend)
    const saved = localStorage.getItem(`share-links-${memory.id}`);
    if (saved) {
      const links = JSON.parse(saved).map((link: any) => ({
        ...link,
        expiresAt: link.expiresAt ? new Date(link.expiresAt) : null,
        createdAt: new Date(link.createdAt)
      }));
      setShareLinks(links);
    }

    // Load share history
    const history = localStorage.getItem(`share-history-${memory.id}`);
    if (history) {
      setShareHistory(JSON.parse(history));
    }
  };

  const generateShareLink = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const expirationMap: Record<string, Date | null> = {
        '1hour': new Date(Date.now() + 60 * 60 * 1000),
        '1day': new Date(Date.now() + 24 * 60 * 60 * 1000),
        '7days': new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        '30days': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        'never': null
      };

      const newLink: ShareLink = {
        id: `link-${Date.now()}`,
        url: `https://voicevault.app/shared/${memory.id}/${Date.now()}`,
        expiresAt: expirationMap[selectedExpiration],
        accessCount: 0,
        maxAccess: maxAccess,
        allowedEmails: allowedEmails ? allowedEmails.split(',').map(e => e.trim()) : undefined,
        isPublic,
        createdAt: new Date()
      };

      const updatedLinks = [...shareLinks, newLink];
      setShareLinks(updatedLinks);
      
      // Save to localStorage
      localStorage.setItem(`share-links-${memory.id}`, JSON.stringify(updatedLinks));
      
    } catch (error) {
      console.error('Failed to generate share link:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, linkId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(linkId);
      setTimeout(() => setCopiedLink(null), 2000);
      
      // Track share action
      trackShareAction('copy', text);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const shareViaEmail = (link: string) => {
    const subject = encodeURIComponent(`Check out my memory: ${memory.title}`);
    const body = encodeURIComponent(`I wanted to share this memory with you:\n\n"${memory.title}"\n\n${link}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
    trackShareAction('email', link);
  };

  const shareViaSocial = (platform: string, link: string) => {
    const text = encodeURIComponent(`Check out my memory: ${memory.title}`);
    const url = encodeURIComponent(link);
    
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    };
    
    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
      trackShareAction(platform, link);
    }
  };

  const trackShareAction = (method: string, link: string) => {
    const action = {
      id: Date.now().toString(),
      method,
      link,
      timestamp: new Date(),
      memoryTitle: memory.title
    };
    
    const updatedHistory = [action, ...shareHistory].slice(0, 50); // Keep last 50 actions
    setShareHistory(updatedHistory);
    localStorage.setItem(`share-history-${memory.id}`, JSON.stringify(updatedHistory));
  };

  const revokeLink = (linkId: string) => {
    const updatedLinks = shareLinks.filter(link => link.id !== linkId);
    setShareLinks(updatedLinks);
    localStorage.setItem(`share-links-${memory.id}`, JSON.stringify(updatedLinks));
  };

  const isLinkExpired = (link: ShareLink): boolean => {
    return link.expiresAt ? new Date() > link.expiresAt : false;
  };

  const isLinkAccessExceeded = (link: ShareLink): boolean => {
    return link.maxAccess ? link.accessCount >= link.maxAccess : false;
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
              Share Memory
            </h2>
            <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
              "{memory.title}"
            </p>
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
          {/* Share Link Generator */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: theme.colors.text }}>
                Generate Share Link
              </h3>
              
              {/* Expiration */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
                  Link Expiration
                </label>
                <select
                  value={selectedExpiration}
                  onChange={(e) => setSelectedExpiration(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl backdrop-blur-sm border border-opacity-30 focus:outline-none focus:ring-2 transition-all"
                  style={{ 
                    backgroundColor: `${theme.colors.surface}40`,
                    borderColor: theme.colors.accent,
                    color: theme.colors.text,
                    '--tw-ring-color': theme.colors.primary 
                  } as React.CSSProperties}
                >
                  <option value="1hour">1 Hour</option>
                  <option value="1day">1 Day</option>
                  <option value="7days">7 Days</option>
                  <option value="30days">30 Days</option>
                  <option value="never">Never</option>
                </select>
              </div>

              {/* Access Control */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium" style={{ color: theme.colors.text }}>
                    Public Access
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div 
                      className={`w-11 h-6 rounded-full peer transition-all duration-200 ${
                        isPublic ? 'peer-checked:after:translate-x-full' : ''
                      } peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}
                      style={{ 
                        backgroundColor: isPublic ? theme.colors.primary : theme.colors.surface 
                      }}
                    />
                  </label>
                </div>
                
                {!isPublic && (
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
                      Allowed Email Addresses (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={allowedEmails}
                      onChange={(e) => setAllowedEmails(e.target.value)}
                      placeholder="user1@example.com, user2@example.com"
                      className="w-full px-4 py-3 rounded-xl backdrop-blur-sm border border-opacity-30 focus:outline-none focus:ring-2 transition-all"
                      style={{ 
                        backgroundColor: `${theme.colors.surface}40`,
                        borderColor: theme.colors.accent,
                        color: theme.colors.text,
                        '--tw-ring-color': theme.colors.primary 
                      } as React.CSSProperties}
                    />
                  </div>
                )}
              </div>

              {/* Max Access Count */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
                  Maximum Access Count (optional)
                </label>
                <input
                  type="number"
                  value={maxAccess || ''}
                  onChange={(e) => setMaxAccess(e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Unlimited"
                  min="1"
                  className="w-full px-4 py-3 rounded-xl backdrop-blur-sm border border-opacity-30 focus:outline-none focus:ring-2 transition-all"
                  style={{ 
                    backgroundColor: `${theme.colors.surface}40`,
                    borderColor: theme.colors.accent,
                    color: theme.colors.text,
                    '--tw-ring-color': theme.colors.primary 
                  } as React.CSSProperties}
                />
              </div>

              <button
                onClick={generateShareLink}
                disabled={isGenerating}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50"
                style={{ 
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.background 
                }}
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Link className="w-5 h-5" />
                    <span>Generate Share Link</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Share Options */}
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: theme.colors.text }}>
                Quick Share
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => shareViaEmail(window.location.href)}
                  className="flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 hover:scale-105"
                  style={{ 
                    backgroundColor: `${theme.colors.primary}20`,
                    color: theme.colors.primary 
                  }}
                >
                  <Mail className="w-5 h-5" />
                  <span>Email</span>
                </button>
                <button
                  onClick={() => shareViaSocial('twitter', window.location.href)}
                  className="flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 hover:scale-105"
                  style={{ 
                    backgroundColor: `${theme.colors.secondary}20`,
                    color: theme.colors.secondary 
                  }}
                >
                  <Twitter className="w-5 h-5" />
                  <span>Twitter</span>
                </button>
                <button
                  onClick={() => shareViaSocial('facebook', window.location.href)}
                  className="flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 hover:scale-105"
                  style={{ 
                    backgroundColor: `${theme.colors.accent}20`,
                    color: theme.colors.accent 
                  }}
                >
                  <Facebook className="w-5 h-5" />
                  <span>Facebook</span>
                </button>
                <button
                  onClick={() => copyToClipboard(window.location.href, 'direct')}
                  className="flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 hover:scale-105"
                  style={{ 
                    backgroundColor: `${theme.colors.primary}20`,
                    color: theme.colors.primary 
                  }}
                >
                  {copiedLink === 'direct' ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Active Links & History */}
          <div className="space-y-6">
            {/* Active Share Links */}
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: theme.colors.text }}>
                Active Share Links
              </h3>
              
              {shareLinks.length === 0 ? (
                <div 
                  className="p-6 rounded-xl text-center"
                  style={{ backgroundColor: `${theme.colors.surface}40` }}
                >
                  <Share2 className="w-12 h-12 mx-auto mb-3" style={{ color: theme.colors.textSecondary }} />
                  <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                    No active share links yet
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {shareLinks.map((link) => {
                    const isExpired = isLinkExpired(link);
                    const isAccessExceeded = isLinkAccessExceeded(link);
                    const isInactive = isExpired || isAccessExceeded;
                    
                    return (
                      <div
                        key={link.id}
                        className={`p-4 rounded-xl border border-opacity-20 ${isInactive ? 'opacity-60' : ''}`}
                        style={{ 
                          backgroundColor: `${theme.colors.surface}40`,
                          borderColor: isInactive ? '#ef4444' : theme.colors.accent 
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {link.isPublic ? (
                              <Eye className="w-4 h-4" style={{ color: theme.colors.primary }} />
                            ) : (
                              <EyeOff className="w-4 h-4" style={{ color: theme.colors.accent }} />
                            )}
                            <span className="text-sm font-medium" style={{ color: theme.colors.text }}>
                              {link.isPublic ? 'Public' : 'Private'} Link
                            </span>
                          </div>
                          <button
                            onClick={() => revokeLink(link.id)}
                            className="text-xs px-2 py-1 rounded text-red-400 hover:bg-red-400 hover:bg-opacity-20 transition-colors"
                          >
                            Revoke
                          </button>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-2">
                          <input
                            type="text"
                            value={link.url}
                            readOnly
                            className="flex-1 px-3 py-2 text-xs rounded-lg border border-opacity-20 bg-transparent"
                            style={{ 
                              borderColor: theme.colors.accent,
                              color: theme.colors.textSecondary 
                            }}
                          />
                          <button
                            onClick={() => copyToClipboard(link.url, link.id)}
                            className="px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                            style={{ 
                              backgroundColor: `${theme.colors.primary}20`,
                              color: theme.colors.primary 
                            }}
                          >
                            {copiedLink === link.id ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs" style={{ color: theme.colors.textSecondary }}>
                          <div className="flex items-center space-x-4">
                            <span>Views: {link.accessCount}</span>
                            {link.maxAccess && <span>Max: {link.maxAccess}</span>}
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {link.expiresAt ? (
                                isExpired ? 'Expired' : `Expires ${link.expiresAt.toLocaleDateString()}`
                              ) : 'Never expires'}
                            </span>
                          </div>
                        </div>
                        
                        {isInactive && (
                          <div className="mt-2 text-xs text-red-400">
                            {isExpired && 'This link has expired'}
                            {isAccessExceeded && 'Maximum access count reached'}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Share History */}
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: theme.colors.text }}>
                Share History
              </h3>
              
              {shareHistory.length === 0 ? (
                <div 
                  className="p-6 rounded-xl text-center"
                  style={{ backgroundColor: `${theme.colors.surface}40` }}
                >
                  <Clock className="w-12 h-12 mx-auto mb-3" style={{ color: theme.colors.textSecondary }} />
                  <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                    No sharing activity yet
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {shareHistory.slice(0, 10).map((action) => (
                    <div
                      key={action.id}
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: `${theme.colors.surface}40` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: theme.colors.primary }}
                          />
                          <span className="text-sm capitalize" style={{ color: theme.colors.text }}>
                            Shared via {action.method}
                          </span>
                        </div>
                        <span className="text-xs" style={{ color: theme.colors.textSecondary }}>
                          {new Date(action.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};