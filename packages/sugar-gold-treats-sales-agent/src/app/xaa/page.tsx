'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Play, User, Shield, Server, Key, Zap, Clock, AlertTriangle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface TokenExchangeLog {
  timestamp: number;
  step: string;
  type: 'oidc' | 'id-jag' | 'access' | 'api-call' | 'policy';
  from: string;
  to: string;
  token?: string;
  status: 'success' | 'processing' | 'pending' | 'denied';
  details: string;
  scopesRequested?: string[];
  scopesGranted?: string[];
  policyResult?: {
    allowed: boolean;
    reason: string;
    userGroups: string[];
    requiredGroups: string[];
  };
}

export default function XAAPage() {
  const { data: session } = useSession();
  const { currentTheme } = useTheme();
  const [logs, setLogs] = useState<TokenExchangeLog[]>([]);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Extract user info
  const userName = session?.user?.name || 'Sarah Sales';
  const userEmail = session?.user?.email || `sarah.sales@${currentTheme.companyName.toLowerCase().replace(/\s+/g, '-')}.demo`;
  const userGroups: string[] = (session?.user as any)?.groups || [];

  // Load last user message for context
  const [lastUserMessage, setLastUserMessage] = useState<string>('');
  useEffect(() => {
    const savedMessage = localStorage.getItem('last-user-message');
    if (savedMessage) {
      setLastUserMessage(savedMessage);
    }
  }, []);

  // Determine required scopes based on query content
  const getRequiredScopes = (query: string): string[] => {
    const lowerQuery = query.toLowerCase();
    const scopes: string[] = [];

    if (lowerQuery.includes('fulfill') || lowerQuery.includes('order') || lowerQuery.includes('stock')) {
      scopes.push('inventory:read', 'sales:read');
    }
    if (lowerQuery.includes('customer') || lowerQuery.includes('account') || lowerQuery.includes('client')) {
      scopes.push('customer:read');
    }
    if (lowerQuery.includes('price') || lowerQuery.includes('margin') || lowerQuery.includes('cost')) {
      scopes.push('pricing:read');
    }

    return scopes.length > 0 ? scopes : ['inventory:read', 'sales:read']; // Default scopes
  };

  // Check if user has required groups for the scopes
  const evaluatePolicy = (requestedScopes: string[]): { allowed: boolean; reason: string; grantedScopes: string[] } => {
    const requiredGroup = `${currentTheme.groupPrefix}-Sales`;
    const hasRequiredGroup = userGroups.includes(requiredGroup);

    if (!hasRequiredGroup) {
      return {
        allowed: false,
        reason: `Access denied: User not in required group "${requiredGroup}"`,
        grantedScopes: []
      };
    }

    // Sales group gets access to inventory, sales, customer, and pricing read
    const allowedScopes = requestedScopes.filter((scope: string) =>
      scope.includes('inventory') ||
      scope.includes('sales') ||
      scope.includes('customer') ||
      scope.includes('pricing:read')
    );

    return {
      allowed: allowedScopes.length > 0,
      reason: allowedScopes.length > 0
        ? `Access granted: User in "${requiredGroup}" group`
        : 'No matching scopes for user groups',
      grantedScopes: allowedScopes
    };
  };

  // Simulate token exchange flow with real policy evaluation
  const simulateTokenExchange = () => {
    setIsPlaying(true);
    setLogs([]);
    setActiveStep(0);

    // Determine what scopes are needed for the query
    const requestedScopes = getRequiredScopes(lastUserMessage);
    const policyEval = evaluatePolicy(requestedScopes);
    const requiredGroup = `${currentTheme.groupPrefix}-Sales`;

    const steps: TokenExchangeLog[] = [
      {
        timestamp: Date.now(),
        step: '1. Initiate OIDC Flow',
        type: 'oidc',
        from: 'Browser',
        to: 'Okta IdP',
        status: 'processing',
        details: `User ${userName} initiates login via Okta OIDC for query: "${lastUserMessage}"`
      },
      {
        timestamp: Date.now() + 1000,
        step: '2. Get ID Token',
        type: 'oidc',
        from: 'Okta IdP',
        to: 'Browser',
        token: `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik9rdGEifQ.eyJzdWIiOiIke userEmail}","name":"${userName}","groups":${JSON.stringify(userGroups)}}...`,
        status: 'pending',
        details: `User authenticated, ID Token issued with identity and groups: ${userGroups.length > 0 ? userGroups.join(', ') : 'none'}`
      },
      {
        timestamp: Date.now() + 2000,
        step: '3. Swap ID Token for ID-JAG',
        type: 'id-jag',
        from: `${currentTheme.companyName} Sales Agent`,
        to: 'Okta OAuth Server',
        token: 'ID-JAG: eyJhbGciOiJSUzI1NiIsImFjdCI6eyJzdWIiOiJ3bHAuLi4ifX0...',
        status: 'pending',
        details: 'Token exchange: User ID Token + Agent JWT Assertion → ID-JAG (combined identity)'
      },
      {
        timestamp: Date.now() + 3000,
        step: '4. Evaluate XAA Policy',
        type: 'policy',
        from: 'Okta XAA Policy Engine',
        to: `${currentTheme.companyName} Sales Agent`,
        status: 'pending',
        details: `Evaluating governance policy for requested scopes`,
        scopesRequested: requestedScopes,
        scopesGranted: policyEval.grantedScopes,
        policyResult: {
          allowed: policyEval.allowed,
          reason: policyEval.reason,
          userGroups: userGroups,
          requiredGroups: [requiredGroup]
        }
      },
      {
        timestamp: Date.now() + 4000,
        step: '5. Swap ID-JAG for Access Token',
        type: 'access',
        from: `${currentTheme.companyName} Sales Agent`,
        to: 'MCP OAuth Server',
        token: policyEval.allowed ? `Access Token: api://${currentTheme.groupPrefix.toLowerCase().replace(/\s+/g, '-')}-inventory` : undefined,
        status: 'pending',
        details: policyEval.allowed
          ? `ID-JAG exchanged for MCP-scoped access token with scopes: ${policyEval.grantedScopes.join(', ')}`
          : 'Token exchange DENIED by XAA policy',
        scopesGranted: policyEval.grantedScopes
      },
      {
        timestamp: Date.now() + 5000,
        step: '6. Access APIs with Token',
        type: 'api-call',
        from: `${currentTheme.companyName} Sales Agent`,
        to: 'MCP Resource Server',
        status: 'pending',
        details: policyEval.allowed
          ? 'Agent calls MCP API with access token. Token validated: signature, audience, scopes, expiry'
          : 'API call blocked - no valid access token'
      }
    ];

    // Add logs progressively with timing
    steps.forEach((log: TokenExchangeLog, index: number) => {
      setTimeout(() => {
        setLogs(prev => {
          const updated = [...prev];
          if (index > 0 && updated[index - 1]) {
            // Mark previous step status based on whether it succeeded
            const prevStep = updated[index - 1];
            if (prevStep.type === 'policy' && !policyEval.allowed) {
              updated[index - 1] = { ...prevStep, status: 'denied' };
            } else if (index >= 4 && !policyEval.allowed) {
              // Steps after policy denial should show as denied
              updated[index - 1] = { ...prevStep, status: 'denied' };
            } else {
              updated[index - 1] = { ...prevStep, status: 'success' };
            }
          }
          return [...updated, log];
        });
        setActiveStep(index + 1);

        // Mark last step
        if (index === steps.length - 1) {
          setTimeout(() => {
            setLogs(prev => {
              const updated = [...prev];
              const finalStatus = policyEval.allowed ? 'success' : 'denied';
              updated[updated.length - 1] = { ...updated[updated.length - 1], status: finalStatus };
              return updated;
            });
            setIsPlaying(false);
          }, 1000);
        }
      }, index * 1500);
    });
  };

  const getStepColor = (type: string, status?: string) => {
    // Denied status overrides with red
    if (status === 'denied') {
      return { bg: 'bg-red-500', text: 'text-red-700', border: 'border-red-300' };
    }

    switch (type) {
      case 'oidc': return { bg: 'bg-blue-500', text: 'text-blue-700', border: 'border-blue-200' };
      case 'id-jag': return { bg: 'bg-purple-500', text: 'text-purple-700', border: 'border-purple-200' };
      case 'policy': return { bg: 'bg-yellow-500', text: 'text-yellow-700', border: 'border-yellow-200' };
      case 'access': return { bg: 'bg-green-500', text: 'text-green-700', border: 'border-green-200' };
      case 'api-call': return { bg: 'bg-orange-500', text: 'text-orange-700', border: 'border-orange-200' };
      default: return { bg: 'bg-gray-500', text: 'text-gray-700', border: 'border-gray-200' };
    }
  };

  return (
    <main
      className="min-h-screen relative overflow-hidden"
      style={{
        background: currentTheme.background.type === 'gradient'
          ? currentTheme.background.value
          : undefined
      }}
    >
      {currentTheme.background.type === 'video' && (
        <>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={currentTheme.background.value} type="video/mp4" />
          </video>
          <div
            className="absolute inset-0"
            style={{ backgroundColor: currentTheme.background.overlay }}
          />
        </>
      )}
      {currentTheme.background.type === 'image' && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${currentTheme.background.value})` }}
          />
          <div
            className="absolute inset-0"
            style={{ backgroundColor: currentTheme.background.overlay }}
          />
        </>
      )}
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
          <div className="px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className="text-5xl">⚡</span>
              <div>
                <h1 className="text-white text-2xl font-bold">XAA Token Exchange Flow</h1>
                <p className="text-gray-400 text-sm">Live OAuth + ID-JAG Visualization</p>
              </div>
            </div>
            <Link
              href="/"
              className="px-5 py-2.5 text-white rounded-lg transition font-semibold shadow-lg hover:opacity-90 flex items-center gap-2"
              style={{
                background: `linear-gradient(to right, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Chat
            </Link>
          </div>
        </header>

        <div className="max-w-7xl mx-auto py-8 px-6 space-y-6">
          {/* Context Banner */}
          {lastUserMessage && (
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5" style={{ color: currentTheme.colors.primary }} />
                <div className="flex-1">
                  <div className="text-sm text-gray-500">Current User Query</div>
                  <div className="font-semibold text-gray-800">"{lastUserMessage}"</div>
                </div>
                <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  Logged in as: {userName}
                </div>
              </div>
            </div>
          )}

          {/* Governance Policy Display */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6" style={{ color: currentTheme.colors.primary }} />
              <h2 className="text-xl font-bold text-gray-800">XAA Governance Policy</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Policy Rules */}
              <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                <div className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Access Policy Rules
                </div>
                <div className="space-y-2 text-sm">
                  <div className="bg-white rounded p-2 border border-blue-200">
                    <div className="font-mono text-xs text-blue-700 mb-1">
                      Group: <strong>{currentTheme.groupPrefix}-Sales</strong>
                    </div>
                    <div className="text-xs text-gray-600">
                      Scopes: <code className="bg-green-100 text-green-700 px-1 rounded">inventory:read</code>{' '}
                      <code className="bg-green-100 text-green-700 px-1 rounded">sales:read</code>{' '}
                      <code className="bg-green-100 text-green-700 px-1 rounded">customer:read</code>{' '}
                      <code className="bg-green-100 text-green-700 px-1 rounded">pricing:read</code>
                    </div>
                  </div>
                  <div className="bg-white rounded p-2 border border-blue-200">
                    <div className="font-mono text-xs text-blue-700 mb-1">
                      Group: <strong>{currentTheme.groupPrefix}-Warehouse</strong>
                    </div>
                    <div className="text-xs text-gray-600">
                      Scopes: <code className="bg-green-100 text-green-700 px-1 rounded">inventory:read</code>{' '}
                      <code className="bg-green-100 text-green-700 px-1 rounded">inventory:write</code>
                    </div>
                  </div>
                  <div className="bg-white rounded p-2 border border-blue-200">
                    <div className="font-mono text-xs text-blue-700 mb-1">
                      Group: <strong>{currentTheme.groupPrefix}-Finance</strong>
                    </div>
                    <div className="text-xs text-gray-600">
                      Scopes: <code className="bg-green-100 text-green-700 px-1 rounded">pricing:read</code>{' '}
                      <code className="bg-green-100 text-green-700 px-1 rounded">pricing:write</code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current User Status */}
              <div className={`border-2 rounded-lg p-4 ${
                userGroups.includes(`${currentTheme.groupPrefix}-Sales`)
                  ? 'border-green-200 bg-green-50'
                  : 'border-red-200 bg-red-50'
              }`}>
                <div className={`font-semibold mb-3 flex items-center gap-2 ${
                  userGroups.includes(`${currentTheme.groupPrefix}-Sales`) ? 'text-green-900' : 'text-red-900'
                }`}>
                  {userGroups.includes(`${currentTheme.groupPrefix}-Sales`) ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                  Your Access Status
                </div>
                <div className="space-y-3 text-sm">
                  <div className="bg-white rounded p-3 border-2 border-gray-200">
                    <div className="text-xs text-gray-500 mb-2">Your Groups:</div>
                    {userGroups.length > 0 ? (
                      <div className="space-y-1">
                        {userGroups.map((group: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span className="font-mono text-xs text-gray-700">{group}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-red-600 italic">No groups assigned</div>
                    )}
                  </div>

                  {userGroups.includes(`${currentTheme.groupPrefix}-Sales`) ? (
                    <div className="bg-green-100 rounded p-3 border-2 border-green-300">
                      <div className="text-xs text-green-800 font-semibold mb-1">✓ Access Granted</div>
                      <div className="text-xs text-green-700">
                        You have the required Sales group membership for this query
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-100 rounded p-3 border-2 border-red-300">
                      <div className="text-xs text-red-800 font-semibold mb-1 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        Access Denied
                      </div>
                      <div className="text-xs text-red-700">
                        You need <strong>{currentTheme.groupPrefix}-Sales</strong> group membership
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Token Exchange Simulator</h2>
                <p className="text-sm text-gray-600 mt-1">Watch the OAuth 2.0 + ID-JAG flow in action</p>
              </div>
              <button
                onClick={simulateTokenExchange}
                disabled={isPlaying}
                className="px-6 py-3 rounded-lg font-semibold text-white transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                style={{
                  background: isPlaying
                    ? '#9ca3af'
                    : `linear-gradient(to right, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
                }}
              >
                <Play className="w-5 h-5" />
                {isPlaying ? 'Running...' : 'Start Flow'}
              </button>
            </div>
          </div>

          {/* Flow Diagram */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5" style={{ color: currentTheme.colors.primary }} />
              OAuth 2.0 + Cross-App Access (XAA) Flow
            </h3>

            {/* Visual Flow */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
              {/* Column 1: Resource Owner */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow-lg">
                  <User className="w-8 h-8 mb-2" />
                  <div className="font-bold">Resource Owner</div>
                  <div className="text-sm opacity-80">(Browser)</div>
                  <div className="text-xs mt-2 bg-white/20 rounded px-2 py-1">{userName}</div>
                </div>
              </div>

              {/* Column 2: OAuth Client */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-4 rounded-xl shadow-lg">
                  <Server className="w-8 h-8 mb-2" />
                  <div className="font-bold">OAuth Client</div>
                  <div className="text-sm opacity-80">(Requesting App)</div>
                  <div className="text-xs mt-2 bg-white/20 rounded px-2 py-1 truncate">
                    {currentTheme.companyName} Sales Agent
                  </div>
                </div>
              </div>

              {/* Column 3: Identity Provider */}
              <div className="space-y-4">
                <div
                  className="text-white p-4 rounded-xl shadow-lg"
                  style={{
                    background: `linear-gradient(to bottom right, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
                  }}
                >
                  <Shield className="w-8 h-8 mb-2" />
                  <div className="font-bold">Authentication</div>
                  <div className="text-sm opacity-80">(Identity Provider)</div>
                  <div className="space-y-1 mt-2">
                    <div className="text-xs bg-white/20 rounded px-2 py-1">IdP OAuth Server</div>
                    <div className="text-xs bg-white/30 rounded px-2 py-1">XAA Policy</div>
                  </div>
                </div>
              </div>

              {/* Column 4: Resource Server */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-orange-500 to-amber-600 text-white p-4 rounded-xl shadow-lg">
                  <Key className="w-8 h-8 mb-2" />
                  <div className="font-bold">Resource App</div>
                  <div className="text-sm opacity-80">(MCP Server)</div>
                  <div className="space-y-1 mt-2">
                    <div className="text-xs bg-white/20 rounded px-2 py-1">OAuth Server</div>
                    <div className="text-xs bg-white/30 rounded px-2 py-1">OAuth Policy</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Flow Steps Visual */}
            <div className="relative">
              {/* Connection Line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 -translate-y-1/2"></div>

              <div className="relative flex justify-between items-center">
                {['OIDC Flow', 'ID Token', 'ID-JAG', 'Policy Check', 'Access Token', 'API Call'].map((label: string, idx: number) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 ${
                        activeStep > idx ? 'scale-110 shadow-lg' : 'opacity-50'
                      }`}
                      style={{
                        backgroundColor: activeStep > idx ? currentTheme.colors.primary : '#9ca3af'
                      }}
                    >
                      {activeStep > idx ? <CheckCircle className="w-6 h-6" /> : idx + 1}
                    </div>
                    <div className="text-xs font-semibold text-gray-700 mt-2 text-center max-w-[80px]">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live Logs */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg overflow-hidden">
            <div className="bg-gray-900 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <Clock className="w-5 h-5" />
                <span className="font-bold">Live Token Exchange Logs</span>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm text-gray-400">Recording</span>
              </div>
            </div>

            <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Play className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Click "Start Flow" to begin token exchange simulation</p>
                </div>
              ) : (
                logs.map((log: TokenExchangeLog, idx: number) => {
                  const colors = getStepColor(log.type, log.status);
                  const isDenied = log.status === 'denied';
                  return (
                    <div
                      key={idx}
                      className={`border-l-4 ${colors.border} ${isDenied ? 'bg-red-50' : 'bg-white'} rounded-lg p-4 shadow-sm transition-all duration-300 ${
                        log.status === 'processing' ? 'animate-pulse' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 ${colors.bg} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                            {idx + 1}
                          </div>
                          <div>
                            <div className="font-bold text-gray-800">{log.step}</div>
                            <div className="text-xs text-gray-500">
                              {log.from} → {log.to}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {log.status === 'success' && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                          {log.status === 'denied' && (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                          {log.status === 'processing' && (
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                          )}
                          <span className="text-xs text-gray-400">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">{log.details}</p>

                      {/* Policy Evaluation Details */}
                      {log.policyResult && (
                        <div className={`mt-3 p-3 rounded-lg border-2 ${
                          log.policyResult.allowed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className={`w-4 h-4 ${log.policyResult.allowed ? 'text-green-600' : 'text-red-600'}`} />
                            <span className={`text-sm font-bold ${log.policyResult.allowed ? 'text-green-700' : 'text-red-700'}`}>
                              {log.policyResult.allowed ? 'POLICY APPROVED' : 'POLICY DENIED'}
                            </span>
                          </div>
                          <div className="text-xs space-y-1">
                            <div className="text-gray-700">
                              <strong>Reason:</strong> {log.policyResult.reason}
                            </div>
                            <div className="text-gray-700">
                              <strong>User Groups:</strong> {log.policyResult.userGroups.length > 0 ? log.policyResult.userGroups.join(', ') : 'None'}
                            </div>
                            <div className="text-gray-700">
                              <strong>Required Groups:</strong> {log.policyResult.requiredGroups.join(', ')}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Scopes Display */}
                      {log.scopesRequested && log.scopesRequested.length > 0 && (
                        <div className="mt-3">
                          <div className="text-xs font-semibold text-gray-600 mb-1">Requested Scopes:</div>
                          <div className="flex flex-wrap gap-1">
                            {log.scopesRequested.map((scope: string, sIdx: number) => (
                              <span
                                key={sIdx}
                                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-mono border border-blue-300"
                              >
                                {scope}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {log.scopesGranted && log.scopesGranted.length > 0 && (
                        <div className="mt-2">
                          <div className="text-xs font-semibold text-gray-600 mb-1">Granted Scopes:</div>
                          <div className="flex flex-wrap gap-1">
                            {log.scopesGranted.map((scope: string, sIdx: number) => (
                              <span
                                key={sIdx}
                                className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-mono border border-green-300"
                              >
                                {scope}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {log.token && (
                        <div className="bg-gray-900 rounded p-3 mt-2">
                          <div className="text-xs text-gray-400 mb-1">Token:</div>
                          <code className="text-xs text-green-400 font-mono break-all">
                            {log.token}
                          </code>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Key Takeaway */}
          <div
            className="rounded-xl p-6 border-2 text-white"
            style={{
              background: `linear-gradient(to right, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
              borderColor: currentTheme.colors.primary
            }}
          >
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 flex-shrink-0" />
              <div>
                <div className="font-bold text-lg mb-2">Why XAA Matters</div>
                <p className="text-sm opacity-90 leading-relaxed">
                  Cross-App Access (XAA) enables secure token exchange between applications. The ID-JAG token combines
                  both user identity (from ID Token) and agent identity (from JWT assertion), allowing Okta to evaluate
                  policies based on <strong>who the user is</strong> AND <strong>who the agent is acting for</strong>.
                  This ensures fine-grained authorization where the same AI agent gets different permissions for different users.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-400 text-sm py-4">
            CourtEdge {currentTheme.companyName} - OAuth 2.0 Token Exchange + ID-JAG Flow
          </div>
        </div>
      </div>
    </main>
  );
}
