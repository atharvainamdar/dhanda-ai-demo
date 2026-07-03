'use client';

import { useEffect, useState } from 'react';
import { useBusiness } from '@/lib/store';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  TrendingUp,
  Users,
  IndianRupee,
  MapPin,
  CheckCircle2,
  Circle,
  Loader2,
  ChevronRight,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Globe,
  Target,
} from 'lucide-react';

type TaskItem = { id: string; name: string; status: 'pending' | 'completed' };

const TASKS: TaskItem[] = [
  { id: 'competitors', name: 'Competitor Analysis', status: 'pending' },
  { id: 'demand', name: 'Demand Analysis', status: 'pending' },
  { id: 'personas', name: 'Customer Personas', status: 'pending' },
  { id: 'pricing', name: 'Pricing Strategy', status: 'pending' },
  { id: 'suppliers', name: 'Supplier Landscape', status: 'pending' },
];

const LOGS = [
  'Initializing market research specialist...',
  'Setting up Pune location context...',
  'Searching nearby competitors...',
  'Finding market size for chocolate bouquets...',
  'Analyzing customer reviews from top shops...',
  'Reading Reddit discussions on gifting trends...',
  'Checking seasonal demand patterns...',
  'Compiling pricing benchmarks...',
  'Identifying supplier opportunities...',
  'Cross-referencing social media sentiment...',
  'Building customer persona models...',
  'Generating market opportunity score...',
  'Research complete. Preparing summary...',
];

