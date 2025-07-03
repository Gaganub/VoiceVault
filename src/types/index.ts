export interface Memory {
  id: string;
  title: string;
  content: string;
  audioUrl?: string;
  timestamp: Date;
  tags: string[];
  mood: 'happy' | 'sad' | 'neutral' | 'excited' | 'reflective';
  isPrivate: boolean;
  lastEditedAt?: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  subscription: 'free' | 'premium' | 'family' | 'enterprise';
  theme: ThemeName;
}

export type ThemeName = 'velvet-teal' | 'mauven-satin' | 'ivory-mint' | 'crimson-smoke' | 'noir-lavender';

export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
}

export interface AIInsights {
  sentiment: 'positive' | 'negative' | 'neutral';
  keywords: string[];
  suggestedTags: string[];
  emotionalTone: string;
  summary: string;
  relatedMemories: string[];
  confidence: number;
  themes: string[];
  mood: 'happy' | 'sad' | 'neutral' | 'excited' | 'reflective';
}

export interface ShareLink {
  id: string;
  url: string;
  expiresAt: Date | null;
  accessCount: number;
  maxAccess?: number;
  allowedEmails?: string[];
  isPublic: boolean;
  createdAt: Date;
}

export interface DeletedMemory extends Memory {
  deletedAt: Date;
  recoveryDeadline: Date;
}