'use client';

import { useState, useEffect, useRef } from 'react';
import { useBusiness } from '@/lib/store';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Zap,
  ShoppingCart,
  IndianRupee,
  Users,
  DollarSign,
  Clock,
  X,
  CheckCircle2,
  MessageSquare,
  Bell,
  ArrowRight,
} from 'lucide-react';

// Simulated real-time data feed (in production, this would be WebSocket/API)
const LIVE_EVENTS = [
  { id: 1, type: 'order', message: 'New order: Chocolate Bouquet Premium', amount: '₹1,299', positive: true, time: '2m ago' },
  { id: 2, type: 'alert', message: 'Marketing CTR above target', value: '4.2%', positive: true, time: '5m ago' },
  { id: 3, type: 'warning', message: 'Inventory low: Ruby Chocolate', value: '12 units', positive: false, time: '12m ago' },
  { id: 4, type: 'success', message: 'Payment received', amount: '₹2,499', positive: true, time: '18m ago' },
  { id: 5, type: 'insight', message: 'Instagram reach up 23% this week', positive: true, time: '1h ago' },
  { id: 6, type: 'order', message: 'Bulk order inquiry from CorpGifts', positive: true, time: '2h ago' },
];

const PROACTIVE_NUDDLES = [
  {
    id: 'n1',
    type: 'opportunity',
    title: '📈 23% more orders than last week',
    body: 'Your weekend promotions are working. Consider extending through Tuesday.',
    action: 'Extend Campaign',
    dismiss: 'Later',
    urgent: false,
  },
  {
    id: 'n2',
    type: 'alert',
    title: '⚠️ Supplier delay detected',
    body: 'CocoSupply delayed by 1 day. Alternative found at same price.',
    action: 'Switch Supplier',
    dismiss: 'Ignore',
    urgent: true,
  },
];

type Nudge = typeof PROACTIVE_NUDDLES[0];

