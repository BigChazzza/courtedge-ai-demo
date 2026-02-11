// Theme configurations for demo platform
export type ThemeType = 'chocolate' | 'tech' | 'travel';

export interface ThemeConfig {
  id: ThemeType;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    accentLight: string;
  };
  logo: string;
  emoji: string;
  companyName: string;
  industry: string;
  tagline: string;
}

export const themes: Record<ThemeType, ThemeConfig> = {
  chocolate: {
    id: 'chocolate',
    name: 'Chocolate & Sweets',
    description: 'Artisanal chocolate and confectionery business',
    colors: {
      primary: '#007dc1',      // Okta blue
      secondary: '#0ea5e9',    // Light blue
      accent: '#6B4423',       // Chocolate brown
      accentLight: '#FFD700',  // Gold
    },
    logo: '/images/logo.png',
    emoji: '🍫',
    companyName: 'Sugar & Gold Treats',
    industry: 'Confectionery',
    tagline: 'AI-Powered Artisanal Chocolate Sales',
  },
  tech: {
    id: 'tech',
    name: 'Technology Solutions',
    description: 'Enterprise software and hardware provider',
    colors: {
      primary: '#007dc1',      // Okta blue
      secondary: '#0ea5e9',    // Light blue
      accent: '#6366f1',       // Indigo
      accentLight: '#8b5cf6',  // Purple
    },
    logo: '/images/logo.png',
    emoji: '💻',
    companyName: 'TechPro Solutions',
    industry: 'Technology',
    tagline: 'AI-Powered Enterprise Technology Sales',
  },
  travel: {
    id: 'travel',
    name: 'Travel & Hospitality',
    description: 'Travel packages and hospitality services',
    colors: {
      primary: '#007dc1',      // Okta blue
      secondary: '#0ea5e9',    // Light blue
      accent: '#059669',       // Emerald green
      accentLight: '#10b981',  // Light green
    },
    logo: '/images/logo.png',
    emoji: '✈️',
    companyName: 'Wanderlust Travel Co',
    industry: 'Travel & Tourism',
    tagline: 'AI-Powered Travel Planning & Booking',
  },
};

export function getTheme(themeId: ThemeType): ThemeConfig {
  return themes[themeId];
}

export function getDefaultTheme(): ThemeConfig {
  return themes.chocolate;
}
