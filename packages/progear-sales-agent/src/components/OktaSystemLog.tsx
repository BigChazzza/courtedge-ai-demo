'use client';

// Raw JSON log display with syntax highlighting
// Shows actual Okta system log structure with color-coded key fields

export default function OktaSystemLog() {
  return (
    <div className="mt-4 space-y-4">
      {/* SUCCESS Log */}
      <div className="rounded-lg overflow-hidden border border-green-500/30">
        <div className="bg-green-500/10 px-4 py-2 border-b border-green-500/30 flex items-center justify-between">
          <span className="text-green-400 font-mono text-sm">SUCCESS - Token Grant</span>
          <span className="text-gray-500 text-xs">2025-12-18T17:29:13.031Z</span>
        </div>
        <pre className="bg-gray-900 p-4 text-xs font-mono overflow-x-auto leading-relaxed">
{`{`}
{`  `}<span className="text-gray-500">"uuid":</span>{` `}<span className="text-gray-400">"11e97654-dc37-11f0-85a8-39c9055ec998"</span>{`,`}
{`  `}<span className="text-gray-500">"published":</span>{` `}<span className="text-gray-400">"2025-12-18T17:29:13.031Z"</span>{`,`}
{`  `}<span className="text-gray-500">"eventType":</span>{` `}<span className="text-yellow-300">"app.oauth2.as.token.grant.access_token"</span>{`,`}
{`  `}<span className="text-gray-500">"displayMessage":</span>{` `}<span className="text-gray-300">"OAuth2 access token is granted"</span>{`,`}
{`  `}<span className="text-gray-500">"severity":</span>{` `}<span className="text-blue-400">"INFO"</span>{`,`}
{`  `}<span className="text-gray-500">"outcome":</span>{` {`}
{`    `}<span className="text-gray-500">"result":</span>{` `}<span className="text-green-400 font-semibold">"SUCCESS"</span>{`,`}
{`    `}<span className="text-gray-500">"reason":</span>{` `}<span className="text-gray-500">null</span>
{`  },`}
{`  `}<span className="text-gray-500">"actor":</span>{` {`}
{`    `}<span className="text-gray-500">"id":</span>{` `}<span className="text-blue-300">"wlp8x5q7mvH86KvFJ0g7"</span>{`,`}
{`    `}<span className="text-gray-500">"type":</span>{` `}<span className="text-gray-400">"PublicClientApp"</span>{`,`}
{`    `}<span className="text-gray-500">"displayName":</span>{` `}<span className="text-blue-400 font-semibold">"ProGear Sales Agent"</span>
{`  },`}
{`  `}<span className="text-gray-500">"target":</span>{` [`}
{`    {`}
{`      `}<span className="text-gray-500">"type":</span>{` `}<span className="text-gray-400">"id_jag"</span>{`,`}
{`      `}<span className="text-gray-500">"displayName":</span>{` `}<span className="text-gray-400">"Identity Assertion JWT Authorization Grant"</span>{`,`}
{`      `}<span className="text-gray-500">"detailEntry":</span>{` {`}
{`        `}<span className="text-gray-500">"subject":</span>{` `}<span className="text-purple-300">"00u8xdeptoh4cK9pG0g7"</span>{`,`}
{`        `}<span className="text-gray-500">"scope":</span>{` `}<span className="text-green-300">"inventory:read"</span>
{`      }`}
{`    },`}
{`    {`}
{`      `}<span className="text-gray-500">"id":</span>{` `}<span className="text-purple-300">"00u8xdeptoh4cK9pG0g7"</span>{`,`}
{`      `}<span className="text-gray-500">"type":</span>{` `}<span className="text-gray-400">"User"</span>{`,`}
{`      `}<span className="text-gray-500">"alternateId":</span>{` `}<span className="text-purple-400">"sarah.sales@progear.demo"</span>{`,`}
{`      `}<span className="text-gray-500">"displayName":</span>{` `}<span className="text-purple-400 font-semibold">"Sarah Sales"</span>
{`    }`}
{`  ],`}
{`  `}<span className="text-gray-500">"debugContext":</span>{` {`}
{`    `}<span className="text-gray-500">"debugData":</span>{` {`}
{`      `}<span className="text-gray-500">"authorizationServerName":</span>{` `}<span className="text-cyan-300">"ProGear Inventory MCP"</span>{`,`}
{`      `}<span className="text-gray-500">"authorizationServer":</span>{` `}<span className="text-gray-400">"aus8xdg1oaSVfDgxa0g7"</span>{`,`}
{`      `}<span className="text-gray-500">"grantType":</span>{` `}<span className="text-gray-400">"urn:ietf:params:oauth:grant-type:jwt-bearer"</span>{`,`}
{`      `}<span className="text-gray-500">"requestedScopes":</span>{` `}<span className="text-gray-300">"inventory:read"</span>{`,`}
{`      `}<span className="text-gray-500">"grantedScopes":</span>{` `}<span className="text-green-400 font-semibold">"inventory:read"</span>
{`    }`}
{`  }`}
{`}`}
        </pre>
      </div>

      {/* FAILURE Log */}
      <div className="rounded-lg overflow-hidden border border-red-500/30">
        <div className="bg-red-500/10 px-4 py-2 border-b border-red-500/30 flex items-center justify-between">
          <span className="text-red-400 font-mono text-sm">FAILURE - Policy Denied</span>
          <span className="text-gray-500 text-xs">2025-12-18T17:25:30.227Z</span>
        </div>
        <pre className="bg-gray-900 p-4 text-xs font-mono overflow-x-auto leading-relaxed">
{`{`}
{`  `}<span className="text-gray-500">"uuid":</span>{` `}<span className="text-gray-400">"8d1c445a-dc36-11f0-85a8-39c9055ec998"</span>{`,`}
{`  `}<span className="text-gray-500">"published":</span>{` `}<span className="text-gray-400">"2025-12-18T17:25:30.227Z"</span>{`,`}
{`  `}<span className="text-gray-500">"eventType":</span>{` `}<span className="text-yellow-300">"app.oauth2.as.token.grant"</span>{`,`}
{`  `}<span className="text-gray-500">"displayMessage":</span>{` `}<span className="text-gray-300">"OAuth2 token request"</span>{`,`}
{`  `}<span className="text-gray-500">"severity":</span>{` `}<span className="text-yellow-400">"WARN"</span>{`,`}
{`  `}<span className="text-gray-500">"outcome":</span>{` {`}
{`    `}<span className="text-gray-500">"result":</span>{` `}<span className="text-red-400 font-semibold">"FAILURE"</span>{`,`}
{`    `}<span className="text-gray-500">"reason":</span>{` `}<span className="text-red-400 font-semibold">"no_matching_policy"</span>
{`  },`}
{`  `}<span className="text-gray-500">"actor":</span>{` {`}
{`    `}<span className="text-gray-500">"id":</span>{` `}<span className="text-blue-300">"wlp8x5q7mvH86KvFJ0g7"</span>{`,`}
{`    `}<span className="text-gray-500">"type":</span>{` `}<span className="text-gray-400">"PublicClientApp"</span>{`,`}
{`    `}<span className="text-gray-500">"displayName":</span>{` `}<span className="text-blue-400 font-semibold">"ProGear Sales Agent"</span>
{`  },`}
{`  `}<span className="text-gray-500">"target":</span>{` [`}
{`    {`}
{`      `}<span className="text-gray-500">"type":</span>{` `}<span className="text-gray-400">"id_jag"</span>{`,`}
{`      `}<span className="text-gray-500">"displayName":</span>{` `}<span className="text-gray-400">"Identity Assertion JWT Authorization Grant"</span>{`,`}
{`      `}<span className="text-gray-500">"detailEntry":</span>{` {`}
{`        `}<span className="text-gray-500">"subject":</span>{` `}<span className="text-purple-300">"00u8xdeptoh4cK9pG0g7"</span>{`,  `}<span className="text-gray-600">// Sarah Sales</span>
{`        `}<span className="text-gray-500">"scope":</span>{` `}<span className="text-red-400 line-through">"inventory:write"</span>
{`      }`}
{`    }`}
{`  ],`}
{`  `}<span className="text-gray-500">"debugContext":</span>{` {`}
{`    `}<span className="text-gray-500">"debugData":</span>{` {`}
{`      `}<span className="text-gray-500">"authorizationServerName":</span>{` `}<span className="text-cyan-300">"ProGear Inventory MCP"</span>{`,`}
{`      `}<span className="text-gray-500">"authorizationServer":</span>{` `}<span className="text-gray-400">"aus8xdg1oaSVfDgxa0g7"</span>{`,`}
{`      `}<span className="text-gray-500">"grantType":</span>{` `}<span className="text-gray-400">"urn:ietf:params:oauth:grant-type:jwt-bearer"</span>{`,`}
{`      `}<span className="text-gray-500">"requestedScopes":</span>{` `}<span className="text-red-400 line-through">"inventory:write"</span>{`,`}
{`      `}<span className="text-gray-500">"grantedScopes":</span>{` `}<span className="text-gray-500">""</span>
{`    }`}
{`  }`}
{`}`}
        </pre>
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
