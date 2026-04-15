// Theme configurations for demo platform
export type ThemeType = 'chocolate' | 'tech' | 'travel' | 'modbot';

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
  background: {
    type: 'gradient' | 'image' | 'video';
    value: string; // Gradient CSS, image URL, or video URL
    overlay: string; // Overlay color with opacity
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
    background: {
      type: 'image',
      value: '/images/Wallpaper.png',
      overlay: 'rgba(74, 44, 42, 0.7)', // Chocolate dark overlay
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
    background: {
      type: 'image',
      value: '/images/TechWallpaper.jpg',
      overlay: 'rgba(30, 58, 138, 0.6)', // Deep blue overlay
    },
    logo: '/images/TechStore.png',
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
    background: {
      type: 'image',
      value: '/images/TravelWallpaper.jpg',
      overlay: 'rgba(5, 150, 105, 0.5)', // Emerald overlay
    },
    logo: '/images/TravelLogo.png',
    emoji: '✈️',
    companyName: 'Paradise Travels',
    industry: 'Travel & Tourism',
    tagline: 'AI-Powered Travel Planning & Booking',
    groupPrefix: 'Paradise Travels',
    exampleQuestions: [
      { text: "Can we book 20 Caribbean Paradise packages for Corporate Travel?", icon: "✈️" },
      { text: "What cruise packages do we have available?", icon: "🚢" },
      { text: "Look up Executive Journeys Inc's account", icon: "👥" },
      { text: "What's our margin on luxury hotel nights?", icon: "💰" },
      { text: "Show me recent vacation package bookings", icon: "📦" },
      { text: "Which travel clients have Platinum tier?", icon: "⭐" },
    ],
  },
  modbot: {
    id: 'modbot',
    name: 'AI Solutions',
    description: 'Enterprise AI and automation services',
    colors: {
      primary: '#007dc1',      // Okta blue
      secondary: '#0ea5e9',    // Light blue
      accent: '#6366f1',       // Indigo/Purple for AI
      accentLight: '#a855f7',  // Light purple
    },
    background: {
      type: 'video',
      value: 'https://storage.googleapis.com/ew-assets/happyrobot/happyrobot-new-hero-video-only-new-2026-02.mp4',
      overlay: 'rgba(20, 20, 40, 0.7)', // Dark blue overlay for video
    },
    logo: '/images/HappyRobotLogo.png',
    emoji: '🤖',
    companyName: 'modBOT',
    industry: 'Artificial Intelligence',
    tagline: 'AI-Powered Intelligent Automation Services',
    groupPrefix: 'modBOT',
    exampleQuestions: [
      { text: "Can we deliver 50 AI Agent licenses for Global Finance Corp?", icon: "🤖" },
      { text: "What automation services do we have available?", icon: "⚡" },
      { text: "Look up TechVentures Inc's AI implementation", icon: "👥" },
      { text: "What's our margin on enterprise ML models?", icon: "💰" },
      { text: "Show me recent AI consulting engagements", icon: "📦" },
      { text: "Which AI customers have Premium support?", icon: "⭐" },
    ],
  },
};

export function getTheme(themeId: ThemeType): ThemeConfig {
  return themes[themeId];
}

export function getDefaultTheme(): ThemeConfig {
  return themes.chocolate;
}
