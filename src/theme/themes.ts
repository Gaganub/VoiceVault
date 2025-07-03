import { Theme, ThemeName } from '../types';

export const themes: Record<ThemeName, Theme> = {
  'velvet-teal': {
    name: 'Velvet Teal',
    colors: {
      primary: '#4FBDBA',
      secondary: '#2A5A5A',
      accent: '#7DD3D8',
      background: '#0A1515',
      surface: '#1A3535',
      text: '#FFFFFF',
      textSecondary: '#B8E6E1',
    },
  },
  'mauven-satin': {
    name: 'Mauven Satin',
    colors: {
      primary: '#B19CD9',
      secondary: '#4A4A4A',
      accent: '#E8DDF7',
      background: '#1A1A1A',
      surface: '#2F2F2F',
      text: '#FFFFFF',
      textSecondary: '#D4C4F9',
    },
  },
  'ivory-mint': {
    name: 'Ivory Mint',
    colors: {
      primary: '#2D8B7B',
      secondary: '#A8E6D7',
      accent: '#C7F0E8',
      background: '#FAFFFE',
      surface: '#F0FBF7',
      text: '#1A4A3A',
      textSecondary: '#2D6B5A',
    },
  },
  'crimson-smoke': {
    name: 'Crimson Smoke',
    colors: {
      primary: '#D64545',
      secondary: '#5A1A1A',
      accent: '#F5A3A3',
      background: '#0F0505',
      surface: '#2A0A0A',
      text: '#FFFFFF',
      textSecondary: '#F2B8B8',
    },
  },
  'noir-lavender': {
    name: 'Noir Lavender',
    colors: {
      primary: '#8B6BB0',
      secondary: '#2A2A2A',
      accent: '#D4BBF6',
      background: '#0A0A0A',
      surface: '#1A1A1A',
      text: '#FFFFFF',
      textSecondary: '#C4A4F6',
    },
  },
};