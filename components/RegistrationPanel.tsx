'use client';

import { useState } from 'react';
import { useBusiness } from '@/lib/store';
import { useRouter } from 'next/navigation';
import {
  Building2,
  CheckCircle2,
  FileText,
  Loader2,
  ChevronRight,
  Shield,
  CreditCard,
  Smartphone,
  ArrowRight,
} from 'lucide-react';

const BUSINESS_TYPES = [
  { id: 'proprietorship', name: 'Sole Proprietorship', desc: 'Simplest, you own it alone', popular: true },
  { id: 'partnership', name: 'Partnership', desc: '2+ partners, shared liability', popular: false },
  { id: 'llp', name: 'LLP', desc: 'Limited liability, flexible management', popular: false },
  { id: 'pvtltd', name: 'Private Limited', desc: 'Separate entity, best for scaling', popular: false },
];

const DOCS_NEEDED = [
  { name: 'PAN Card', desc: 'Your personal PAN', icon: '🪪', required: true },
  { name: 'Aadhaar Card', desc: 'Identity proof', icon: '🪪', required: true },
  { name: 'Bank Account', desc: 'Business account (can open after)', icon: '🏦', required: true },
  { name: 'Address Proof', desc: 'Electricity bill / rent agreement', icon: '📍', required: true },
  { name: 'Business Address', desc: 'Shop/office address proof', icon: '🏢', required: false },
  { name: 'GST Number', desc: 'Can apply after registration', icon: '🔢', required: false },
];

export default function RegistrationPanel() {
  const { state, dispatch } = useBusiness();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState(state.brandingChoices?.name || '');
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!selectedType || !businessName) return;
    setGenerating(true);
    await new Promise(r => setTimeout(r, 2500));
    setGenerating(false);
    setDone(true);
    dispatch({ type: 'COMPLETE_MISSION', missionId: 'registration' });
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#6366F115' }}>
          <Building2 className="w-6 h-6" style={{ color: '#6366F1' }} />
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--primary)' }}>Business Registration</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Set up your legal entity — takes about 10 minutes</p>
        </div>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-2 mb-8">
        {['Type', 'Name', 'Documents', 'Done'].map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{
                background: i <= step ? '#6366F1' : 'var(--bg-elevated)',
                color: i <= step ? 'white' : 'var(--text-muted)',
              }}
            >
              {done && i < 3 ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
            </div>
            <span className="text-xs font-medium hidden sm:inline" style={{ color: i <= step ? '#6366F1' : 'var(--text-muted)' }}>{label}</span>
            {i < 3 && <div className="flex-1 h-0.5 rounded-full mx-2" style={{ background: i < step ? '#6366F1' : 'var(--border)' }} />}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--primary)' }}>Choose your business type</h3>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>For a chocolate bouquet business, Sole Proprietorship is the fastest and most cost-effective</p>
          <div className="space-y-3">
            {BUSINESS_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => { setSelectedType(type.id); setStep(1); }}
                className="w-full p-4 rounded-2xl flex items-center gap-4 text-left transition-all card-hover"
                style={{
                  background: selectedType === type.id ? '#6366F115' : 'var(--bg-surface)',
                  border: selectedType === type.id ? '2px solid #6366F1' : '1px solid var(--border)',
                }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: selectedType === type.id ? '#6366F1' : 'var(--bg-elevated)', color: selectedType === type.id ? 'white' : 'var(--text-muted)' }}>
                  {type.id === 'proprietorship' ? '👤' : type.id === 'partnership' ? '👥' : type.id === 'llp' ? '🔗' : '🏢'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold" style={{ color: 'var(--primary)' }}>{type.name}</p>
                    {type.popular && <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ background: '#10B98115', color: '#10B981' }}>Recommended</span>}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{type.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              </button>
            ))}
          </div>
          <button onClick={() => setStep(1)} className="mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
            I already have a registered business →
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="animate-fade-in">
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--primary)' }}>What's your business name?</h3>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>This will appear on all legal documents and invoices</p>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                placeholder="e.g., SweetLayer Gifts LLP"
                className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: 'var(--border)', color: 'var(--primary)' }}
              />
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Note: We'll verify name availability before filing</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Owner's Full Name</label>
                <input type="text" defaultValue="Your Name" className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2" style={{ borderColor: 'var(--border)', color: 'var(--primary)' }} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Mobile Number</label>
                <input type="tel" defaultValue="+91 " className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2" style={{ borderColor: 'var(--border)', color: 'var(--primary)' }} />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Business Address (Pune)</label>
              <textarea
                placeholder="Flat/Shop No., Building, Street, Area, Pincode"
                className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 resize-none"
                style={{ borderColor: 'var(--border)', color: 'var(--primary)' }}
                rows={2}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button onClick={() => setStep(0)} className="px-4 py-2 rounded-lg text-sm" style={{ color: 'var(--text-muted)' }}>← Back</button>
            <button
              onClick={() => { if (businessName) setStep(2); }}
              disabled={!businessName}
              className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all btn-press disabled:opacity-50"
              style={{ background: '#6366F1' }}
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-fade-in">
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--primary)' }}>Required documents</h3>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Upload from your device or phone — all accepted digitally</p>

          <div className="space-y-3 mb-6">
            {DOCS_NEEDED.map((doc) => (
              <div key={doc.name} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                <span className="text-2xl">{doc.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>{doc.name}</p>
                    {doc.required ? (
                      <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ background: '#EF444415', color: '#EF4444' }}>Required</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>Optional</span>
                    )}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{doc.desc}</p>
                </div>
                <button
                  className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{ background: doc.required ? 'var(--bg-elevated)' : 'transparent', color: doc.required ? 'var(--text-secondary)' : 'var(--text-muted)', border: doc.required ? '1px solid var(--border)' : 'none' }}
                >
                  {doc.required ? 'Upload' : 'Skip'}
                </button>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl flex items-center gap-3" style={{ background: '#6366F110', border: '1px solid #6366F130' }}>
            <Smartphone className="w-5 h-5" style={{ color: '#6366F1' }} />
            <div>
              <p className="text-xs font-semibold" style={{ color: '#6366F1' }}>Pro tip</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>You can submit Aadhaar eSign — no physical documents needed</p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button onClick={() => setStep(1)} className="px-4 py-2 rounded-lg text-sm" style={{ color: 'var(--text-muted)' }}>← Back</button>
            <button
              onClick={handleSubmit}
              disabled={generating}
              className="ml-auto flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all btn-press disabled:opacity-70"
              style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
            >
              {generating ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Filing registration...</>
              ) : (
                <><FileText className="w-4 h-4" /> File Registration</>
              )}
            </button>
          </div>
        </div>
      )}

      {done && (
        <div className="text-center py-8 animate-scale-in">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--secondary)' }}>
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--primary)' }}>Registration Submitted! 🎉</h3>
          <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Your {businessName} registration has been filed. You'll receive confirmation within 24 hours. Your Udyam number will be generated automatically.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="px-4 py-3 rounded-xl text-center" style={{ background: 'var(--bg-elevated)' }}>
              <p className="text-lg font-bold" style={{ color: '#6366F1' }}>24 hrs</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Estimated completion</p>
            </div>
            <div className="px-4 py-3 rounded-xl text-center" style={{ background: 'var(--bg-elevated)' }}>
              <p className="text-lg font-bold" style={{ color: '#6366F1' }}>₹0</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Udyam fee</p>
            </div>
            <button
              onClick={() => router.push('/build?mission=compliance')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white transition-all btn-press"
              style={{ background: 'var(--accent)' }}
            >
              Next: Compliance <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}