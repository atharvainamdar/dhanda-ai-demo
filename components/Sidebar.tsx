'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useBusiness } from '@/lib/store';
import {
  Sparkles,
  Brain,
  Hammer,
  TrendingUp,
  CheckCircle2,
  Circle,
  ChevronRight,
  Home,
  Building2,
  DollarSign,
  Palette,
  Truck,
  Globe,
  Megaphone,
  Settings,
  Rocket,
  Users,
  MessageSquare,
  BarChart3,
  Crown,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Phase, Mission } from '@/types';

const phaseConfig = {
  dream: {
    label: 'Dream',
    icon: Brain,
    color: '#8B5CF6',
    description: 'Turn your idea into a validated business',
  },
  build: {
    label: 'Build',
    icon: Hammer,
    color: '#F97316',
    description: 'Construct every piece of your business',
  },
  grow: {
    label: 'Grow',
    icon: TrendingUp,
    color: '#10B981',
    description: 'Scale with AI-powered operations',
  },
};

const missionIcons: Record<string, React.ReactNode> = {
  'idea': <Sparkles className="w-4 h-4" />,
  'validation': <CheckCircle2 className="w-4 h-4" />,
  'research': <BarChart3 className="w-4 h-4" />,
  'model': <Building2 className="w-4 h-4" />,
  'funding': <DollarSign className="w-4 h-4" />,
  'registration': <Building2 className="w-4 h-4" />,
  'compliance': <CheckCircle2 className="w-4 h-4" />,
  'branding': <Palette className="w-4 h-4" />,
  'suppliers': <Truck className="w-4 h-4" />,
  'website': <Globe className="w-4 h-4" />,
  'payments': <DollarSign className="w-4 h-4" />,
  'launch': <Rocket className="w-4 h-4" />,
  'marketing': <Megaphone className="w-4 h-4" />,
  'sales': <TrendingUp className="w-4 h-4" />,
  'finance-ops': <DollarSign className="w-4 h-4" />,
  'ops': <Settings className="w-4 h-4" />,
  'support': <MessageSquare className="w-4 h-4" />,
  'analytics': <BarChart3 className="w-4 h-4" />,
};

function PhaseSection({ phase, missions, currentPath }: { phase: Phase; missions: Mission[]; currentPath: string }) {
  const [open, setOpen] = useState(true);
  const config = phaseConfig[phase];
  const Icon = config.icon;
  const phaseMissions = missions.filter(m => m.phase === phase);
  const completedCount = phaseMissions.filter(m => m.status === 'completed').length;
  const activeMission = phaseMissions.find(m => m.status === 'in-progress');
  const isComplete = completedCount === phaseMissions.length;

  const phasePath = `/${phase}`;
  const isActive = currentPath.startsWith(phasePath);

  return (
    <div className="mb-2">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group"
        style={{
          background: isActive ? `${config.color}15` : 'transparent',
          color: isActive ? config.color : 'var(--text-secondary)',
        }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
          style={{
            background: isComplete ? 'var(--secondary)' : isActive ? config.color : 'var(--bg-elevated)',
            color: isComplete || isActive ? 'white' : 'var(--text-muted)',
          }}
        >
          {isComplete ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold">{config.label}</p>
          <p className="text-xs mt-0.5 opacity-70">{completedCount}/{phaseMissions.length} complete</p>
        </div>
        <ChevronDown
          className="w-4 h-4 transition-transform"
          style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)' }}
        />
      </button>

      {open && (
        <div className="ml-4 mt-1 space-y-0.5">
          {phaseMissions.map((mission) => {
            const isMissionActive = currentPath.includes(mission.id);
            return (
              <Link
                key={mission.id}
                href={`/${phase}?mission=${mission.id}`}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all"
                style={{
                  background: isMissionActive ? `${config.color}15` : 'transparent',
                  color: isMissionActive ? config.color : mission.status === 'completed' ? 'var(--text-muted)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                }}
              >
                {mission.status === 'completed' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--secondary)' }} />
                ) : mission.status === 'in-progress' ? (
                  <div className="w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 animate-pulse" style={{ borderColor: config.color }} />
                ) : (
                  <Circle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--border)' }} />
                )}
                <span className={`text-xs ${mission.status === 'completed' ? 'line-through' : ''}`}>{mission.name}</span>
                {mission.status === 'in-progress' && mission.progress > 0 && (
                  <span className="ml-auto text-xs font-mono" style={{ color: config.color }}>{mission.progress}%</span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const { state } = useBusiness();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const pendingApprovals = state.approvals.filter(a => a.status === 'pending').length;

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
        style={{ background: 'var(--bg-surface)' }}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className="fixed top-0 left-0 h-screen flex flex-col z-40 transition-transform duration-300"
        style={{
          width: '280px',
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border)',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(0)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)' }}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-sm" style={{ color: 'var(--primary)' }}>DhandaAI</span>
              {state.idea && (
                <p className="text-xs mt-0.5 max-w-[160px] truncate" style={{ color: 'var(--text-muted)' }}>
                  {state.idea}
                </p>
              )}
            </div>
          </Link>
        </div>

        {/* Phase navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="mb-4">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
              style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
          </div>

          <PhaseSection phase="dream" missions={state.missions} currentPath={pathname} />
          <PhaseSection phase="build" missions={state.missions} currentPath={pathname} />
          <PhaseSection phase="grow" missions={state.missions} currentPath={pathname} />

          {/* Approval Center (Grow phase) */}
          {pendingApprovals > 0 && (
            <Link
              href="/grow?tab=approvals"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg mt-4 transition-all card-hover"
              style={{
                background: 'var(--accent-light)',
                color: 'var(--accent)',
                textDecoration: 'none',
                border: '1px solid rgba(249,115,22,0.2)',
              }}
            >
              <Crown className="w-4 h-4" />
              <span className="text-sm font-semibold">Approval Center</span>
              <span
                className="ml-auto w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white"
                style={{ background: 'var(--accent)' }}
              >
                {pendingApprovals}
              </span>
            </Link>
          )}
        </div>

        {/* Bottom - Business status */}
        <div className="px-4 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
          {state.launched ? (
            <div className="px-3 py-2.5 rounded-lg" style={{ background: 'var(--secondary-light)' }}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: 'var(--secondary)' }} />
                <span className="text-xs font-semibold" style={{ color: 'var(--secondary)' }}>Business Live</span>
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                Revenue: ₹{state.metrics.revenue.toLocaleString()}
              </p>
            </div>
          ) : (
            <div className="px-3 py-2.5 rounded-lg" style={{ background: 'var(--bg-elevated)' }}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: 'var(--warning)' }} />
                <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Building...</span>
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Phase: {phaseConfig[state.phase].label}</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}