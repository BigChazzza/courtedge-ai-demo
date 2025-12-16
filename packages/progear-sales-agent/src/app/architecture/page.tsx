'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Shield, Key, Users, Server, ArrowRight, CheckCircle, XCircle } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({ title, subtitle, icon, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl border-2 border-neutral-border overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-okta-blue to-tech-purple flex items-center justify-center text-white">
            {icon}
          </div>
          <div className="text-left">
            <div className="font-semibold text-gray-800">{title}</div>
            {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
          </div>
        </div>
        {isOpen ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
      </button>
      {isOpen && <div className="px-6 pb-6 border-t border-gray-100">{children}</div>}
    </div>
  );
}

export default function ArchitecturePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-bg to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary via-court-brown to-primary-light border-b-4 border-accent shadow-lg">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-5xl">🏀</span>
            <div>
              <h1 className="text-white text-2xl font-bold">CourtEdge ProGear</h1>
              <p className="text-gray-300 text-sm">Architecture & Security Overview</p>
            </div>
          </div>
          <Link
            href="/"
            className="px-5 py-2.5 bg-accent hover:bg-court-orange text-white rounded-lg transition font-semibold"
          >
            Back to Chat
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto py-8 px-6 space-y-6">
        {/* Overview Section */}
        <div className="bg-gradient-to-r from-okta-blue to-tech-purple rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Okta AI Agent Governance</h2>
          <p className="text-lg text-white/90 mb-6">
            This demo showcases how Okta secures AI agents accessing enterprise data.
            Each agent has its own identity, credentials, and scoped access - all governed by Okta.
          </p>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">4</div>
              <div className="text-sm text-white/80">AI Agents</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">4</div>
              <div className="text-sm text-white/80">Auth Servers</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">3</div>
              <div className="text-sm text-white/80">User Roles</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">ID-JAG</div>
              <div className="text-sm text-white/80">Token Exchange</div>
            </div>
          </div>
        </div>

        {/* Why Okta AI Agents */}
        <CollapsibleSection
          title="Why Okta AI Agents?"
          subtitle="Enterprise security for agentic AI"
          icon={<Shield className="w-5 h-5" />}
          defaultOpen={true}
        >
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            {[
              {
                title: "Identity-First Security",
                desc: "Each AI agent is a registered identity in Okta, not just an app. Full visibility and control.",
                color: "#3b82f6"
              },
              {
                title: "Scoped Access",
                desc: "Agents only get the specific scopes they need. No over-privileged service accounts.",
                color: "#10b981"
              },
              {
                title: "User Consent",
                desc: "Agents act on behalf of users, inheriting their permissions. User must authenticate first.",
                color: "#8b5cf6"
              },
              {
                title: "Audit Trail",
                desc: "Every token exchange is logged. Know exactly who accessed what, when, through which agent.",
                color: "#f59e0b"
              },
              {
                title: "Centralized Governance",
                desc: "Manage all AI agents from Okta Admin Console. Revoke access instantly.",
                color: "#ef4444"
              },
              {
                title: "Short-Lived Tokens",
                desc: "MCP tokens expire in minutes, not days. Minimal exposure window if compromised.",
                color: "#06b6d4"
              },
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-lg border-2 border-gray-100 hover:border-gray-200 transition">
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    <CheckCircle className="w-4 h-4" style={{ color: item.color }} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{item.title}</div>
                    <div className="text-sm text-gray-600 mt-1">{item.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Token Flow */}
        <CollapsibleSection
          title="ID-JAG Token Exchange Flow"
          subtitle="How users authorize AI agents"
          icon={<Key className="w-5 h-5" />}
          defaultOpen={true}
        >
          <div className="mt-4">
            {/* Flow Diagram */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between gap-4 overflow-x-auto">
                {[
                  { step: 1, label: "User Login", desc: "Okta OIDC", color: "#3b82f6" },
                  { step: 2, label: "ID Token", desc: "User Identity", color: "#10b981" },
                  { step: 3, label: "ID-JAG Exchange", desc: "Agent + User", color: "#8b5cf6" },
                  { step: 4, label: "MCP Token", desc: "Scoped Access", color: "#f59e0b" },
                  { step: 5, label: "API Access", desc: "Authorized", color: "#22c55e" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className="flex flex-col items-center min-w-[100px]">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mb-2"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.step}
                      </div>
                      <div className="font-semibold text-gray-800 text-sm">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.desc}</div>
                    </div>
                    {idx < 4 && <ArrowRight className="w-6 h-6 text-gray-300 mx-2" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Steps */}
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <div className="font-semibold text-blue-800">Step 1-2: User Authentication</div>
                <div className="text-sm text-blue-700 mt-1">
                  User logs in via Okta OIDC. Frontend receives ID token proving user identity.
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <div className="font-semibold text-purple-800">Step 3: ID-JAG Token Exchange</div>
                <div className="text-sm text-purple-700 mt-1">
                  AI Agent presents: user ID token + agent JWT assertion (signed with private key).
                  Okta validates both and issues ID-JAG token combining user + agent identity.
                </div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <div className="font-semibold text-orange-800">Step 4: MCP Token Issuance</div>
                <div className="text-sm text-orange-700 mt-1">
                  ID-JAG is exchanged for authorization server token with specific scopes.
                  Access policies determine what scopes are granted based on user groups.
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <div className="font-semibold text-green-800">Step 5: Authorized API Access</div>
                <div className="text-sm text-green-700 mt-1">
                  Agent uses MCP token to call APIs. Token contains: user sub, agent sub, granted scopes.
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Multi-Agent Architecture */}
        <CollapsibleSection
          title="Multi-Agent Architecture"
          subtitle="4 specialized agents with scoped access"
          icon={<Server className="w-5 h-5" />}
          defaultOpen={true}
        >
          <div className="mt-4 space-y-4">
            {[
              {
                name: "Sales Agent",
                color: "#3b82f6",
                scopes: ["sales:read", "sales:quote", "sales:order"],
                desc: "Handles orders, quotes, and sales pipeline",
                access: "ProGear-Sales group"
              },
              {
                name: "Inventory Agent",
                color: "#10b981",
                scopes: ["inventory:read", "inventory:write", "inventory:alert"],
                desc: "Manages stock levels, products, and warehouse",
                access: "ProGear-Sales (read) or ProGear-Warehouse (full)"
              },
              {
                name: "Customer Agent",
                color: "#8b5cf6",
                scopes: ["customer:read", "customer:lookup", "customer:history"],
                desc: "Accesses accounts, contacts, and purchase history",
                access: "ProGear-Sales group only"
              },
              {
                name: "Pricing Agent",
                color: "#f59e0b",
                scopes: ["pricing:read", "pricing:margin", "pricing:discount"],
                desc: "Handles pricing, margins, and discounts",
                access: "ProGear-Sales (read) or ProGear-Finance (full)"
              },
            ].map((agent, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border-2 border-gray-100 hover:shadow-md transition"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl"
                    style={{ backgroundColor: agent.color }}
                  >
                    {agent.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-gray-800">{agent.name}</div>
                      <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {agent.access}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{agent.desc}</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {agent.scopes.map((scope, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 text-xs rounded-full font-mono"
                          style={{
                            backgroundColor: `${agent.color}20`,
                            color: agent.color
                          }}
                        >
                          {scope}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* User Access Matrix */}
        <CollapsibleSection
          title="Role-Based Access Control"
          subtitle="Who can access what"
          icon={<Users className="w-5 h-5" />}
          defaultOpen={true}
        >
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4">User</th>
                  <th className="text-left py-3 px-4">Group</th>
                  <th className="text-center py-3 px-4">Sales</th>
                  <th className="text-center py-3 px-4">Inventory</th>
                  <th className="text-center py-3 px-4">Customer</th>
                  <th className="text-center py-3 px-4">Pricing</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">Sarah Sales</td>
                  <td className="py-3 px-4 text-gray-500">ProGear-Sales</td>
                  <td className="py-3 px-4 text-center"><CheckCircle className="w-5 h-5 text-success-green inline" /></td>
                  <td className="py-3 px-4 text-center"><CheckCircle className="w-5 h-5 text-success-green inline" /></td>
                  <td className="py-3 px-4 text-center"><CheckCircle className="w-5 h-5 text-success-green inline" /></td>
                  <td className="py-3 px-4 text-center"><CheckCircle className="w-5 h-5 text-success-green inline" /></td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">Mike Manager</td>
                  <td className="py-3 px-4 text-gray-500">ProGear-Warehouse</td>
                  <td className="py-3 px-4 text-center"><XCircle className="w-5 h-5 text-error-red inline" /></td>
                  <td className="py-3 px-4 text-center"><CheckCircle className="w-5 h-5 text-success-green inline" /></td>
                  <td className="py-3 px-4 text-center"><XCircle className="w-5 h-5 text-error-red inline" /></td>
                  <td className="py-3 px-4 text-center"><XCircle className="w-5 h-5 text-error-red inline" /></td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">Frank Finance</td>
                  <td className="py-3 px-4 text-gray-500">ProGear-Finance</td>
                  <td className="py-3 px-4 text-center"><XCircle className="w-5 h-5 text-error-red inline" /></td>
                  <td className="py-3 px-4 text-center"><XCircle className="w-5 h-5 text-error-red inline" /></td>
                  <td className="py-3 px-4 text-center"><XCircle className="w-5 h-5 text-error-red inline" /></td>
                  <td className="py-3 px-4 text-center"><CheckCircle className="w-5 h-5 text-success-green inline" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CollapsibleSection>

        {/* Demo Scenarios */}
        <div className="bg-gradient-to-r from-accent to-court-orange rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Demo Scenarios</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/20 rounded-lg p-4">
              <div className="font-semibold mb-2">Scenario 1: Full Access</div>
              <div className="text-sm text-white/80">
                Sarah (Sales) asks: "Can we fulfill 1500 baseballs for State University?"
              </div>
              <div className="text-sm mt-2 text-white/60">
                All 4 agents respond with customer info, inventory, pricing, and quote.
              </div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="font-semibold mb-2">Scenario 2: Limited Access</div>
              <div className="text-sm text-white/80">
                Mike (Warehouse) asks the same question.
              </div>
              <div className="text-sm mt-2 text-white/60">
                Only Inventory responds. Customer, Sales, Pricing show ACCESS DENIED.
              </div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="font-semibold mb-2">Scenario 3: Finance Only</div>
              <div className="text-sm text-white/80">
                Frank (Finance) asks: "What's our margin on pro basketballs?"
              </div>
              <div className="text-sm mt-2 text-white/60">
                Only Pricing Agent responds. No access to other agents.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm py-4">
          ProGear AI Agent Demo - Okta AI Agent Governance
        </div>
      </div>
    </main>
  );
}
