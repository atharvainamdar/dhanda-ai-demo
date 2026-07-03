'use client';

import { useState } from 'react';
import { useBusiness } from '@/lib/store';
import { useRouter } from 'next/navigation';
import {
  Palette,
  CheckCircle2,
  ChevronRight,
  Star,
  Type,
  Layers,
  Package,
} from 'lucide-react';

const BRAND_NAMES = [
  'SweetLayer', 'BloomBox', 'CocoCraft', 'TreatNest',
  'GiftNest', 'SugarArt', 'ChocoJoy', 'BouquetBar',
  'GiftingCraft', 'IndulgeBox', 'SugarNest', 'CraveCraft',
];

const LOGO_STYLES = [
  { id: 'minimal', name: 'Minimal', desc: 'Clean & modern', color: '#1A1A2E' },
  { id: 'floral', name: 'Floral', desc: 'Nature-inspired', color: '#10B981' },
  { id: 'luxury', name: 'Luxury', desc: 'Premium feel', color: '#F97316' },
  { id: 'playful', name: 'Playful', desc: 'Fun & vibrant', color: '#EC4899' },
  { id: 'rustic', name: 'Rustic', desc: 'Artisanal charm', color: '#92400E' },
  { id: 'modern', name: 'Modern', desc: 'Bold geometry', color: '#3B82F6' },
];

const BRAND_IDENTITIES = [
  { name: 'Warm Gifter', colors: ['#F97316', '#FEF3C7', '#92400E'], desc: 'For someone who loves thoughtful, heartfelt gifts' },
  { name: 'Premium Celebrator', colors: ['#1A1A2E', '#D4AF37', '#FFFFFF'], desc: 'For celebrations and special occasions' },
  { name: 'Everyday Sweetness', colors: ['#EC4899', '#FCE7F3', '#9D174D'], desc: 'Accessible, delightful, daily treat' },
  { name: 'Eco Conscious', colors: ['#10B981', '#D1FAE5', '#065F46'], desc: 'Sustainable and nature-friendly' },
];

export default function BrandingPanel() {
  const { state, dispatch } = useBusiness();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null);
  const [selectedIdentity, setSelectedIdentity] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleNext = () => {
    if (step === 0 && selectedName) setStep(1);
    else if (step === 1 && selectedLogo) setStep(2);
    else if (step === 2 && selectedIdentity !== null) {
      setIsGenerating(true);
      setTimeout(() => {
        setIsGenerating(false);
        dispatch({ type: 'SET_BRAND_CHOICES', choices: { name: selectedName!, logoStyle: selectedLogo!, brandIdentity: BRAND_IDENTITIES[selectedIdentity!].name } });
        dispatch({ type: 'COMPLETE_MISSION', missionId: 'branding' });
        router.push('/build?mission=suppliers');
      }, 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#EC489915' }}>
          <Palette className="w-6 h-6" style={{ color: '#EC4899' }} />
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--primary)' }}>Branding Specialist</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Based on your audience and business type, I've prepared...</p>
        </div>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-2 mb-8">
        {['Name', 'Logo Style', 'Brand Identity'].map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{
                background: i <= step ? '#EC4899' : 'var(--bg-elevated)',
                color: i <= step ? 'white' : 'var(--text-muted)',
              }}
            >
              {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
            </div>
            <span className="text-xs font-medium hidden sm:inline" style={{ color: i <= step ? '#EC4899' : 'var(--text-muted)' }}>{label}</span>
            {i < 2 && <div className="flex-1 h-0.5 rounded-full mx-2" style={{ background: i < step ? '#EC4899' : 'var(--border)' }} />}
          </div>
        ))}
      </div>

      {/* Step 0: Names */}
      {step === 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--primary)' }}>12 Names to Choose From</h3>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>AI-generated based on your business and target audience</p>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {BRAND_NAMES.map((name) => (
              <button
                key={name}
                onClick={() => setSelectedName(name)}
                className="p-4 rounded-xl text-center transition-all btn-press"
                style={{
                  background: selectedName === name ? '#EC489915' : 'var(--bg-surface)',
                  border: selectedName === name ? '2px solid #EC4899' : '1px solid var(--border)',
                }}
              >
                <span className="text-sm font-bold" style={{ color: selectedName === name ? '#EC4899' : 'var(--primary)' }}>{name}</span>
                {selectedName === name && <CheckCircle2 className="w-4 h-4 mx-auto mt-2" style={{ color: '#EC4899' }} />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Logo styles */}
      {step === 1 && (
        <div>
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--primary)' }}>6 Logo Directions</h3>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Each direction represents a different personality for your brand</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {LOGO_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedLogo(style.id)}
                className="p-6 rounded-xl text-center transition-all btn-press"
                style={{
                  background: selectedLogo === style.id ? '#EC489915' : 'var(--bg-surface)',
                  border: selectedLogo === style.id ? '2px solid #EC4899' : '1px solid var(--border)',
                }}
              >
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: `${style.color}15` }}>
                  <div className="w-8 h-8 rounded-lg" style={{ background: style.color }} />
                </div>
                <p className="text-sm font-bold" style={{ color: 'var(--primary)' }}>{style.name}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{style.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Brand identity */}
      {step === 2 && (
        <div>
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--primary)' }}>4 Brand Identities</h3>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Choose the personality that best represents your business</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BRAND_IDENTITIES.map((identity, i) => (
              <button
                key={identity.name}
                onClick={() => setSelectedIdentity(i)}
                className="p-5 rounded-xl text-left transition-all btn-press"
                style={{
                  background: selectedIdentity === i ? '#EC489915' : 'var(--bg-surface)',
                  border: selectedIdentity === i ? '2px solid #EC4899' : '1px solid var(--border)',
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex gap-1">
                    {identity.colors.map((c, ci) => (
                      <div key={ci} className="w-8 h-8 rounded-lg" style={{ background: c }} />
                    ))}
                  </div>
                  <p className="text-sm font-bold" style={{ color: 'var(--primary)' }}>{identity.name}</p>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{identity.desc}</p>
                {selectedIdentity === i && (
                  <div className="mt-3 flex items-center gap-1 text-xs font-semibold" style={{ color: '#EC4899' }}>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            ← Back
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={
            (step === 0 && !selectedName) ||
            (step === 1 && !selectedLogo) ||
            (step === 2 && selectedIdentity === null) ||
            isGenerating
          }
          className="ml-auto flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white transition-all btn-press disabled:opacity-50"
          style={{ background: '#EC4899' }}
        >
          {isGenerating ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : step === 2 ? (
            'Apply & Continue'
          ) : (
            <>Continue <ChevronRight className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </div>
  );
}