export default function MarketResearchPanel() {
  const { state, dispatch } = useBusiness();
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [tasks, setTasks] = useState<TaskItem[]>(TASKS.map(t => ({ ...t })));
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    // Start the research simulation
    dispatch({ type: 'START_MISSION', missionId: 'validation' });
    dispatch({ type: 'UPDATE_SPECIALIST', specialistId: 'market-research', status: 'working', progress: 0 });

    let logIndex = 0;
    let progressInterval: ReturnType<typeof setInterval>;
    let logInterval: ReturnType<typeof setInterval>;

    // Progress simulation
    progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const increment = prev < 30 ? 3 : prev < 60 ? 2 : prev < 85 ? 1.5 : 1;
        return Math.min(100, prev + increment);
      });
    }, 200);

    // Log simulation
    logInterval = setInterval(() => {
      if (logIndex < LOGS.length) {
        setVisibleLogs(prev => [...prev, LOGS[logIndex]]);
        logIndex++;
      } else {
        clearInterval(logInterval);
      }
    }, 600);

    // Task completion simulation
    const taskTimeouts = [
      setTimeout(() => setTasks(prev => prev.map(t => t.id === 'competitors' ? { ...t, status: 'completed' as const } : t)), 3000),
      setTimeout(() => setTasks(prev => prev.map(t => t.id === 'demand' ? { ...t, status: 'completed' as const } : t)), 5500),
      setTimeout(() => setTasks(prev => prev.map(t => t.id === 'personas' ? { ...t, status: 'completed' as const } : t)), 8000),
      setTimeout(() => setTasks(prev => prev.map(t => t.id === 'pricing' ? { ...t, status: 'completed' as const } : t)), 11000),
      setTimeout(() => setTasks(prev => prev.map(t => t.id === 'suppliers' ? { ...t, status: 'completed' as const } : t)), 15000),
      setTimeout(() => {
        setComplete(true);
        dispatch({ type: 'UPDATE_MISSION', missionId: 'validation', progress: 100, status: 'completed' });
        dispatch({ type: 'COMPLETE_MISSION', missionId: 'validation' });
        dispatch({ type: 'START_MISSION', missionId: 'research' });
        dispatch({ type: 'UPDATE_SPECIALIST', specialistId: 'market-research', status: 'ready', progress: 100 });
      }, 16000),
    ];

    return () => {
      clearInterval(progressInterval);
      clearInterval(logInterval);
      taskTimeouts.forEach(clearTimeout);
    };
  }, [dispatch]);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#8B5CF615' }}>
          <BarChart3 className="w-6 h-6" style={{ color: '#8B5CF6' }} />
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--primary)' }}>Market Research</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Analyzing your business opportunity in real-time</p>
        </div>
        {complete && (
          <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold animate-scale-in" style={{ background: 'var(--secondary-light)', color: 'var(--secondary)' }}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            Research Complete
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>Research Progress</span>
          <span className="text-lg font-mono font-bold" style={{ color: '#8B5CF6' }}>{Math.round(progress)}%</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: '#8B5CF615' }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #8B5CF6, #A78BFA, #10B981)',
            }}
          />
        </div>
        <div className="flex items-center gap-2 mt-3">
          {complete ? (
            <span className="text-xs" style={{ color: 'var(--secondary)' }}>
              All research tasks completed successfully
            </span>
          ) : (
            <>
              <Loader2 className="w-3 h-3 animate-spin" style={{ color: '#8B5CF6' }} />
              <span className="text-xs" style={{ color: '#8B5CF6' }}>Researching in progress...</span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks */}
        <div className="rounded-2xl p-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--primary)' }}>Current Tasks</h3>
          <div className="space-y-3">
            {tasks.map((task, i) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 rounded-xl transition-all"
                style={{
                  background: task.status === 'completed' ? 'var(--secondary-light)' : 'var(--bg-elevated)',
                  opacity: task.status === 'completed' ? 0.8 : 1,
                  animationDelay: `${i * 100}ms`,
                }}
              >
                {task.status === 'completed' ? (
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--secondary)' }} />
                ) : task.status === 'pending' && progress > (i * 20) ? (
                  <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#8B5CF6' }} />
                ) : (
                  <Circle className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--border)' }} />
                )}
                <span
                  className="text-sm font-medium"
                  style={{ color: task.status === 'completed' ? 'var(--secondary)' : 'var(--text-primary)' }}
                >
                  {task.name}
                </span>
                {task.status === 'completed' && (
                  <span className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>Done</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Live Logs */}
        <div className="rounded-2xl p-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#8B5CF6' }} />
            <h3 className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>Live Research Logs</h3>
          </div>
          <div className="space-y-1.5 h-[280px] overflow-y-auto pr-2">
            {visibleLogs.map((log, i) => (
              <div
                key={i}
                className="text-xs font-mono px-3 py-1.5 rounded-lg animate-fade-in"
                style={{
                  color: '#8B5CF6',
                  background: '#8B5CF608',
                  animationDelay: `${i * 50}ms`,
                }}
              >
                <span style={{ color: 'var(--text-muted)' }}>$ </span>
                {log}
              </div>
            ))}
            {!complete && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>$</span>
                <span className="inline-block w-2 h-4 rounded-sm animate-pulse" style={{ background: '#8B5CF6' }} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results preview */}
      {complete && (
        <div className="mt-6 rounded-2xl p-6 animate-fade-in-up" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-5 h-5" style={{ color: '#8B5CF6' }} />
            <h3 className="text-lg font-bold" style={{ color: 'var(--primary)' }}>Research Results</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Market Size', value: '₹120Cr', sub: 'Pune gifting market', up: true },
              { label: 'Competitors', value: '23', sub: 'In your area', up: false },
              { label: 'Opportunity', value: 'High', sub: 'Top 15% tier', up: true },
              { label: 'Investment', value: '₹73,400', sub: 'Recommended budget', up: null },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-xl text-center" style={{ background: 'var(--bg-elevated)' }}>
                <div className="flex items-center justify-center gap-1 mb-1">
                  {stat.up !== null && (
                    stat.up ? (
                      <ArrowUpRight className="w-4 h-4" style={{ color: 'var(--secondary)' }} />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" style={{ color: 'var(--danger)' }} />
                    )
                  )}
                  <span className="text-xl font-bold" style={{ color: 'var(--primary)' }}>{stat.value}</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.sub}</p>
                <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: '#8B5CF610', border: '1px solid #8B5CF630' }}>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#8B5CF6' }}>Business Validation</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Your chocolate bouquet idea has a strong opportunity score</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-2xl font-bold" style={{ color: '#8B5CF6' }}>98%</span>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Validation Score</p>
              </div>
              <button
                onClick={() => router.push('/dream?mission=research')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all btn-press"
                style={{ background: '#8B5CF6' }}
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}