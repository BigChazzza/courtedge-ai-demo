// Theme configurations for demo platform
export type ThemeType = 'chocolate' | 'tech' | 'travel';

export interface ExampleQuestion {
  text: string;
  icon: string;
}

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
  groupPrefix: string; // For Okta group names
  exampleQuestions: ExampleQuestion[];
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
    groupPrefix: 'Sugar & Gold Treats',
    exampleQuestions: [
      { text: "Can we fulfill 2000 chocolate bars for Sweet Delights Retail?", icon: "🍫" },
      { text: "What dark chocolate bars do we have in stock?", icon: "🍫" },
      { text: "Look up Chocolate Dreams Boutique's account", icon: "👥" },
      { text: "What's our margin on artisanal truffles?", icon: "💰" },
      { text: "Show me recent bulk chocolate orders", icon: "📦" },
      { text: "Which customers have Platinum tier?", icon: "⭐" },
    ],
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
    groupPrefix: 'TechPro',
    exampleQuestions: [
      { text: "Can we fulfill 50 Enterprise Laptops for Global Finance Corp?", icon: "💻" },
      { text: "What network equipment do we have in stock?", icon: "🖧" },
      { text: "Look up Healthcare Systems Inc's account", icon: "👥" },
      { text: "What's our margin on software licenses?", icon: "💰" },
      { text: "Show me recent server orders", icon: "📦" },
      { text: "Which tech customers have Platinum tier?", icon: "⭐" },
    ],
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
    groupPrefix: 'Wanderlust',
    exampleQuestions: [
      { text: "Can we book 20 Caribbean Paradise packages for Corporate Travel?", icon: "✈️" },
      { text: "What cruise packages do we have available?", icon: "🚢" },
      { text: "Look up Executive Journeys Inc's account", icon: "👥" },
      { text: "What's our margin on luxury hotel nights?", icon: "💰" },
      { text: "Show me recent vacation package bookings", icon: "📦" },
      { text: "Which travel clients have Platinum tier?", icon: "⭐" },
    ],
  },
};

export function getTheme(themeId: ThemeType): ThemeConfig {
  return themes[themeId];
}

export function getDefaultTheme(): ThemeConfig {
  return themes.chocolate;
}
