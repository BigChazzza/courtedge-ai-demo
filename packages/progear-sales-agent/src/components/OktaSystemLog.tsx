'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle, XCircle, Clock, User, Bot } from 'lucide-react';

interface LogEntry {
  id: string;
  published: string;
  eventType: string;
  displayMessage: string;
  outcome: 'SUCCESS' | 'FAILURE';
  reason?: string;
  severity: 'INFO' | 'WARN' | 'ERROR';
  actor: {
    id: string;
    type: string;
    displayName: string;
    alternateId?: string;
  };
  target: {
    type: string;
    displayName: string;
    alternateId?: string;
    id?: string;
  }[];
  debugContext: {
    authorizationServerName: string;
    requestedScopes: string;
    grantedScopes?: string;
    grantType: string;
  };
}

// Static log data matching real Okta system logs
const STATIC_LOGS: LogEntry[] = [
  {
    id: 'tevt8xdf1234567890abc',
    published: '2025-12-18T17:29:13.031Z',
    eventType: 'app.oauth2.as.token.grant.access_token',
    displayMessage: 'An access token was granted for authorization server ProGear Inventory MCP',
    outcome: 'SUCCESS',
    severity: 'INFO',
    actor: {
      id: 'wlp8x5q7mvH86KvFJ0g7',
      type: 'WorkloadIdentityPrincipal',
      displayName: 'ProGear Sales Agent',
      alternateId: 'progear-sales-agent@aiagents.okta.com'
    },
    target: [
      {
        type: 'User',
        displayName: 'Sarah Sales',
        alternateId: 'sarah.sales@progear.demo',
        id: '00u8xdeptoh4cK9pG0g7'
      },
      {
        type: 'AuthorizationServer',
        displayName: 'ProGear Inventory MCP',
        id: 'aus8xdg1oaSVfDgxa0g7'
      }
    ],
    debugContext: {
      authorizationServerName: 'ProGear Inventory MCP',
      requestedScopes: 'inventory:read',
      grantedScopes: 'inventory:read',
      grantType: 'urn:ietf:params:oauth:grant-type:jwt-bearer'
    }
  },
  {
    id: 'tevt8xdf0987654321xyz',
    published: '2025-12-18T17:25:30.227Z',
    eventType: 'app.oauth2.as.token.grant',
    displayMessage: 'Authorization server token exchange failed: Policy evaluation failed',
    outcome: 'FAILURE',
    reason: 'no_matching_policy',
    severity: 'WARN',
    actor: {
      id: 'wlp8x5q7mvH86KvFJ0g7',
      type: 'WorkloadIdentityPrincipal',
      displayName: 'ProGear Sales Agent',
      alternateId: 'progear-sales-agent@aiagents.okta.com'
    },
    target: [
      {
        type: 'User',
        displayName: 'Sarah Sales',
        alternateId: 'sarah.sales@progear.demo',
        id: '00u8xdeptoh4cK9pG0g7'
      },
      {
        type: 'AuthorizationServer',
        displayName: 'ProGear Inventory MCP',
        id: 'aus8xdg1oaSVfDgxa0g7'
      }
    ],
    debugContext: {
      authorizationServerName: 'ProGear Inventory MCP',
      requestedScopes: 'inventory:write',
      grantType: 'urn:ietf:params:oauth:grant-type:jwt-bearer'
    }
  }
];

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function LogRow({ log, isExpanded, onToggle }: { log: LogEntry; isExpanded: boolean; onToggle: () => void }) {
  const isSuccess = log.outcome === 'SUCCESS';
  const userTarget = log.target.find(t => t.type === 'User');

  return (
    <div className={`border-b border-gray-200 ${isExpanded ? 'bg-gray-50' : 'hover:bg-gray-50'}`}>
      {/* Main Row - Okta Admin Console Style */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer"
        onClick={onToggle}
      >
        {/* Expand Icon */}
        <div className="text-gray-400">
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </div>

        {/* Status Icon */}
        <div className={`flex-shrink-0 ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
          {isSuccess ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
        </div>

        {/* Timestamp */}
        <div className="flex-shrink-0 w-32 text-xs text-gray-500">
          <div>{formatDate(log.published)}</div>
          <div>{formatTime(log.published)}</div>
        </div>

        {/* Event Info */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">
            {log.displayMessage}
          </div>
          <div className="text-xs text-gray-500 font-mono">
            {log.eventType}
          </div>
        </div>

        {/* Actor (Agent) */}
        <div className="flex-shrink-0 w-44">
          <div className="flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-xs font-medium text-gray-700 truncate">{log.actor.displayName}</span>
          </div>
          <div className="text-[10px] text-gray-400 truncate pl-5">{log.actor.type}</div>
        </div>

        {/* Target (User) */}
        {userTarget && (
          <div className="flex-shrink-0 w-36">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-purple-500" />
              <span className="text-xs font-medium text-gray-700 truncate">{userTarget.displayName}</span>
            </div>
            <div className="text-[10px] text-gray-400 truncate pl-5">{userTarget.alternateId}</div>
          </div>
        )}

        {/* Outcome Badge */}
        <div className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${
          isSuccess
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        }`}>
          {log.outcome}
        </div>
      </div>

      {/* Expanded Details - Like Okta Admin Console */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 ml-8 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 text-xs">
            {/* Left Column */}
            <div className="space-y-3">
              <div>
                <div className="text-gray-500 uppercase text-[10px] font-semibold mb-1">Actor</div>
                <div className="bg-white rounded border border-gray-200 p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Bot className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-gray-900">{log.actor.displayName}</span>
                  </div>
                  <div className="text-gray-500 pl-6">
                    <div>Type: <span className="text-gray-700">{log.actor.type}</span></div>
                    <div>ID: <span className="font-mono text-gray-600">{log.actor.id}</span></div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-gray-500 uppercase text-[10px] font-semibold mb-1">Target(s)</div>
                <div className="space-y-2">
                  {log.target.map((t, idx) => (
                    <div key={idx} className="bg-white rounded border border-gray-200 p-2">
                      <div className="flex items-center gap-2 mb-1">
                        {t.type === 'User' ? (
                          <User className="w-4 h-4 text-purple-500" />
                        ) : (
                          <div className="w-4 h-4 rounded bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-500">AS</div>
                        )}
                        <span className="font-medium text-gray-900">{t.displayName}</span>
                        <span className="text-gray-400 text-[10px]">({t.type})</span>
                      </div>
                      {t.alternateId && (
                        <div className="text-gray-500 pl-6">{t.alternateId}</div>
                      )}
                      {t.id && (
                        <div className="text-gray-400 pl-6 font-mono text-[10px]">{t.id}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-3">
              <div>
                <div className="text-gray-500 uppercase text-[10px] font-semibold mb-1">Outcome</div>
                <div className={`rounded border p-2 ${isSuccess ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center gap-2">
                    {isSuccess ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`font-semibold ${isSuccess ? 'text-green-700' : 'text-red-700'}`}>
                      {log.outcome}
                    </span>
                  </div>
                  {log.reason && (
                    <div className="mt-1 pl-6 text-red-600">
                      Reason: <span className="font-mono">{log.reason}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="text-gray-500 uppercase text-[10px] font-semibold mb-1">Debug Context</div>
                <div className="bg-white rounded border border-gray-200 p-2 space-y-1">
                  <div>
                    <span className="text-gray-500">Authorization Server:</span>{' '}
                    <span className="text-gray-900 font-medium">{log.debugContext.authorizationServerName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Grant Type:</span>{' '}
                    <span className="font-mono text-gray-600 text-[10px]">jwt-bearer (ID-JAG)</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Requested Scopes:</span>{' '}
                    <span className={`font-mono ${isSuccess ? 'text-gray-700' : 'text-red-600 line-through'}`}>
                      {log.debugContext.requestedScopes}
                    </span>
                  </div>
                  {log.debugContext.grantedScopes && (
                    <div>
                      <span className="text-gray-500">Granted Scopes:</span>{' '}
                      <span className="font-mono text-green-600">{log.debugContext.grantedScopes}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="text-gray-500 uppercase text-[10px] font-semibold mb-1">Event Details</div>
                <div className="bg-white rounded border border-gray-200 p-2 space-y-1">
                  <div>
                    <span className="text-gray-500">Event ID:</span>{' '}
                    <span className="font-mono text-gray-600 text-[10px]">{log.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Severity:</span>{' '}
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                      log.severity === 'INFO' ? 'bg-blue-100 text-blue-700' :
                      log.severity === 'WARN' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {log.severity}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OktaSystemLog() {
  const [expandedId, setExpandedId] = useState<string | null>(STATIC_LOGS[0].id);

  return (
    <div className="mt-4">
      {/* Okta Admin Console Style Header */}
      <div className="bg-white rounded-t-lg border border-gray-200 border-b-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="text-sm font-semibold text-gray-700">System Log</div>
            <div className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
              {STATIC_LOGS.length} events
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            <span>Last 10 minutes</span>
          </div>
        </div>

        {/* Column Headers */}
        <div className="flex items-center gap-3 px-4 py-2 text-[10px] font-semibold text-gray-500 uppercase border-b border-gray-100 bg-gray-50/50">
          <div className="w-4"></div>
          <div className="w-5"></div>
          <div className="w-32">Time</div>
          <div className="flex-1">Event</div>
          <div className="w-44">Actor (Agent)</div>
          <div className="w-36">On Behalf Of</div>
          <div className="w-20 text-center">Outcome</div>
        </div>
      </div>

      {/* Log Entries */}
      <div className="bg-white rounded-b-lg border border-gray-200 border-t-0 overflow-hidden">
        {STATIC_LOGS.map((log) => (
          <LogRow
            key={log.id}
            log={log}
            isExpanded={expandedId === log.id}
            onToggle={() => setExpandedId(expandedId === log.id ? null : log.id)}
          />
        ))}
      </div>

      {/* Value Proposition */}
      <div className="mt-4 grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
          <div className="font-semibold text-purple-800">Complete Attribution</div>
          <div className="text-sm text-purple-700 mt-1">
            Every request shows both the AI agent AND the user it acted on behalf of.
          </div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
          <div className="font-semibold text-green-800">Real-Time Visibility</div>
          <div className="text-sm text-green-700 mt-1">
            Okta logs capture every governance decision as it happens.
          </div>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <div className="font-semibold text-blue-800">Policy Enforcement</div>
          <div className="text-sm text-blue-700 mt-1">
            See exactly when and why access was granted or denied.
          </div>
        </div>
      </div>
    </div>
  );
}
