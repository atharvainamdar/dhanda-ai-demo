'use client';

import { useState } from 'react';
import { useBusiness } from '@/lib/store';
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  Target,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Zap,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  MessageSquare,
} from 'lucide-react';

const PIPELINE = [
  { stage: 'Inquiry', count: 12, value: '₹38,400', conversion: 100 },
  { stage: 'Quoted', count: 8, value: '₹24,800', conversion: 67 },
  { stage: 'Negotiating', count: 4, value: '₹11,200', conversion: 33 },
  { stage: 'Committed', count: 2, value: '₹5,600', conversion: 17 },
  { stage: 'Won', count: 1, value: '₹2,799', conversion: 8 },
];

const OPPORTUNITIES = [
  { title: 'CorpGifts India inquiry', company: 'CorpGifts India', value: '₹45,000', probability: 65, stage: 'Quoted', source: 'Instagram', urgent: true },
  { title: 'Wedding bulk order', company: 'Private', value: '₹18,000', probability: 80, stage: 'Negotiating', source: 'WhatsApp', urgent: false },
  { title: 'Corporate Diwali gifting', company: 'TechCorp Pune', value: '₹72,000', probability: 40, stage: 'Inquiry', source: 'Google', urgent: false },
  { title: 'Repeat customer order', company: 'Priya S.', value: '₹4,500', probability: 95, stage: 'Won', source: 'Repeat', urgent: false },
];

const WIN_TIPS = [
  { tip: 'Follow up on CorpGifts inquiry — sent 3 days ago, no response', action: 'Send WhatsApp follow-up', value: '₹45,000' },
  { tip: 'Wedding customer requested customization — respond within 2 hours', action: 'Send pricing with options', value: '₹18,000' },
];

export default function SalesPanel() {
  const { state, dispatch } = useBusiness();
  const [selectedOpportunity, setSelectedOpportunity] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  const filtered = OPPORTUNITIES.filter(o => filter === 'all' || o.stage.toLowerCase() === filter);

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#EF4444' }} />
        <span className="text-sm font-semibold" style={{ color: '#EF4444' }}>Sales AI Active</span>
        <span className="ml-2 text-xs" style={{ color: 'var(--text-muted)' }}>2 active opportunities worth ₹1,35,000</span>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-4 gap-4 mb-8 stagger-children">
        {[
          { label: 'Pipeline Value', value: '₹82,500', change: '+22%', positive: true, icon: DollarSign },
          { label: 'Win Rate', value: '68%', change: '+5%', positive: true, icon: Target },
          { label: 'Avg Deal Size', value: '₹3,200', change: '+12%', positive: true, icon: TrendingUp },
          { label: 'Avg Response Time', value: '28 min', change: '-40%', positive: true, icon: Clock },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="w-4 h-4" style={{ color: '#EF4444' }} />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</span>
            </div>
            <p className="text-xl font-bold" style={{ color: 'var(--primary)' }}>{stat.value}</p>
            <span className="flex items-center gap-0.5 text-xs font-bold" style={{ color: stat.positive ? 'var(--secondary)' : 'var(--danger)' }}>
              {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {stat.change}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales pipeline */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>Sales Pipeline</h3>
            <div className="flex gap-1">
              {['all', 'inquiry', 'quoted', 'negotiating', 'won'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-3 py-1 rounded-full text-xs transition-all capitalize"
                  style={{
                    background: filter === f ? '#EF4444' : 'var(--bg-elevated)',
                    color: filter === f ? 'white' : 'var(--text-muted)',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {filtered.map((opp, i) => (
              <div
                key={i}
                onClick={() => setSelectedOpportunity(selectedOpportunity === opp.title ? null : opp.title)}
                className="p-4 rounded-xl cursor-pointer transition-all card-hover"
                style={{
                  background: 'var(--bg-surface)',
                  border: selectedOpportunity === opp.title ? '2px solid #EF4444' : '1px solid var(--border)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: opp.urgent ? '#EF444415' : 'var(--bg-elevated)', color: opp.urgent ? '#EF4444' : 'var(--text-muted)' }}>
                    {opp.urgent ? <AlertTriangle className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>{opp.title}</p>
                      {opp.urgent && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: '#EF444415', color: '#EF4444' }}>URGENT</span>}
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{opp.source} · {opp.stage}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: 'var(--primary)' }}>{opp.value}</p>
                    <p className="text-xs" style={{ color: 'var(--secondary)' }}>{opp.probability}% likely</p>
                  </div>
                </div>

                {selectedOpportunity === opp.title && (
                  <div className="mt-3 pt-3 border-t animate-fade-in" style={{ borderColor: 'var(--border)' }}>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div className="p-3 rounded-lg" style={{ background: 'var(--bg-elevated)' }}>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Deal Value</p>
                        <p className="text-sm font-bold" style={{ color: 'var(--primary)' }}>{opp.value}</p>
                      </div>
                      <div className="p-3 rounded-lg" style={{ background: 'var(--bg-elevated)' }}>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Probability</p>
                        <p className="text-sm font-bold" style={{ color: 'var(--secondary)' }}>{opp.probability}%</p>
                      </div>
                      <div className="p-3 rounded-lg" style={{ background: 'var(--bg-elevated)' }}>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Source</p>
                        <p className="text-sm font-bold" style={{ color: 'var(--primary)' }}>{opp.source}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white" style={{ background: '#EF4444' }}>
                        <MessageSquare className="w-3.5 h-3.5" /> Follow Up
                      </button>
                      <button className="px-4 py-2 rounded-lg text-xs font-semibold" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
                        View Details
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI suggestions */}
        <div>
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--primary)' }}>AI Suggestions</h3>
          <div className="space-y-3">
            {WIN_TIPS.map((tip, i) => (
              <div key={i} className="p-4 rounded-xl" style={{ background: '#F59E0B10', border: '1px solid #F59E0B30' }}>
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-3.5 h-3.5" style={{ color: '#F59E0B' }} />
                  <span className="text-xs font-semibold" style={{ color: '#F59E0B' }}>Action needed</span>
                  <span className="ml-auto text-xs font-bold" style={{ color: 'var(--secondary)' }}>{tip.value}</span>
                </div>
                <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>{tip.tip}</p>
                <button className="w-full py-2 rounded-lg text-xs font-semibold text-white btn-press" style={{ background: '#F59E0B' }}>
                  {tip.action}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 rounded-xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>This week's target</p>
            <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: 'var(--bg-elevated)' }}>
              <div className="h-full rounded-full" style={{ width: '68%', background: '#EF4444' }} />
            </div>
            <div className="flex justify-between text-xs">
              <span style={{ color: 'var(--text-secondary)' }}>₹22,000 of ₹32,000</span>
              <span style={{ color: '#EF4444' }}>68%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}