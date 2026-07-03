'use client';

import { useState, useEffect } from 'react';
import { useBusiness } from '@/lib/store';
import Sidebar from '@/components/Sidebar';
import AmbientIntelligence from '@/components/AmbientIntelligence';
import {
  TrendingUp,
  IndianRupee,
  ShoppingCart,
  Users,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Crown,
  Megaphone,
  DollarSign,
  Settings,
  Users2,
  Headphones,
  BarChart3,
  Bell,
  ThumbsUp,
  ThumbsDown,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target,
} from 'lucide-react';
import SalesPanel from '@/components/SalesPanel';
import AnalyticsPanel from '@/components/AnalyticsPanel';

const TABS = [
  { id: 'overview', label: 'Overview', icon: Crown },
  { id: 'sales', label: 'Sales', icon: Target },
  { id: 'marketing', label: 'Marketing', icon: Megaphone },
  { id: 'finance', label: 'Finance', icon: DollarSign },
  { id: 'operations', label: 'Operations', icon: Settings },
  { id: 'hr', label: 'HR', icon: Users2 },
  { id: 'support', label: 'Support', icon: Headphones },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'approvals', label: 'Approvals', icon: Bell, badge: true },
];

const BRIEFING_EVENTS = [
  { icon: Megaphone, title: 'Marketing improved CTR by 7%', change: '+7%', positive: true, detail: 'Facebook ads now at 4.2% CTR, above industry avg' },
  { icon: DollarSign, title: 'Finance reduced expenses by ₹18,000', change: '₹18,000', positive: true, detail: 'Renegotiated supplier terms for Q3' },
  { icon: Settings, title: 'Operations negotiated supplier prices', change: '-12%', positive: true, detail: 'Packaging costs reduced across 3 vendors' },
  { icon: Users, title: 'You gained 46 new customers', change: '+46', positive: true, detail: '21 from Instagram, 15 from Google, 10 from word of mouth' },
  { icon: TrendingUp, title: 'Net profit increased', change: '+12%', positive: true, detail: 'Month over month comparison' },
];

const MARKETING_INSIGHTS = [
  { type: 'opportunity' as const, title: 'Competitor paused ads', desc: 'SweetTreats stopped Facebook ads. Capture their audience.', value: '+₹84,000', urgent: 'high' as const },
  { type: 'metric' as const, title: 'Instagram Reach', value: '12,340', change: '+23%', positive: true },
  { type: 'alert' as const, title: 'Cart abandonment rate high', desc: '68% of users abandon checkout. Consider exit-intent popup.', urgent: 'medium' as const },
];

const FINANCE_INSIGHTS = [
  { type: 'metric' as const, title: 'Gross Margin', value: '42%', change: '+5%', positive: true },
  { type: 'opportunity' as const, title: 'Tax saving opportunity', desc: 'You can claim ₹12,000 in startup deductions', urgent: 'medium' as const },
  { type: 'alert' as const, title: 'Cash flow gap predicted', desc: 'Shortfall of ₹35,000 in 19 days if current trend continues', urgent: 'high' as const },
];

