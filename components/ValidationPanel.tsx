'use client';

import { useEffect, useState } from 'react';
import { useBusiness } from '@/lib/store';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  TrendingUp,
  Users,
  IndianRupee,
  MapPin,
  Shield,
  Star,
  Loader2,
  ChevronRight,
  AlertTriangle,
  BarChart3,
  RefreshCcw,
} from 'lucide-react';

const VALIDATION_STEPS = [
  { id: 'idea', name: 'Idea Viability', score: 92, icon: '💡' },
  { id: 'market', name: 'Market Opportunity', score: 87, icon: '📊' },
  { id: 'location', name: 'Location Fit', score: 95, icon: '📍' },
  { id: 'competition', name: 'Competition Level', score: 78, icon: '⚔️' },
  { id: 'financial', name: 'Financial Feasibility', score: 88, icon: '💰' },
];

export default function ValidationPanel() {
  const { state, dispatch } = useBusiness();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [complete, setComplete] = useState(false);
  const [overallScore, setOverallScore] = useState(0);

  useEffect(() => {
    dispatch({ type: 'START_MISSION', missionId: 'research' });
    dispatch({ type: 'UPDATE_SPECIALIST', specialistId: 'market-research', status: 'working' });

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < VALIDATION_STEPS.length) {
        const targetScore = VALIDATION_STEPS[currentStep].score;
        setStep(currentStep);
        setScores(prev => {
          const updated = [...prev];
          updated[currentStep] = 0;
          return updated;
        });

        // Animate score
        let scoreProgress = 0;
        const scoreInterval = setInterval(() => {
          scoreProgress += targetScore / 25;
          if (scoreProgress >= targetScore) {
            scoreProgress = targetScore;
            clearInterval(scoreInterval);
          }
          setScores(prev => {
            const updated = [...prev];
            updated[currentStep] = Math.round(scoreProgress);
            return updated;
          });
        }, 80);

        currentStep++;
      } else {
        clearInterval(interval);
        setComplete(true);
        const finalScore = Math.round(VALIDATION_STEPS.reduce((sum, s) => sum + s.score, 0) / VALIDATION_STEPS.length);
        setOverallScore(finalScore);
        dispatch({ type: 'COMPLETE_MISSION', missionId: 'research' });
        dispatch({ type: 'UPDATE_MISSION', missionId: 'model', progress: 20, status: 'in-progress' });
        dispatch({ type: 'START_MISSION', missionId: 'model' });
      }
    }, 1800);

    return () => clearInterval(interval);
  }, [dispatch]);

  const riskFactors = [
    { text: 'Seasonal demand peaks in Dec-Feb — plan inventory accordingly', severity: 'low' },
    { text: '2 established competitors within 3km radius', severity: 'medium' },
    { text: 'Packaging costs may increase 15% in monsoon season', severity: 'low' },
  ];

  const positives = [
    'Rising demand for personalized gifting in Pune (23% YoY growth)',
    'Only 3 competitors offer online ordering in your area',
    'Your location has high foot traffic from residential colonies',
    'Estimated 18-day payback period (industry avg: 45 days)',
  ];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#8B5CF615' }}>
          <CheckCircle2 className="w-6 h-6" style={{ color: '#8B5CF6' }} />
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--primary)' }}>Business Validation</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Evaluating your idea across 5 dimensions</p>
        </div>
      </div>

      {/* Validation Steps */}
      <div className="space-y-4 mb-8">
        {VALIDATION_STEPS.map((validation, i) => {
          const animatedScore = scores[i] || 0;
          const isActive = i === step && !complete;
          const isDone = i < step || complete;

          return (
            <div
              key={validation.id}
              className="p-5 rounded-2xl transition-all"
              style={{
                background: isActive ? '#8B5CF615' : isDone ? 'var(--bg-surface)' : 'var(--bg-surface)',
                border: isActive ? '2px solid #8B5CF640' : '1px solid var(--border)',
              }}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: isDone ? 'var(--secondary-light)' : isActive ? '#8B5CF620' : 'var(--bg-elevated)' }}>
                  {isDone ? <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--secondary)' }} /> : validation.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>{validation.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {isActive && !isDone ? 'Analyzing...' : isDone ? 'Validated' : 'Pending'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {(isActive || isDone) && (
                    <div className="w-32 h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${animatedScore}%`,
                          background: animatedScore >= 85 ? 'var(--secondary)' : animatedScore >= 70 ? '#8B5CF6' : 'var(--warning)',
                        }}
                      />
                    </div>
                  )}
                  <span
                    className="text-lg font-bold w-12 text-right"
                    style={{
                      color: animatedScore >= 85 ? 'var(--secondary)' : animatedScore >= 70 ? '#8B5CF6' : 'var(--warning)',
                    }}
                  >
                    {animatedScore}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall Result */}
      {complete && (
        <div className="animate-fade-in-up">
          {/* Overall Score */}
          <div className="rounded-2xl p-8 mb-6 text-center" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Overall Validation Score</p>
            <div className="inline-flex items-baseline gap-2">
              <span className="text-6xl font-extrabold" style={{ color: overallScore >= 85 ? 'var(--secondary)' : 'var(--warning)' }}>
                {overallScore}%
              </span>
              <span className="text-xl" style={{ color: 'var(--secondary)' }}>✓</span>
            </div>
            <p className="text-sm mt-2 font-medium" style={{ color: overallScore >= 85 ? 'var(--secondary)' : 'var(--warning)' }}>
              {overallScore >= 85 ? 'Your business idea is strongly validated' : 'Your idea shows promise with some areas to address'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Positives */}
            <div className="rounded-2xl p-6" style={{ background: 'var(--secondary-light)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4" style={{ color: 'var(--secondary)' }} />
                <h3 className="text-sm font-bold" style={{ color: 'var(--secondary)' }}>Opportunities</h3>
              </div>
              <div className="space-y-2.5">
                {positives.map((p, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--secondary)' }} />
                    <p className="text-xs" style={{ color: 'var(--text-primary)' }}>{p}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk factors */}
            <div className="rounded-2xl p-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4" style={{ color: 'var(--warning)' }} />
                <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Things to Note</h3>
              </div>
              <div className="space-y-2.5">
                {riskFactors.map((r, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className={`w-5 h-5 rounded flex items-center justify-center text-xs ${
                      r.severity === 'low' ? 'bg-yellow-100 text-yellow-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      !
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center justify-between p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg, #8B5CF6, #10B981)', color: 'white' }}>
            <div>
              <p className="font-bold text-lg">Your business is validated! 🎉</p>
              <p className="text-sm opacity-80 mt-1">Time to build it. Move to the Build phase to start creating.</p>
            </div>
            <button
              onClick={() => {
                dispatch({ type: 'SET_PHASE', phase: 'build' });
                router.push('/build');
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-[#8B5CF6] bg-white transition-all btn-press"
            >
              Start Building <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}