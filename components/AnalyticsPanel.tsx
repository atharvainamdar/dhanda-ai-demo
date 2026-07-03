'use client';

import { useState } from 'react';
import { useBusiness } from '@/lib/store';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MousePointerClick,
  ShoppingCart,
  Users,
  DollarSign,
  Calendar,
  Download,
  Filter,
} from 'lucide-react';

const PERIODS = ['Today', '7 days', '30 days', '90 days', 'This year'];
const PERIOD_DATA = {
  'Today': { revenue: 4250, orders: 3, visitors: 156, conversion: 1.9 },
  '7 days': { revenue: 28450, orders: 21, visitors: 892, conversion: 2.4 },
  '30 days': { revenue: 84750, orders: 89, visitors: 3421, conversion: 2.6 },
  '90 days': { revenue: 234600, orders: 234, visitors: 9845, conversion: 2.4 },
  'This year': { revenue: 1245000, orders: 1245, visitors: 45230, conversion: 2.8 },
};

const CHANNELS = [
  { name: 'Instagram', visitors: 12450, revenue: 42600, conversion: 3.4, color: '#E1306C' },
  { name: 'Google Search', visitors: 8920, revenue: 24100, conversion: 2.7, color: '#4285F4' },
  { name: 'Direct / Website', visitors: 5640, revenue: 16800, conversion: 3.0, color: '#F97316' },
  { name: 'WhatsApp', visitors: 3210, revenue: 12400, conversion: 3.9, color: '#25D366' },
  { name: 'Referral', visitors: 1890, revenue: 4500, conversion: 2.4, color: '#8B5CF6' },
];

const TOP_PRODUCTS = [
  { name: 'Premium Chocolate Bouquet', orders: 45, revenue: 56025, avgValue: 1245 },
  { name: 'Anniversary Special', orders: 32, revenue: 38400, avgValue: 1200 },
  { name: 'Kids Birthday Box', orders: 28, revenue: 25200, avgValue: 900 },
  { name: 'Corporate Gift Set', orders: 18, revenue: 31500, avgValue: 1750 },
  { name: 'Custom Bouquet', orders: 12, revenue: 21600, avgValue: 1800 },
];

const CUSTOMER_RETENTION = [
  { month: 'Jan', new: 12, returning: 8 },
  { month: 'Feb', new: 18, returning: 14 },
  { month: 'Mar', new: 24, returning: 22 },
  { month: 'Apr', new: 31, returning: 28 },
  { month: 'May', new: 28, returning: 35 },
  { month: 'Jun', new: 35, returning: 42 },
];