const OPS_INSIGHTS = [
  { type: 'alert' as const, title: 'Supplier delay', desc: 'Packaging supplier delayed by 2 days. Alternative found.', urgent: 'high' as const },
  { type: 'metric' as const, title: 'Fulfillment Rate', value: '94%', change: '-2%', positive: false },
  { type: 'opportunity' as const, title: 'Inventory optimization', desc: 'You can reduce inventory holding by ₹8,000', urgent: 'low' as const },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function GrowPageContent() {
  const { state, dispatch } = useBusiness();
  const [activeTab, setActiveTab] = useState('overview');
  const [briefingVisible, setBriefingVisible] = useState(false);

  const pendingApprovals = state.approvals.filter(a => a.status === 'pending');
  const pendingCount = pendingApprovals.length;

  useEffect(() => {
    dispatch({ type: 'SET_PHASE', phase: 'grow' });
    const timer = setTimeout(() => setBriefingVisible(true), 300);
    return () => clearTimeout(timer);
  }, [dispatch]);

  const handleApprove = (id: string) => dispatch({ type: 'APPROVE_ACTION', approvalId: id });
  const handleDismiss = (id: string) => dispatch({ type: 'DISMISS_ACTION', approvalId: id });

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-main)' }}>
      <Sidebar />

      <main className="flex-1 ml-[280px] min-h-screen flex flex-col" style={{ paddingBottom: '320px' }}>
        <div className="px-8 py-6 border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#10B98115' }}>
              <TrendingUp className="w-5 h-5" style={{ color: '#10B981' }} />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--primary)' }}>Phase 3: Grow</h1>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Your AI COO is actively managing the business — 24/7</p>
            </div>
            <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: '#10B98115', color: '#10B981' }}>
              <Activity className="w-3.5 h-3.5" />
              All Systems Active
            </div>
          </div>
        </div>

        <div className="px-8 py-4 border-b flex items-center gap-1" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all relative"
              style={{
                background: activeTab === tab.id ? '#10B981' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
              }}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.badge && pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white" style={{ background: 'var(--accent)' }}>
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'overview' && <OverviewTab state={state} briefingVisible={briefingVisible} />}
          {activeTab === 'sales' && <SalesPanel />}
          {activeTab === 'marketing' && <SpecialistTab insights={MARKETING_INSIGHTS} color="#EF4444" />}
          {activeTab === 'finance' && <SpecialistTab insights={FINANCE_INSIGHTS} color="#10B981" />}
          {activeTab === 'operations' && <SpecialistTab insights={OPS_INSIGHTS} color="#6366F1" />}
          {activeTab === 'hr' && <HROverview />}
          {activeTab === 'support' && <SupportOverview />}
          {activeTab === 'analytics' && <AnalyticsPanel />}
          {activeTab === 'approvals' && <ApprovalsTab state={state} onApprove={handleApprove} onDismiss={handleDismiss} />}
        </div>
      </main>

      {/* Persistent Ambient Intelligence Bar */}
      <AmbientIntelligence />
    </div>
  );
}

