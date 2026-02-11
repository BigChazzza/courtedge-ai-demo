'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { themes, ThemeType } from '@/lib/themes';

export default function ThemeSelector() {
  const { currentTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeChange = (themeId: ThemeType) => {
    setTheme(themeId);
    setIsOpen(false);
    // Reload page to apply theme changes
    window.location.reload();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition border border-white/20 hover:border-white/40"
      >
        <span className="text-xl">{currentTheme.emoji}</span>
        <span className="hidden sm:inline text-sm font-medium">{currentTheme.name}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border-2 border-gray-200 overflow-hidden z-50">
          <div className="bg-gradient-to-r from-okta-blue to-okta-blue-light px-4 py-3">
            <h3 className="text-white font-semibold text-sm">Demo Theme Selector</h3>
            <p className="text-white/80 text-xs mt-1">Choose your business scenario</p>
          </div>

          <div className="p-2">
            {Object.values(themes).map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all mb-1 ${
                  currentTheme.id === theme.id
                    ? 'bg-okta-blue text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{theme.emoji}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{theme.name}</div>
                    <div className={`text-xs mt-1 ${
                      currentTheme.id === theme.id ? 'text-white/80' : 'text-gray-500'
                    }`}>
                      {theme.description}
                    </div>
                    <div className={`text-xs mt-1 font-medium ${
                      currentTheme.id === theme.id ? 'text-white/90' : 'text-gray-600'
                    }`}>
                      {theme.companyName}
                    </div>
                  </div>
                  {currentTheme.id === theme.id && (
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              Theme changes will reload the page with new data
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