export default function AmbientIntelligence() {
  const { state, dispatch } = useBusiness();
  const [collapsed, setCollapsed] = useState(false);
  const [events, setEvents] = useState(LIVE_EVENTS.slice(0, 3));
  const [nudge, setNudge] = useState<Nudge | null>(PROACTIVE_NUDDLES[0]);
  const [notifCount, setNotifCount] = useState(2);
  const metrics = state.metrics;
  const metricsRef = useRef(metrics);

  // Simulate live event feed
  useEffect(() => {
    const interval = setInterval(() => {
      const randomEvent = LIVE_EVENTS[Math.floor(Math.random() * LIVE_EVENTS.length)];
      setEvents(prev => [randomEvent, ...prev.slice(0, 4)]);
    }, 18000);

    return () => clearInterval(interval);
  }, []);

  // Rotate nudge every 30 seconds
  useEffect(() => {
    const rotate = setInterval(() => {
      setNudge(PROACTIVE_NUDDLES[Math.floor(Math.random() * PROACTIVE_NUDDLES.length)]);
    }, 30000);
    return () => clearInterval(rotate);
  }, []);

  const handleDismissNudge = () => setNudge(null);
  const handleActOnNudge = (nudgeId: string) => {
    dispatch({ type: 'APPROVE_ACTION', approvalId: 'apr-1' });
    setNudge(null);
    setNotifCount(c => c - 1);
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingCart className="w-3 h-3" />;
      case 'alert': return <Bell className="w-3 h-3" />;
      case 'warning': return <AlertTriangle className="w-3 h-3" />;
      case 'success': return <CheckCircle2 className="w-3 h-3" />;
      case 'insight': return <Sparkles className="w-3 h-3" />;
      default: return <Activity className="w-3 h-3" />;
    }
  };

  const getEventColor = (type: string, positive: boolean) => {
    if (!positive) return 'var(--danger)';
    switch (type) {
      case 'order': return '#10B981';
      case 'alert': return '#8B5CF6';
      case 'warning': return 'var(--warning)';
      case 'success': return 'var(--secondary)';
      case 'insight': return '#F97316';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <>
      {/* Ambient Intelligence Bar */}
      <div
        className="fixed bottom-0 left-[280px] right-0 z-50 transition-all duration-300"
        style={{
          background: collapsed
            ? 'linear-gradient(135deg, #1A1A2E, #2D2D44)'
            : 'linear-gradient(135deg, rgba(26,26,46,0.98), rgba(45,45,68,0.98))',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          maxHeight: collapsed ? '48px' : '320px',
          overflow: 'hidden',
        }}
      >
        {/* Toggle bar */}
        <div
          className="flex items-center justify-between px-5 py-3 cursor-pointer"
          onClick={() => setCollapsed(!collapsed)}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#10B981' }} />
              <span className="text-xs font-semibold text-white/80">CEO AGENT</span>
            </div>

            {/* Live metrics ticker */}
            <div className="flex items-center gap-4 ml-6">
              <div className="flex items-center gap-1.5">
                <IndianRupee className="w-3 h-3 text-white/50" />
                <span className="text-xs font-mono text-white">{metrics.revenue.toLocaleString()}</span>
                <span className="text-xs" style={{ color: '#10B981' }}>+{metrics.revenueChange}%</span>
              </div>
              <div className="w-px h-3 bg-white/10" />
              <div className="flex items-center gap-1.5">
                <ShoppingCart className="w-3 h-3 text-white/50" />
                <span className="text-xs font-mono text-white">{metrics.orders}</span>
                <span className="text-xs" style={{ color: '#10B981' }}>+{metrics.ordersChange}</span>
              </div>
              <div className="w-px h-3 bg-white/10" />
              <div className="flex items-center gap-1.5">
                <Users className="w-3 h-3 text-white/50" />
                <span className="text-xs font-mono text-white">{metrics.activeCustomers}</span>
                <span className="text-xs" style={{ color: '#10B981' }}>+{metrics.customersChange}</span>
              </div>
              {notifCount > 0 && (
                <>
                  <div className="w-px h-3 bg-white/10" />
                  <button className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold animate-pulse" style={{ background: 'rgba(249,115,22,0.3)', color: '#F97316' }}>
                    <Bell className="w-3 h-3" />
                    {notifCount} action{notifCount > 1 ? 's' : ''} needed
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40">
              {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </span>
            {collapsed ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
          </div>
        </div>

        {/* Expanded panel */}
        {!collapsed && (
          <div className="px-5 pb-4 grid grid-cols-3 gap-4">
            {/* Live event feed */}
            <div className="col-span-2 space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-3.5 h-3.5 text-white/40" />
                <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Live Feed</span>
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#10B981' }} />
              </div>
              <div className="space-y-1.5 max-h-[180px] overflow-y-auto">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all animate-fade-in"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: `${getEventColor(event.type, event.positive!)}20`, color: getEventColor(event.type, event.positive!) }}>
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-white/80">{event.message}</p>
                      {event.amount && (
                        <span className="text-xs font-bold" style={{ color: getEventColor(event.type, event.positive!) }}>
                          {event.amount}
                        </span>
                      )}
                      {event.value && (
                        <span className="text-xs font-mono ml-2" style={{ color: getEventColor(event.type, event.positive!) }}>
                          {event.value}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-white/30">{event.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Proactive nudge */}
            {nudge && (
              <div
                className="rounded-xl p-4 animate-fade-in"
                style={{
                  background: nudge.urgent ? 'rgba(239,68,68,0.15)' : 'rgba(249,115,22,0.15)',
                  border: `1px solid ${nudge.urgent ? 'rgba(239,68,68,0.3)' : 'rgba(249,115,22,0.3)'}`,
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-bold text-white">{nudge.title}</span>
                  <button onClick={handleDismissNudge} className="text-white/30 hover:text-white/60 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-xs text-white/60 mb-3">{nudge.body}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleActOnNudge(nudge.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all btn-press"
                    style={{ background: nudge.urgent ? '#EF4444' : 'var(--accent)' }}
                  >
                    {nudge.action} <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={handleDismissNudge}
                    className="px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white/60 transition-all"
                  >
                    {nudge.dismiss}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}