function OverviewTab({ state, briefingVisible }: { state: any; briefingVisible: boolean }) {
  const metrics = state.metrics;
  const cards = [
    { label: 'Revenue', value: `₹${metrics.revenue.toLocaleString()}`, change: `+${metrics.revenueChange}%`, icon: IndianRupee, color: '#10B981', positive: true },
    { label: 'Orders', value: metrics.orders, change: `+${metrics.ordersChange}`, icon: ShoppingCart, color: '#3B82F6', positive: true },
    { label: 'Net Profit', value: `₹${metrics.profit.toLocaleString()}`, change: `+${metrics.profitChange}%`, icon: TrendingUp, color: '#F97316', positive: true },
    { label: 'Customers', value: metrics.activeCustomers, change: `+${metrics.customersChange}`, icon: Users, color: '#8B5CF6', positive: true },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className={`mb-8 rounded-2xl p-8 transition-all ${briefingVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ background: 'linear-gradient(135deg, #1A1A2E, #2D2D44)' }}>
        <div className="flex items-center gap-2 mb-6">
          <Crown className="w-5 h-5 text-white" />
          <span className="text-sm font-semibold text-white/80">CEO Agent Briefing</span>
          <span className="ml-auto text-xs text-white/50">{new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>

        <h2 className="text-2xl font-bold text-white mb-1">
          {getGreeting()}, <span style={{ color: '#F97316' }}>Atharva.</span>
        </h2>
        <p className="text-sm text-white/60 mb-8">While you slept, your business made significant progress.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BRIEFING_EVENTS.map((event, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-xl animate-fade-in"
              style={{ background: 'rgba(255,255,255,0.08)', animationDelay: `${i * 150}ms` }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.2)', color: '#10B981' }}>
                <event.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{event.title}</p>
                <p className="text-xs mt-0.5 text-white/50">{event.detail}</p>
              </div>
              <span className="text-sm font-bold" style={{ color: '#10B981' }}>{event.change}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-extrabold text-white">{metrics.revenue.toLocaleString()}</p>
              <p className="text-xs text-white/50">Total Revenue</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-extrabold" style={{ color: '#10B981' }}>+{metrics.profitChange}%</p>
              <p className="text-xs text-white/50">Net Profit Growth</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#10B981' }} />
            <span className="text-xs text-white/60">All specialists operational</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 stagger-children">
        {cards.map((card) => (
          <div key={card.label} className="p-5 rounded-2xl card-hover" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${card.color}15`, color: card.color }}>
                <card.icon className="w-4 h-4" />
              </div>
              <span className="flex items-center gap-0.5 text-xs font-bold" style={{ color: card.positive ? 'var(--secondary)' : 'var(--danger)' }}>
                {card.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {card.change}
              </span>
            </div>
            <p className="text-2xl font-extrabold" style={{ color: 'var(--primary)' }}>{card.value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--primary)' }}>Quick Stats</h3>
          <div className="space-y-3">
            {[
              { label: 'Marketing Spend', value: `₹${metrics.marketingSpend.toLocaleString()}` },
              { label: 'Inventory Value', value: `₹${metrics.inventoryValue.toLocaleString()}` },
              { label: 'Pending Tasks', value: metrics.pendingTasks },
              { label: 'Avg Order Value', value: `₹${Math.round(metrics.revenue / metrics.orders)}` },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center justify-between">
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</span>
                <span className="text-xs font-bold" style={{ color: 'var(--primary)' }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--primary)' }}>Revenue (Last 7 days)</h3>
          <div className="flex items-end gap-2 h-28">
            {[40, 65, 45, 80, 70, 90, 100].map((h, i) => (
              <div key={i} className="flex-1 rounded-t-lg transition-all" style={{ height: `${h}%`, background: i === 6 ? '#10B981' : '#F97316', opacity: i === 6 ? 1 : 0.4 + i * 0.1 }} />
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
              <span key={d} className="flex-1 text-center text-xs" style={{ color: i === 6 ? 'var(--text-primary)' : 'var(--text-muted)' }}>{d}</span>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--primary)' }}>Recent Activity</h3>
          <div className="space-y-3">
            {[
              { time: '2 min ago', event: 'New order received', type: 'success' },
              { time: '15 min ago', event: 'Instagram ad clicked 47 times', type: 'info' },
              { time: '1 hour ago', event: 'Payment received: ₹1,299', type: 'success' },
              { time: '3 hours ago', event: 'New customer signup', type: 'info' },
              { time: '5 hours ago', event: 'Marketing CTR improved 7%', type: 'success' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ background: activity.type === 'success' ? 'var(--secondary)' : '#3B82F6' }} />
                <div className="flex-1">
                  <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{activity.event}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SpecialistTab({ insights, color }: { insights: any[]; color: string }) {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: color }} />
        <span className="text-sm font-semibold" style={{ color }}>Specialist Active</span>
      </div>
      <div className="space-y-4 stagger-children">
        {insights.map((insight, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl card-hover"
            style={{
              background: 'var(--bg-surface)',
              border: insight.urgent === 'high' ? '1px solid #EF444440' : '1px solid var(--border)',
            }}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}15`, color }}>
                {insight.type === 'opportunity' ? <Zap className="w-5 h-5" /> : insight.type === 'alert' ? <AlertTriangle className="w-5 h-5" /> : <BarChart3 className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-bold" style={{ color: 'var(--primary)' }}>{insight.title}</p>
                  {insight.urgent && (
                    <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ background: insight.urgent === 'high' ? '#EF444415' : '#F59E0B15', color: insight.urgent === 'high' ? '#EF4444' : '#F59E0B' }}>
                      {insight.urgent}
                    </span>
                  )}
                  {insight.change && (
                    <span className="ml-auto text-sm font-bold" style={{ color: insight.positive ? 'var(--secondary)' : 'var(--danger)' }}>
                      {insight.change}
                    </span>
                  )}
                </div>
                {insight.desc && <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{insight.desc}</p>}
                {insight.value && !insight.change && <p className="text-lg font-bold" style={{ color }}>{insight.value}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HROverview() {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ background: '#6366F115' }}>
          <Users2 className="w-8 h-8" style={{ color: '#6366F1' }} />
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--primary)' }}>HR Specialist</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Employee management, payroll, and team optimization</p>

        <div className="mt-8 grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {[
            { label: 'Team Size', value: '2', sub: 'You + 1 part-time' },
            { label: 'Monthly Payroll', value: '₹18,000', sub: 'Next: 5th of month' },
            { label: 'Performance', value: 'Good', sub: 'Both performers' },
          ].map((stat) => (
            <div key={stat.label} className="p-4 rounded-xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              <p className="text-xl font-bold" style={{ color: 'var(--primary)' }}>{stat.value}</p>
              <p className="text-xs font-semibold mt-1" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{stat.sub}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-xl max-w-lg mx-auto" style={{ background: '#F59E0B10', border: '1px solid #F59E0B30' }}>
          <p className="text-sm font-semibold" style={{ color: '#F59E0B' }}>Need another employee within 3 weeks</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Based on order volume growth, you may need delivery support</p>
        </div>
      </div>
    </div>
  );
}

function SupportOverview() {
  const tickets = [
    { id: 'T-234', subject: 'Order not delivered yet', status: 'open', priority: 'high', time: '2 hours ago' },
    { id: 'T-235', subject: 'Want to change delivery address', status: 'open', priority: 'medium', time: '4 hours ago' },
    { id: 'T-232', subject: 'Request for bulk order pricing', status: 'resolved', priority: 'low', time: 'Yesterday' },
    { id: 'T-231', subject: 'Complaint about packaging', status: 'resolved', priority: 'medium', time: '2 days ago' },
  ];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#10B981' }} />
        <span className="text-sm font-semibold" style={{ color: '#10B981' }}>AI Support Active — Avg Response: 45 seconds</span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8 stagger-children">
        {[
          { label: 'Open Tickets', value: '2', color: 'var(--warning)' },
          { label: 'Resolved Today', value: '5', color: 'var(--secondary)' },
          { label: 'CSAT Score', value: '4.7/5', color: '#8B5CF6' },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl text-center" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="p-4 rounded-xl flex items-center gap-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: ticket.status === 'open' ? '#F59E0B15' : 'var(--secondary-light)', color: ticket.status === 'open' ? '#F59E0B' : 'var(--secondary)' }}>
              <Headphones className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{ticket.id}</span>
                <span className="text-sm font-medium" style={{ color: 'var(--primary)' }}>{ticket.subject}</span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{ticket.time}</p>
            </div>
            <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ background: ticket.status === 'open' ? '#F59E0B15' : 'var(--secondary-light)', color: ticket.status === 'open' ? '#F59E0B' : 'var(--secondary)' }}>
              {ticket.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ApprovalsTab({ state, onApprove, onDismiss }: { state: any; onApprove: (id: string) => void; onDismiss: (id: string) => void }) {
  const pending = state.approvals.filter((a: any) => a.status === 'pending');
  const approved = state.approvals.filter((a: any) => a.status === 'approved');
  const dismissed = state.approvals.filter((a: any) => a.status === 'dismissed');

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Crown className="w-5 h-5" style={{ color: 'var(--accent)' }} />
        <h2 className="text-lg font-bold" style={{ color: 'var(--primary)' }}>Approval Center</h2>
        {pending.length > 0 && (
          <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: 'var(--accent)' }}>{pending.length}</span>
        )}
      </div>

      {pending.length === 0 ? (
        <div className="text-center py-16">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--secondary)' }} />
          <p className="font-bold" style={{ color: 'var(--primary)' }}>All caught up!</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No pending approvals</p>
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {pending.map((approval: any) => (
            <div key={approval.id} className="p-6 rounded-2xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: approval.urgency === 'high' ? '#EF444415' : '#F59E0B15', color: approval.urgency === 'high' ? '#EF4444' : '#F59E0B' }}>
                  {approval.urgency === 'high' ? <AlertTriangle className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold" style={{ color: 'var(--primary)' }}>{approval.title}</p>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ background: approval.urgency === 'high' ? '#EF444415' : approval.urgency === 'medium' ? '#F59E0B15' : 'var(--bg-elevated)', color: approval.urgency === 'high' ? '#EF4444' : '#F59E0B' }}>
                      {approval.urgency}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{approval.description}</p>
                  {approval.expectedValue && (
                    <p className="text-sm font-bold mt-2" style={{ color: 'var(--secondary)' }}>Expected: {approval.expectedValue}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => onApprove(approval.id)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all btn-press" style={{ background: 'var(--secondary)' }}>
                  <ThumbsUp className="w-4 h-4" /> Approve
                </button>
                <button onClick={() => onDismiss(approval.id)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all btn-press" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
                  <ThumbsDown className="w-4 h-4" /> Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {approved.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Approved</p>
          <div className="space-y-2">
            {approved.map((a: any) => (
              <div key={a.id} className="p-3 rounded-xl flex items-center gap-3" style={{ background: 'var(--secondary-light)' }}>
                <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--secondary)' }} />
                <span className="text-xs" style={{ color: 'var(--secondary)' }}>{a.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}