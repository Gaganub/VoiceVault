import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if we have valid Supabase credentials
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'https://demo.supabase.co' && 
  supabaseAnonKey !== 'demo-key';

if (!isSupabaseConfigured) {
  console.warn('Supabase credentials not found. Using demo mode.');
}

export const supabase = createClient(
  supabaseUrl || 'https://demo.supabase.co',
  supabaseAnonKey || 'demo-key'
);

// Mock data for demo mode
const mockMemories = [
  {
    id: 'demo-memory-1',
    user_id: 'demo-user',
    title: 'First Memory',
    content: 'This is a demo memory to showcase the application.',
    audio_url: null,
    timestamp: new Date().toISOString(),
    tags: ['demo', 'first'],
    mood: 'happy',
    is_private: false,
    ai_insights: { sentiment: 'positive', keywords: ['demo', 'showcase'] },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'demo-memory-2',
    user_id: 'demo-user',
    title: 'Second Memory',
    content: 'Another demo memory with different content.',
    audio_url: null,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    tags: ['demo', 'second'],
    mood: 'reflective',
    is_private: false,
    ai_insights: { sentiment: 'neutral', keywords: ['demo', 'content'] },
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString()
  }
];

let localMemories = [...mockMemories];

// Database operations
export const memoryService = {
  async getMemories(userId: string) {
    // Use local demo data if not configured or if using demo user
    if (!isSupabaseConfigured || userId === 'demo-user') {
      return localMemories.filter(memory => memory.user_id === userId);
    }

    try {
      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching memories:', error);
      return [];
    }
  },

  async createMemory(memory: any) {
    // Use local demo data if not configured or if using demo user
    if (!isSupabaseConfigured || memory.user_id === 'demo-user') {
      const newMemory = {
        ...memory,
        id: `demo-memory-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      localMemories.unshift(newMemory);
      return newMemory;
    }

    try {
      const { data, error } = await supabase
        .from('memories')
        .insert(memory)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating memory:', error);
      throw error;
    }
  },

  async updateMemory(id: string, updates: any) {
    // Use local demo data if not configured or if updating demo memory
    if (!isSupabaseConfigured || id.startsWith('demo-memory-')) {
      const index = localMemories.findIndex(memory => memory.id === id);
      if (index !== -1) {
        localMemories[index] = {
          ...localMemories[index],
          ...updates,
          updated_at: new Date().toISOString()
        };
        return localMemories[index];
      }
      throw new Error('Memory not found');
    }

    try {
      const { data, error } = await supabase
        .from('memories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating memory:', error);
      throw error;
    }
  },

  async deleteMemory(id: string) {
    // Use local demo data if not configured or if deleting demo memory
    if (!isSupabaseConfigured || id.startsWith('demo-memory-')) {
      const index = localMemories.findIndex(memory => memory.id === id);
      if (index !== -1) {
        localMemories.splice(index, 1);
        return;
      }
      throw new Error('Memory not found');
    }

    try {
      const { error } = await supabase
        .from('memories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting memory:', error);
      throw error;
    }
  }
};

export const profileService = {
  async updateProfile(userId: string, updates: any) {
    // Use local demo data if not configured or if using demo user
    if (!isSupabaseConfigured || userId === 'demo-user') {
      // For demo mode, just return the updates as if they were saved
      return {
        id: 'demo-profile',
        user_id: userId,
        ...updates,
        updated_at: new Date().toISOString()
      };
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
};

export { isSupabaseConfigured };
