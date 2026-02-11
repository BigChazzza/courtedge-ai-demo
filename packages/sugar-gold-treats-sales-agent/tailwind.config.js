/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Chocolate Theme
        'chocolate-dark': '#4A2C2A',        // Deep chocolate brown
        'chocolate-primary': '#6B4423',     // Rich chocolate
        'chocolate-light': '#8B5A3C',       // Milk chocolate

        // Vibrant Accent Colors (from logo)
        'candy-gold': '#FFD700',            // Bright gold
        'candy-pink': '#E91E63',            // Vibrant pink
        'candy-cyan': '#00BCD4',            // Bright cyan
        'candy-lime': '#7CFF00',            // Lime green
        'candy-orange': '#FF9800',          // Orange
        'candy-purple': '#9C27B0',          // Purple accent

        // UI Support
        'primary': '#1a1a2e',               // Dark background
        'primary-light': '#16213e',         // Lighter dark
        'success-green': '#4CAF50',         // Success states
        'error-red': '#FF6B6B',             // Errors
        'neutral-bg': '#f5f0e8',            // Warm off-white
        'neutral-border': '#2a2a3e',        // Dark borders

        // Keep Okta/Auth
        'okta-blue': '#007dc1',
        'okta-blue-light': '#0ea5e9',

        // Agent colors (vibrant)
        'agent-sales': '#00BCD4',           // Cyan
        'agent-inventory': '#7CFF00',       // Lime
        'agent-customer': '#E91E63',        // Pink
        'agent-pricing': '#FFD700',         // Gold
      },
      fontFamily: {
        'display': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
};