export default function AnalyticsPanel() {
  const { state } = useBusiness();
  const [period, setPeriod] = useState('30 days');
  const data = PERIOD_DATA[period as keyof typeof PERIOD_DATA];

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#8B5CF6' }} />
        <span className="text-sm font-semibold" style={{ color: '#8B5CF6' }}>Analytics AI — 234 data points analyzed</span>
      </div>

      {/* Period selector + export */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--bg-elevated)' }}>
          {PERIODS.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: period === p ? 'var(--bg-surface)' : 'transparent',
                color: period === p ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: period === p ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {p}
            </button>
          ))}
        </div>
        <button className="ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
          <Download className="w-3.5 h-3.5" /> Export
        </button>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-8 stagger-children">
        {[
          { label: 'Revenue', value: `₹${data.revenue.toLocaleString()}`, change: '+12%', icon: DollarSign, color: '#10B981' },
          { label: 'Orders', value: data.orders, change: '+18%', icon: ShoppingCart, color: '#3B82F6' },
          { label: 'Visitors', value: data.visitors.toLocaleString(), change: '+23%', icon: Eye, color: '#8B5CF6' },
          { label: 'Conversion', value: `${data.conversion}%`, change: '+0.4%', icon: MousePointerClick, color: '#F97316' },
        ].map((kpi) => (
          <div key={kpi.label} className="p-5 rounded-2xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${kpi.color}15`, color: kpi.color }}>
                <kpi.icon className="w-4 h-4" />
              </div>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{kpi.label}</span>
            </div>
            <p className="text-2xl font-extrabold" style={{ color: 'var(--primary)' }}>{kpi.value}</p>
            <span className="flex items-center gap-0.5 text-xs font-bold mt-1" style={{ color: 'var(--secondary)' }}>
              <ArrowUpRight className="w-3 h-3" /> {kpi.change} vs last period
            </span>
          </div>
        ))}
      </div>

      {/* Channel breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--primary)' }}>Traffic by Channel</h3>
          <div className="space-y-3">
            {CHANNELS.map((ch) => {
              const maxVisitors = Math.max(...CHANNELS.map(c => c.visitors));
              const pct = (ch.visitors / maxVisitors) * 100;
              return (
                <div key={ch.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: ch.color }} />
                      <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{ch.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-mono" style={{ color: 'var(--primary)' }}>{ch.visitors.toLocaleString()}</span>
                      <span style={{ color: 'var(--secondary)' }}>{ch.conversion}% CVR</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: ch.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top products */}
        <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--primary)' }}>Top Products</h3>
          <div className="space-y-2">
            {TOP_PRODUCTS.map((product, i) => (
              <div key={product.name} className="flex items-center gap-3 p-2.5 rounded-lg" style={{ background: i === 0 ? '#10B98108' : 'transparent' }}>
                <span className="text-xs font-mono w-4 text-right" style={{ color: 'var(--text-muted)' }}>#{i + 1}</span>
                <div className="flex-1">
                  <p className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>{product.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{product.orders} orders · ₹{product.avgValue} avg</p>
                </div>
                <span className="text-sm font-bold" style={{ color: 'var(--primary)' }}>₹{product.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer retention chart */}
      <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>Customer Acquisition vs Retention</h3>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: '#8B5CF6' }} />
              <span style={{ color: 'var(--text-muted)' }}>New customers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: '#10B981' }} />
              <span style={{ color: 'var(--text-muted)' }}>Returning customers</span>
            </div>
          </div>
        </div>
        <div className="flex items-end gap-3 h-40">
          {CUSTOMER_RETENTION.map((m) => {
            const maxVal = 50;
            const newH = (m.new / maxVal) * 100;
            const retH = (m.returning / maxVal) * 100;
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-1 items-end justify-center" style={{ height: '120px' }}>
                  <div className="w-5 rounded-t-lg transition-all" style={{ height: `${newH}%`, background: '#8B5CF6' }} />
                  <div className="w-5 rounded-t-lg transition-all" style={{ height: `${retH}%`, background: '#10B981' }} />
                </div>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{m.month}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 p-3 rounded-xl flex items-center gap-3" style={{ background: '#10B98110' }}>
          <TrendingUp className="w-4 h-4" style={{ color: '#10B981' }} />
          <p className="text-xs" style={{ color: '#10B981' }}>
            <strong>42% increase in returning customers</strong> — your repeat purchase rate is 28% above industry average for gifting businesses
          </p>
        </div>
      </div>

      {/* Insight */}
      <div className="mt-6 p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg, #8B5CF610, #8B5CF605)', border: '1px solid #8B5CF630' }}>
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="w-4 h-4" style={{ color: '#8B5CF6' }} />
          <span className="text-sm font-bold" style={{ color: '#8B5CF6' }}>AI Insight</span>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Your Instagram conversion rate (3.4%) is <strong style={{ color: 'var(--primary)' }}>43% above average</strong> for your category. Consider allocating 60% of marketing budget to Instagram content. WhatsApp has the highest conversion (3.9%) despite lower traffic — prioritize WhatsApp marketing for repeat customers.
        </p>
        <button className="mt-3 flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#8B5CF6' }}>
          Get detailed channel recommendations → 
        </button>
      </div>
    </div>
  );
}