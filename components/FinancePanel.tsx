'use client';

import { useState } from 'react';
import { useBusiness } from '@/lib/store';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Building2,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

const COST_BREAKDOWN = [
  { category: 'Equipment & Tools', amount: 18000, color: '#3B82F6' },
  { category: 'Initial Inventory', amount: 22000, color: '#10B981' },
  { category: 'Packaging Materials', amount: 8400, color: '#EC4899' },
  { category: 'Marketing Budget', amount: 12000, color: '#F97316' },
  { category: 'Emergency Fund', amount: 13000, color: '#8B5CF6' },
];

const LOANS = [
  {
    name: 'MUDRA Loan',
    provider: 'Public / Private Banks',
    amount: 'Up to ₹10 Lakhs',
    interest: '8-12%',
    eligible: true,
    score: 95,
    desc: 'Perfect for small manufacturing and service businesses',
  },
  {
    name: 'Maharashtra Startup Scheme',
    provider: 'MSEDCL / State Government',
    amount: 'Up to ₹50 Lakhs',
    interest: '5-8%',
    eligible: true,
    score: 88,
    desc: 'For technology and innovation-driven businesses',
  },
  {
    name: 'SIDBI Seed Fund',
    provider: 'SIDBI',
    amount: 'Up to ₹25 Lakhs',
    interest: '6-10%',
    eligible: true,
    score: 82,
    desc: 'Equity-free seed funding for early-stage startups',
  },
  {
    name: 'Angel Investment',
    provider: 'Venture Capital / Angels',
    amount: '₹5-50 Lakhs',
    interest: 'Equity-based',
    eligible: false,
    score: 45,
    desc: 'High growth potential required',
  },
];

export default function FinancePanel() {
  const { state, dispatch } = useBusiness();
  const [showLoanDetails, setShowLoanDetails] = useState<string | null>(null);
  const [expandedLoan, setExpandedLoan] = useState<string | null>(null);
  const totalCost = COST_BREAKDOWN.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#10B98115' }}>
          <DollarSign className="w-6 h-6" style={{ color: '#10B981' }} />
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--primary)' }}>Finance Specialist</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Your financial roadmap and funding options</p>
        </div>
      </div>

      {/* Cost breakdown */}
      <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--primary)' }}>Estimated Startup Cost</h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Based on your business type and location</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-extrabold" style={{ color: 'var(--accent)' }}>₹{totalCost.toLocaleString()}</span>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Total Investment</p>
          </div>
        </div>

        {/* Cost bars */}
        <div className="space-y-3 mb-6">
          {COST_BREAKDOWN.map((item) => {
            const pct = (item.amount / totalCost) * 100;
            return (
              <div key={item.category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{item.category}</span>
                  <span className="text-xs font-bold" style={{ color: 'var(--primary)' }}>₹{item.amount.toLocaleString()}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: item.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Emergency fund note */}
        <div className="p-3 rounded-xl flex items-center gap-2" style={{ background: '#8B5CF610' }}>
          <TrendingUp className="w-4 h-4" style={{ color: '#8B5CF6' }} />
          <p className="text-xs" style={{ color: '#8B5CF6' }}>
            Emergency fund included to cover 4 weeks of operating costs
          </p>
        </div>
      </div>

      {/* Funding options */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--primary)' }}>
          You currently qualify for
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LOANS.map((loan) => (
            <div
              key={loan.name}
              className="p-5 rounded-2xl cursor-pointer transition-all card-hover"
              style={{
                background: 'var(--bg-surface)',
                border: expandedLoan === loan.name ? '2px solid #10B981' : '1px solid var(--border)',
              }}
              onClick={() => setExpandedLoan(expandedLoan === loan.name ? null : loan.name)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" style={{ color: loan.eligible ? '#10B981' : 'var(--text-muted)' }} />
                  <h4 className="text-sm font-bold" style={{ color: loan.eligible ? 'var(--primary)' : 'var(--text-muted)' }}>
                    {loan.name}
                  </h4>
                </div>
                <span
                  className="px-2 py-0.5 rounded text-xs font-semibold"
                  style={{
                    background: loan.eligible ? 'var(--secondary-light)' : 'var(--bg-elevated)',
                    color: loan.eligible ? 'var(--secondary)' : 'var(--text-muted)',
                  }}
                >
                  {loan.score}%
                </span>
              </div>
              <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>{loan.desc}</p>

              {expandedLoan === loan.name && (
                <div className="space-y-2 pt-3 border-t animate-fade-in" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex justify-between">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Amount</span>
                    <span className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>{loan.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Interest Rate</span>
                    <span className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>{loan.interest}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Provider</span>
                    <span className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>{loan.provider}</span>
                  </div>
                  <button className="w-full mt-2 py-2 rounded-lg text-xs font-semibold text-white transition-all btn-press" style={{ background: 'var(--secondary)' }}>
                    Apply for this Loan
                  </button>
                </div>
              )}

              {!expandedLoan && (
                <div className="flex items-center gap-1 text-xs font-medium" style={{ color: 'var(--secondary)' }}>
                  View details <ChevronRight className="w-3 h-3" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Cash flow forecast */}
      <div className="rounded-2xl p-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--primary)' }}>Cash Flow Forecast (Month 1-3)</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { month: 'Month 1', value: '₹32,000', desc: 'Setup & initial sales', color: 'var(--accent)' },
            { month: 'Month 2', value: '₹68,500', desc: 'Growing through word of mouth', color: '#8B5CF6' },
            { month: 'Month 3', value: '₹1,12,000', desc: 'Profit positive runway', color: 'var(--secondary)' },
          ].map((m) => (
            <div key={m.month} className="p-4 rounded-xl" style={{ background: 'var(--bg-elevated)' }}>
              <p className="text-xs font-semibold mb-2" style={{ color: m.color }}>{m.month}</p>
              <p className="text-lg font-bold" style={{ color: 'var(--primary)' }}>{m.value}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}