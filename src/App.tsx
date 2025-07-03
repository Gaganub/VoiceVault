import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Hero } from './components/Landing/Hero';
import { Navigation } from './components/Layout/Navigation';
import { MemoryTimeline } from './components/Dashboard/MemoryTimeline';
import { MemoryStats } from './components/Dashboard/MemoryStats';
import { VoiceRecorder } from './components/Voice/VoiceRecorder';
import { SettingsPanel } from './components/Settings/SettingsPanel';
import { ProfilePanel } from './components/Profile/ProfilePanel';
import { AIAvatar } from './components/AI/AIAvatar';
import { WalletConnect } from './components/Blockchain/WalletConnect';
import { MemoryInsights } from './components/Analytics/MemoryInsights';
import { AIInsightsPanel } from './components/AI/AIInsightsPanel';
import { PricingModal } from './components/Subscription/PricingModal';
import { useAuth } from './hooks/useAuth';
import { memoryService } from './lib/supabase';
import { Memory, AIInsights } from './types';

function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'record' | 'settings' | 'profile' | 'insights'>('landing');
  const [memories, setMemories] = useState<Memory[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isLoadingMemories, setIsLoadingMemories] = useState(false);
  const [appError, setAppError] = useState<string>('');
  const [hasLoadedMemories, setHasLoadedMemories] = useState(false);

  // Load memories when user is available and we haven't loaded them yet
  useEffect(() => {
    if (user && !hasLoadedMemories && currentView === 'dashboard') {
      loadMemories();
    }
  }, [user, currentView, hasLoadedMemories]);

  const loadMemories = async () => {
    if (!user || hasLoadedMemories) return;
    
    setIsLoadingMemories(true);
    try {
      const userMemories = await memoryService.getMemories(user.id);
      setMemories(userMemories.map(m => ({
        ...m,
        timestamp: new Date(m.timestamp)
      })));
      setHasLoadedMemories(true);
    } catch (error) {
      console.error('Error loading memories:', error);
      setAppError('Failed to load memories. Please refresh the page.');
    } finally {
      setIsLoadingMemories(false);
    }
  };

  const handleGetStarted = () => {
    // Always navigate to dashboard when user clicks get started
    setCurrentView('dashboard');
  };

  const handleCreateMemory = () => {
    setCurrentView('record');
  };

  const handleSaveMemory = async (audioBlob: Blob, title: string, content: string, aiInsights?: AIInsights) => {
    if (!user) {
      alert('Please wait for demo initialization...');
      return;
    }

    try {
      // Create memory object
      const memoryData = {
        user_id: user.id,
        title,
        content,
        tags: aiInsights?.suggestedTags || extractTags(content),
        mood: aiInsights?.mood || 'neutral',
        is_private: false,
        ai_insights: aiInsights ? JSON.stringify(aiInsights) : null,
        timestamp: new Date().toISOString()
      };

      // Save to database
      const savedMemory = await memoryService.createMemory(memoryData);
      
      // Add to local state
      const newMemory: Memory = {
        id: savedMemory.id,
        title: savedMemory.title,
        content: savedMemory.content,
        audioUrl: audioBlob ? URL.createObjectURL(audioBlob) : undefined,
        timestamp: new Date(savedMemory.timestamp),
        tags: savedMemory.tags || [],
        mood: savedMemory.mood,
        isPrivate: savedMemory.is_private
      };
      
      setMemories(prev => [newMemory, ...prev]);
      setCurrentView('dashboard');
      
      alert('Memory saved successfully! 🎉');
    } catch (error) {
      console.error('Error saving memory:', error);
      alert('Failed to save memory. Please try again.');
    }
  };

  const handleCancelRecording = () => {
    setCurrentView('dashboard');
  };

  const handlePlayMemory = (memory: Memory) => {
    setSelectedMemory(memory);
    if (memory.audioUrl) {
      const audio = new Audio(memory.audioUrl);
      audio.play().catch(console.error);
    }
  };

  const handleEditMemory = async (memory: Memory) => {
    if (!user) return;

    try {
      const updates = {
        title: memory.title,
        content: memory.content,
        tags: memory.tags,
        mood: memory.mood,
        is_private: memory.isPrivate,
        updated_at: new Date().toISOString()
      };
      
      await memoryService.updateMemory(memory.id, updates);
      
      // Update local state
      setMemories(prev => prev.map(m => 
        m.id === memory.id ? { ...memory } : m
      ));
      
      if (selectedMemory?.id === memory.id) {
        setSelectedMemory(memory);
      }
      
      alert('Memory updated successfully!');
    } catch (error) {
      console.error('Error updating memory:', error);
      alert('Failed to update memory. Please try again.');
    }
  };

  const handleShareMemory = (memory: Memory) => {
    // Share functionality is handled by the ShareModal component
    console.log('Sharing memory:', memory.title);
  };

  const handleDeleteMemory = async (memory: Memory) => {
    if (!user) return;

    try {
      await memoryService.deleteMemory(memory.id);
      
      setMemories(prev => prev.filter(m => m.id !== memory.id));
      
      if (selectedMemory?.id === memory.id) {
        setSelectedMemory(null);
      }
      
      alert('Memory deleted successfully.');
    } catch (error) {
      console.error('Error deleting memory:', error);
      alert('Failed to delete memory. Please try again.');
    }
  };

  const handleSelectPlan = (plan: string) => {
    console.log('Selected plan:', plan);
    alert(`Selected ${plan} plan! This is a demo - no payment required.`);
    setShowPricingModal(false);
  };

  const handleWalletConnect = (address: string) => {
    setIsWalletConnected(true);
    console.log('Wallet connected:', address);
    alert('Demo wallet connected successfully! 🔗');
  };

  const handleWalletDisconnect = () => {
    setIsWalletConnected(false);
    alert('Wallet disconnected.');
  };

  const handleSignOut = () => {
    signOut();
    setMemories([]);
    setSelectedMemory(null);
    setHasLoadedMemories(false);
    setCurrentView('landing');
    alert('Signed out successfully!');
  };

  const extractTags = (content: string): string[] => {
    const tagMap: Record<string, string[]> = {
      family: ['family', 'mom', 'dad', 'sister', 'brother', 'child', 'parent', 'relative', 'grandmother', 'grandfather'],
      work: ['work', 'job', 'office', 'meeting', 'project', 'colleague', 'boss', 'career', 'coding', 'algorithm'],
      travel: ['travel', 'trip', 'vacation', 'flight', 'hotel', 'beach', 'mountain', 'city', 'park'],
      food: ['food', 'restaurant', 'cooking', 'recipe', 'dinner', 'lunch', 'breakfast', 'meal', 'pasta', 'coffee'],
      friends: ['friend', 'buddy', 'pal', 'companion', 'social', 'party', 'gathering'],
      music: ['music', 'concert', 'symphony', 'song', 'instrument', 'guitar', 'piano'],
      nature: ['nature', 'park', 'tree', 'flower', 'garden', 'outdoor', 'hiking', 'rain', 'sunset', 'stars'],
      exercise: ['exercise', 'gym', 'fitness', 'running', 'workout', 'sport', 'health'],
      learning: ['learn', 'study', 'book', 'course', 'education', 'knowledge', 'skill'],
      creativity: ['art', 'creative', 'design', 'paint', 'draw', 'write', 'craft']
    };

    const contentLower = content.toLowerCase();
    return Object.keys(tagMap).filter(tag => 
      tagMap[tag].some(keyword => contentLower.includes(keyword))
    ).slice(0, 3);
  };

  const renderCurrentView = () => {
    if (appError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-4 text-red-600">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{appError}</p>
            <button
              onClick={() => {
                setAppError('');
                window.location.reload();
              }}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    if (authLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg">Loading VoiceVault Demo...</p>
            <p className="text-sm text-gray-500 mt-2">Preparing your memory vault</p>
          </div>
        </div>
      );
    }

    // Always show landing page first, regardless of user state
    if (currentView === 'landing') {
      return <Hero onGetStarted={handleGetStarted} />;
    }

    // For other views, show them only if user exists
    if (!user) {
      return <Hero onGetStarted={handleGetStarted} />;
    }

    switch (currentView) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <MemoryStats memories={memories} />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {isLoadingMemories ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg">Loading your memories...</p>
                  </div>
                ) : (
                  <MemoryTimeline 
                    memories={memories} 
                    onCreateMemory={handleCreateMemory} 
                    onPlayMemory={handlePlayMemory}
                    onEditMemory={handleEditMemory}
                    onShareMemory={handleShareMemory}
                    onDeleteMemory={handleDeleteMemory}
                  />
                )}
              </div>
              <div className="space-y-6">
                {selectedMemory && (
                  <AIAvatar 
                    memory={selectedMemory} 
                    onPlayToggle={() => console.log('Playing:', selectedMemory.title)}
                  />
                )}
                <WalletConnect 
                  onConnect={handleWalletConnect}
                  onDisconnect={handleWalletDisconnect}
                />
                <AIInsightsPanel memories={memories} />
              </div>
            </div>
          </div>
        );
      case 'record':
        return <VoiceRecorder onSave={handleSaveMemory} onCancel={handleCancelRecording} />;
      case 'settings':
        return <SettingsPanel onUpgrade={() => setShowPricingModal(true)} />;
      case 'profile':
        return <ProfilePanel onUpgrade={() => setShowPricingModal(true)} />;
      case 'insights':
        return (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <MemoryInsights memories={memories} />
          </div>
        );
      default:
        return <Hero onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <LanguageProvider>
      <ThemeProvider>
        <div className="min-h-screen transition-all duration-300">
          {user && currentView !== 'landing' && (
            <Navigation 
              currentView={currentView} 
              onViewChange={setCurrentView}
              hasInsights={true}
              user={user}
              onSignOut={handleSignOut}
            />
          )}
          {renderCurrentView()}
          
          <PricingModal
            isOpen={showPricingModal}
            onClose={() => setShowPricingModal(false)}
            onSelectPlan={handleSelectPlan}
          />
        </div>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;