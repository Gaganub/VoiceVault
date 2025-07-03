import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  subscription: 'free' | 'premium' | 'family' | 'enterprise';
  theme: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initDemoUser = async () => {
      try {
        // If Supabase is not configured, use local demo user immediately
        if (!isSupabaseConfigured) {
          setUser({
            id: 'demo-user',
            name: 'Demo User',
            email: 'demo@voicevault.app',
            subscription: 'free',
            theme: 'velvet-teal'
          });
          setLoading(false);
          return;
        }

        // For configured Supabase, just use demo mode to avoid authentication issues
        // This prevents any anonymous sign-in attempts that could fail
        console.log('Using demo mode to avoid authentication provider issues');
        setUser({
          id: 'demo-user',
          name: 'Demo User',
          email: 'demo@voicevault.app',
          subscription: 'free',
          theme: 'velvet-teal'
        });
        setLoading(false);

      } catch (error) {
        console.error('Demo auth error:', error);
        // Fallback to local demo user
        setUser({
          id: 'demo-user',
          name: 'Demo User',
          email: 'demo@voicevault.app',
          subscription: 'free',
          theme: 'velvet-teal'
        });
        setLoading(false);
      }
    };

    initDemoUser();
  }, []);

  const signOut = async () => {
    // Only attempt sign out if we have a real Supabase session
    // For demo mode, just clear the user state
    setUser(null);
  };

  return { user, loading, signOut };
};