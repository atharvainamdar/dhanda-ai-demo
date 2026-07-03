'use client';

import { useState } from 'react';
import { useBusiness } from '@/lib/store';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Building2,
  Shield,
  Zap,
} from 'lucide-react';

const PAYMENT_METHODS = [
  {
    id: 'razorpay',
    name: 'Razorpay',
    desc: 'Accepts UPI, cards, net banking, wallets',
    fee: '2%',
    setup: '₹0',
    popular: true,
    color: '#0066FF',
    features: ['UPI payments', 'Card payments', 'Auto reconciliation', 'Invoice generation'],
  },
  {
    id: 'phonepe',
    name: 'PhonePe',
    desc: 'Best for UPI-heavy customers',
    fee: '1.5%',
    setup: '₹0',
    popular: false,
    color: '#5F259F',
    features: ['UPI@auto', 'QR payments', 'WhatsApp checkout'],
  },
  {
    id: 'paytm',
    name: 'Paytm',
    desc: 'Wide reach in tier-2/3 cities',
    fee: '1.8%',
    setup: '₹0',
    popular: false,
    color: '#00B9F1',
    features: ['Paytm Wallet', 'UPI', 'Saved cards'],
  },
];

const CHANNELS = [
  { name: 'WhatsApp Business', icon: '💬', status: 'ready', desc: 'Send payment links via chat' },
  { name: 'Instagram DM', icon: '📸', status: 'ready', desc: 'Cart checkout in Instagram' },
  { name: 'Website Checkout', icon: '🌐', status: 'ready', desc: 'Embedded on your website' },
  { name: 'Google Pay', icon: '🟢', status: 'ready', desc: 'UPI deep link' },
];

export default function PaymentsPanel() {
  const { state, dispatch } = useBusiness();
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [activating, setActivating] = useState(false);
  const [done, setDone] = useState(false);
  const brandName = state.brandingChoices?.name || 'YourBusiness';

  const handleActivate = async () => {
    if (!selected) return;
    setActivating(true);
    await new Promise(r => setTimeout(r, 2000));
    setActivating(false);
    setDone(true);
    dispatch({ type: 'COMPLETE_MISSION', missionId: 'payments' });
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#0066FF15' }}>
          <CreditCard className="w-6 h-6" style={{ color: '#0066FF' }} />
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--primary)' }}>Payments Setup</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Accept payments from customers instantly</p>
        </div>
      </div>

      {/* Business account */}
      <div className="p-5 rounded-2xl mb-6 flex items-center gap-4" style={{ background: 'linear-gradient(135deg, #0066FF10, #5F259F10)', border: '1px solid #0066FF30' }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#0066FF20', color: '#0066FF' }}>
          <Building2 className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: 'var(--primary)' }}>Business Bank Account</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Required to receive payments. We recommend HDFC or ICICI for businesses.</p>
        </div>
        <span className="ml-auto px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: '#F59E0B15', color: '#F59E0B' }}>Needed for settlement</span>
      </div>

      {/* Payment gateway */}
      <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--primary)' }}>Choose your payment gateway</h3>
      <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>All options have zero setup cost — you only pay per transaction</p>

      <div className="space-y-3 mb-8">
        {PAYMENT_METHODS.map((method) => (
          <div
            key={method.id}
            className={`p-5 rounded-2xl cursor-pointer transition-all ${selected === method.id ? 'card-hover' : ''}`}
            style={{
              background: 'var(--bg-surface)',
              border: selected === method.id ? `2px solid ${method.color}` : '1px solid var(--border)',
            }}
            onClick={() => setSelected(method.id)}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: `${method.color}15` }}>
                💳
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-bold" style={{ color: 'var(--primary)' }}>{method.name}</p>
                  {method.popular && (
                    <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ background: `${method.color}15`, color: method.color }}>Most Popular</span>
                  )}
                </div>
                <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{method.desc}</p>
                <div className="flex items-center gap-3 text-xs">
                  <span style={{ color: method.color }}><strong>{method.fee}</strong> per transaction</span>
                  <span>·</span>
                  <span style={{ color: 'var(--text-muted)' }}>Setup: <strong style={{ color: 'var(--primary)' }}>{method.setup}</strong></span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {method.features.map((f) => (
                    <span key={f} className="flex items-center gap-1 px-2 py-0.5 rounded text-xs" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
                      <CheckCircle2 className="w-2.5 h-2.5" style={{ color: 'var(--secondary)' }} /> {f}
                    </span>
                  ))}
                </div>
              </div>
              <div
                className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                style={{
                  borderColor: method.color,
                  background: selected === method.id ? method.color : 'transparent',
                }}
              >
                {selected === method.id && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment channels */}
      <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--primary)' }}>Payment Channels</h3>
      <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Where your customers can pay you</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {CHANNELS.map((channel) => (
          <div key={channel.name} className="p-4 rounded-xl text-center" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <span className="text-2xl">{channel.icon}</span>
            <p className="text-xs font-semibold mt-2" style={{ color: 'var(--primary)' }}>{channel.name}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{channel.desc}</p>
            <span className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold" style={{ background: 'var(--secondary-light)', color: 'var(--secondary)' }}>
              <CheckCircle2 className="w-2.5 h-2.5" /> Ready
            </span>
          </div>
        ))}
      </div>

      {/* Pricing preview */}
      <div className="p-5 rounded-2xl mb-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--primary)' }}>Example Transaction</h3>
        <div className="flex items-center gap-4 text-sm">
          <span>Customer pays</span>
          <span className="text-lg font-bold" style={{ color: 'var(--primary)' }}>₹1,299</span>
          <ArrowRight className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <span>You receive</span>
          <span className="text-lg font-bold" style={{ color: 'var(--secondary)' }}>
            ₹1,273{selected ? ` (${PAYMENT_METHODS.find(m => m.id === selected)?.fee} fee)` : ''}
          </span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Settlement: T+1 day</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button onClick={() => router.push('/build?mission=website')} className="px-4 py-2 rounded-lg text-sm" style={{ color: 'var(--text-muted)' }}>
          ← Website Builder
        </button>
        <button
          onClick={handleActivate}
          disabled={!selected || activating}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all btn-press disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #0066FF, #5F259F)' }}
        >
          {activating ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : done ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
          {done ? 'Payments Active!' : activating ? 'Activating...' : 'Activate Payments'}
        </button>
      </div>
    </div>
  );
}