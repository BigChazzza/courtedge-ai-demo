'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Image from 'next/image';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeSelector from '@/components/ThemeSelector';

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/';
  const error = searchParams?.get('error');
  const { currentTheme } = useTheme();

  const handleSignIn = () => {
    signIn('okta', { callbackUrl });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Theme-Specific Background */}
      {currentTheme.background.type === 'image' ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${currentTheme.background.value})` }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: currentTheme.background.value }}
        />
      )}

      {/* Theme-Specific Overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: currentTheme.background.overlay }}
      ></div>

      {/* Theme Selector - Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeSelector />
      </div>

      <div className="relative z-10 bg-gradient-to-br from-white/95 to-white/90 p-10 rounded-2xl shadow-2xl max-w-md w-full border-2 border-okta-blue/30 backdrop-blur-sm">
        {/* Company Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4 relative">
            <div className="absolute inset-0 bg-okta-blue/20 blur-xl animate-pulse"></div>
            {currentTheme.id === 'chocolate' ? (
              <Image
                src="/images/logo.png"
                alt={currentTheme.companyName}
                width={120}
                height={120}
                className="relative z-10"
              />
            ) : (
              <span className="text-7xl relative z-10">{currentTheme.emoji}</span>
            )}
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-okta-blue to-okta-blue-light bg-clip-text text-transparent mb-2">
            {currentTheme.companyName}
          </h1>
          <p className="text-gray-600 font-display text-lg">
            {currentTheme.tagline}
          </p>
        </div>

        {/* Security Badge - chocolate styled */}
        <div className="mb-6 p-4 bg-gradient-to-r from-okta-blue/10 via-primary/5 to-candy-gold/10 border border-okta-blue/30 rounded-xl">
          <div className="flex items-center justify-center space-x-3">
            <svg className="w-6 h-6 text-okta-blue" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-700 font-bold">Enterprise Secured</span>
            <div className="w-2 h-2 bg-success-green rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-hoop-red/10 border-l-4 border-hoop-red rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-hoop-red mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-hoop-red font-medium">
                {error === 'OAuthCallback'
                  ? 'Authentication failed. Please try again.'
                  : 'An error occurred. Please try again.'}
              </p>
            </div>
          </div>
        )}

        {/* Sign In Button */}
        <button
          onClick={handleSignIn}
          className="w-full bg-gradient-to-r from-okta-blue to-okta-blue-light hover:from-okta-blue-light hover:to-okta-blue text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-xl shadow-lg flex items-center justify-center space-x-3 border-b-4 border-okta-blue/50"
        >
          <Image
            src="/images/Okta_Aura Logomark_Black_RGB.png"
            alt="Okta"
            width={24}
            height={24}
            className="brightness-0 invert"
          />
          <span className="text-lg">Sign in with Okta</span>
        </button>

        {/* Features - chocolate styled */}
        <div className="mt-8 p-5 bg-gradient-to-br from-primary/5 to-chocolate-primary/10 border-2 border-candy-gold/20 rounded-xl">
          <h3 className="font-bold text-sm text-primary mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-candy-gold" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 2c-3 4-3 16 0 20M12 2c3 4 3 16 0 20" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M2 12h20" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            Security Features
          </h3>
          <ul className="text-xs text-gray-700 space-y-3">
            <li className="flex items-start">
              <div className="w-5 h-5 bg-candy-gold/20 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <svg className="w-3 h-3 text-candy-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span><strong className="text-primary">Secure Token Exchange:</strong> Identity delegation for AI assistant</span>
            </li>
            <li className="flex items-start">
              <div className="w-5 h-5 bg-candy-pink/20 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <svg className="w-3 h-3 text-candy-pink" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span><strong className="text-primary">Secure Data Access:</strong> Protected inventory & sales data</span>
            </li>
            <li className="flex items-start">
              <div className="w-5 h-5 bg-okta-blue/20 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <svg className="w-3 h-3 text-okta-blue" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span><strong className="text-primary">Verified Authentication:</strong> SSO with enterprise identity</span>
            </li>
            <li className="flex items-start">
              <div className="w-5 h-5 bg-candy-cyan/20 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <svg className="w-3 h-3 text-candy-cyan" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span><strong className="text-primary">Activity Logging:</strong> Token exchange audit trail</span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t-2 border-candy-gold/20">
          <div className="flex items-center justify-center text-xs text-gray-500">
            <span>{currentTheme.companyName} - Enterprise Sales Platform</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #4A2C2A 100%)' }}
        />
        <div className="relative z-10 flex flex-col items-center space-y-4">
          <div className="animate-bounce">
            <Image
              src="/images/logo.png"
              alt="Loading"
              width={80}
              height={80}
            />
          </div>
          <div className="text-white text-xl font-display">Loading...</div>
        </div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
