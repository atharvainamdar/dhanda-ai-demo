'use client';

import { useState } from 'react';
import { useBusiness } from '@/lib/store';
import { useRouter } from 'next/navigation';
import {
  Shield,
  CheckCircle2,
  FileText,
  MapPin,
  ChevronRight,
  Download,
  Loader2,
  ExternalLink,
} from 'lucide-react';

const REQUIREMENTS = [
  {
    id: 'udyam',
    name: 'Udyam Registration',
    desc: 'Required for small businesses, enables government benefits',
    required: true,
    cost: 'Free',
    time: '1-2 days',
    documents: ['Aadhaar Card', 'PAN Card', 'Business Address Proof'],
  },
  {
    id: 'shop',
    name: 'Shop & Establishment Act',
    desc: 'Required for any commercial establishment in Maharashtra',
    required: true,
    cost: '₹2,000',
    time: '3-5 days',
    documents: ['Address Proof', 'Owner ID', 'Business Photo'],
  },
  {
    id: 'gst',
    name: 'GST Registration',
    desc: 'Required if annual turnover exceeds ₹20 lakhs',
    required: false,
    cost: 'Free',
    time: '2-3 days',
    documents: ['PAN Card', 'Aadhaar', 'Bank Account Proof', 'Address Proof'],
  },
  {
    id: 'fssai',
    name: 'FSSAI License',
    desc: 'Required for food-related businesses',
    required: false,
    cost: '₹3,000',
    time: '7-14 days',
    documents: ['Food Safety Plan', 'Premises Photos', 'ID Proof'],
  },
];

export default function CompliancePanel() {
  const { state, dispatch } = useBusiness();
  const router = useRouter();
  const [generating, setGenerating] = useState<string | null>(null);
  const [generated, setGenerated] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleGenerate = async (id: string) => {
    setGenerating(id);
    await new Promise(r => setTimeout(r, 2000));
    setGenerating(null);
    setGenerated(prev => [...prev, id]);
    dispatch({ type: 'COMPLETE_MISSION', missionId: 'compliance' });
  };

  const handleContinue = () => {
    router.push('/build?mission=suppliers');
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#06B6D415' }}>
          <Shield className="w-6 h-6" style={{ color: '#06B6D4' }} />
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--primary)' }}>Compliance Specialist</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>All legal requirements for operating in Pune, Maharashtra</p>
        </div>
      </div>

      {/* Location context */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-8" style={{ background: '#06B6D410', border: '1px solid #06B6D430' }}>
        <MapPin className="w-4 h-4" style={{ color: '#06B6D4' }} />
        <span className="text-sm" style={{ color: '#06B6D4' }}>Analyzing requirements for <strong>Pune, Maharashtra</strong></span>
      </div>

      {/* Requirements */}
      <div className="space-y-4 mb-8">
        {REQUIREMENTS.map((req) => {
          const isGenerated = generated.includes(req.id);
          return (
            <div
              key={req.id}
              className="p-6 rounded-2xl transition-all"
              style={{
                background: 'var(--bg-surface)',
                border: isGenerated ? '1px solid var(--secondary)' : '1px solid var(--border)',
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: isGenerated ? 'var(--secondary-light)' : req.required ? '#06B6D415' : 'var(--bg-elevated)',
                    color: isGenerated ? 'var(--secondary)' : req.required ? '#06B6D4' : 'var(--text-muted)',
                  }}
                >
                  {isGenerated ? <CheckCircle2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold" style={{ color: 'var(--primary)' }}>{req.name}</h3>
                    {req.required ? (
                      <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ background: '#06B6D415', color: '#06B6D4' }}>Required</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>Optional</span>
                    )}
                  </div>
                  <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{req.desc}</p>

                  <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span>Cost: <strong style={{ color: 'var(--text-primary)' }}>{req.cost}</strong></span>
                    <span>Time: <strong style={{ color: 'var(--text-primary)' }}>{req.time}</strong></span>
                    <span>Documents: <strong style={{ color: 'var(--text-primary)' }}>{req.documents.length}</strong></span>
                  </div>

                  {isGenerated ? (
                    <div className="mt-4 flex items-center gap-3">
                      <span className="flex items-center gap-1 text-sm font-semibold" style={{ color: 'var(--secondary)' }}>
                        <CheckCircle2 className="w-4 h-4" /> Document ready
                      </span>
                      <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--secondary-light)', color: 'var(--secondary)' }}>
                        <Download className="w-3 h-3" /> Download
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleGenerate(req.id)}
                      disabled={generating !== null}
                      className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm text-white transition-all btn-press disabled:opacity-50"
                      style={{ background: '#06B6D4' }}
                    >
                      {generating === req.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Preparing Application...
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4" /> Prepare Application
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="rounded-2xl p-5 flex items-center justify-between" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <div>
          <p className="font-semibold" style={{ color: 'var(--primary)' }}>Compliance Summary</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {REQUIREMENTS.filter(r => r.required).length} required, {generated.filter(id => REQUIREMENTS.find(r => r.id === id)?.required).length} prepared
          </p>
        </div>
        {generated.filter(id => REQUIREMENTS.find(r => r.id === id)?.required).length >= 2 && (
          <button
            onClick={handleContinue}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all btn-press"
            style={{ background: 'var(--accent)' }}
          >
            Continue to Suppliers <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}