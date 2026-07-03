'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  BarChart3,
  DollarSign,
  Shield,
  Package,
  Globe,
  Megaphone,
  CheckCircle2,
  Circle,
  GripVertical,
  ArrowRight,
  Zap,
  Clock,
  TrendingUp,
  AlertTriangle,
  Plus,
  X,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  RefreshCcw,
} from 'lucide-react';

// Draggable card for spatial workspace
interface WorkspaceCard {
  id: string;
  type: 'mission' | 'agent' | 'insight' | 'action' | 'document';
  title: string;
  subtitle?: string;
  status?: 'pending' | 'active' | 'done' | 'alert';
  progress?: number;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content?: React.ReactNode;
  wireTo?: string[];
}

// Mission node for the spatial canvas
function SpatialCard({
  card,
  onSelect,
  selected,
  onWireStart,
  wiringFrom,
}: {
  card: WorkspaceCard;
  onSelect: (id: string) => void;
  selected: boolean;
  onWireStart: (id: string) => void;
  wiringFrom: string | null;
}) {
  const getStatusIcon = () => {
    switch (card.status) {
      case 'done': return <CheckCircle2 className="w-4 h-4" style={{ color: '#10B981' }} />;
      case 'active': return <div className="w-3 h-3 rounded-full border-2 animate-pulse" style={{ borderColor: card.color }} />;
      case 'alert': return <AlertTriangle className="w-4 h-4" style={{ color: '#EF4444' }} />;
      default: return <Circle className="w-3 h-3" style={{ color: 'var(--border)' }} />;
    }
  };

  return (
    <div
      onClick={() => onSelect(card.id)}
      className={`absolute rounded-xl cursor-pointer transition-all duration-200 ${selected ? 'z-20' : 'z-10'}`}
      style={{
        left: card.x,
        top: card.y,
        width: card.width,
        minHeight: card.height,
        background: 'var(--bg-surface)',
        border: selected ? `2px solid ${card.color}` : '1px solid var(--border)',
        boxShadow: selected
          ? `0 8px 30px rgba(0,0,0,0.12), 0 0 0 4px ${card.color}20`
          : '0 2px 8px rgba(0,0,0,0.06)',
        transform: selected ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      {/* Drag handle */}
      <div className="flex items-center gap-1 px-3 pt-2 pb-1 cursor-grab">
        <GripVertical className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
        <div className="w-2 h-2 rounded-full" style={{ background: card.color }} />
        <span className="text-[10px] font-semibold uppercase tracking-wider ml-auto" style={{ color: card.color }}>
          {card.type}
        </span>
      </div>

      <div className="px-3 pb-3">
        <div className="flex items-start gap-2">
          {getStatusIcon()}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold leading-tight truncate" style={{ color: 'var(--primary)' }}>{card.title}</p>
            {card.subtitle && (
              <p className="text-[10px] mt-0.5 leading-tight truncate" style={{ color: 'var(--text-muted)' }}>{card.subtitle}</p>
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onWireStart(card.id); }}
            className="w-5 h-5 rounded flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            style={{ color: 'var(--text-muted)' }}
            title="Connect to another card"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Progress bar */}
        {card.progress !== undefined && card.status !== 'done' && (
          <div className="mt-2">
            <div className="h-1 rounded-full overflow-hidden" style={{ background: `${card.color}20` }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${card.progress}%`, background: card.color }}
              />
            </div>
            <span className="text-[10px] font-mono mt-1 block" style={{ color: card.color }}>{card.progress}%</span>
          </div>
        )}

        {/* Wire button */}
        <button
          onClick={(e) => { e.stopPropagation(); onWireStart(card.id); }}
          className="mt-2 flex items-center gap-1 text-[10px] font-medium transition-all opacity-0 hover:opacity-100"
          style={{ color: card.color }}
        >
          <Zap className="w-2.5 h-2.5" /> Connect
        </button>
      </div>
    </div>
  );
}

// Wire line between cards
function WireLine({ from, to }: { from: { x: number; y: number }; to: { x: number; y: number } }) {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;

  return (
    <svg
      className="absolute pointer-events-none z-0"
      style={{ overflow: 'visible' }}
    >
      <path
        d={`M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`}
        fill="none"
        stroke="url(#wireGradient)"
        strokeWidth="2"
        strokeDasharray="4 3"
        opacity="0.5"
      />
      <defs>
        <linearGradient id="wireGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Timeline view — horizontal scrolling journey
function JourneyTimeline({ missions, currentPhase }: { missions: any[]; currentPhase: string }) {
  const phaseColors: Record<string, string> = {
    dream: '#8B5CF6',
    build: '#F97316',
    grow: '#10B981',
  };

  const phaseLabels: Record<string, string> = {
    dream: 'Dream',
    build: 'Build',
    grow: 'Grow',
  };

  return (
    <div className="mb-6 overflow-x-auto pb-2">
      <div className="flex items-center gap-0 min-w-max">
        {['dream', 'build', 'grow'].map((phase, phaseIdx) => {
          const phaseMissions = missions.filter(m => m.phase === phase);
          const completed = phaseMissions.filter(m => m.status === 'completed').length;
          const isActive = currentPhase === phase;
          const color = phaseColors[phase];

          return (
            <React.Fragment key={phase}>
              {phaseIdx > 0 && (
                <div className="flex items-center">
                  <div className="w-8 h-0.5" style={{ background: isActive || currentPhase > phase ? color : 'var(--border)' }} />
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: isActive || currentPhase > phase ? color : 'var(--bg-elevated)', color: isActive || currentPhase > phase ? 'white' : 'var(--text-muted)' }}
                  >
                    {completed}/{phaseMissions.length}
                  </div>
                  <div className="w-8 h-0.5" style={{ background: 'var(--border)' }} />
                </div>
              )}
              <div
                className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: isActive ? `${color}15` : 'var(--bg-surface)',
                  color: isActive ? color : 'var(--text-muted)',
                  border: `1px solid ${isActive ? `${color}40` : 'var(--border)'}`,
                }}
              >
                {phaseLabels[phase]}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// Agent activity panel
function AgentActivityPanel({ agentId, agentName, color }: { agentId: string; agentName: string; color: string }) {
  const [expanded, setExpanded] = useState(false);
  const activities = [
    { time: '2m ago', action: 'Analyzed competitor SweetTreats pricing', type: 'info' },
    { time: '5m ago', action: 'Found supplier with 12% lower cost', type: 'success' },
    { time: '12m ago', action: 'Calculated break-even at 18 days', type: 'success' },
    { time: '18m ago', action: 'Started market research', type: 'progress' },
  ];

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3 transition-all"
        style={{ background: expanded ? `${color}08` : 'transparent' }}
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15`, color }}>
          <Brain className="w-4 h-4" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-bold" style={{ color: 'var(--primary)' }}>{agentName}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>4 activities this session</p>
        </div>
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: color }} />
        {expanded ? <ChevronRight className="w-4 h-4 rotate-90" style={{ color }} /> : <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />}
      </button>

      {expanded && (
        <div className="px-4 pb-3 space-y-2 animate-fade-in">
          {activities.map((activity, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <Clock className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
              <span className="font-mono flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{activity.time}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{activity.action}</span>
              <div className="ml-auto">
                {activity.type === 'success' && <CheckCircle2 className="w-3 h-3" style={{ color: '#10B981' }} />}
                {activity.type === 'progress' && <div className="w-3 h-3 rounded-full border border-t-transparent animate-spin" style={{ borderColor: color }} />}
                {activity.type === 'info' && <BarChart3 className="w-3 h-3" style={{ color }} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Brain icon for activity panel
function Brain(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
    </svg>
  );
}

export default function WorkspaceCanvas() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [view, setView] = useState<'spatial' | 'timeline' | 'agents'>('timeline');
  const [session, setSession] = useState<{
    messages: { role: 'user' | 'ai'; content: string; time: Date; tokens?: number; confidence?: number }[];
    agents: { id: string; name: string; color: string; status: 'idle' | 'thinking' | 'done'; logs: { time: Date; text: string }[] }[];
    activeAgent: string | null;
  }>({
    messages: [],
    agents: [
      { id: 'market-research', name: 'Market Research', color: '#8B5CF6', status: 'thinking', logs: [{ time: new Date(), text: 'Scanning 23 competitors within 8km...' }] },
      { id: 'finance', name: 'Finance Advisor', color: '#10B981', status: 'idle', logs: [] },
      { id: 'compliance', name: 'Compliance Officer', color: '#06B6D4', status: 'idle', logs: [] },
      { id: 'branding', name: 'Brand Strategist', color: '#EC4899', status: 'idle', logs: [] },
    ],
    activeAgent: null,
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [displayedResponse, setDisplayedResponse] = useState('');

  const handleSend = async () => {
    if (!inputMessage.trim()) return;
    const userMsg = inputMessage.trim();
    setInputMessage('');
    setSession(s => ({ ...s, messages: [...s.messages, { role: 'user', content: userMsg, time: new Date() }] }));
    setIsStreaming(true);
    setDisplayedResponse('');

    // Find the right response
    const response = userMsg.toLowerCase().includes('chocolate')
      ? "Amazing. I'll help you build this chocolate bouquet business. Let me research your market in real-time while we talk. I'm activating 3 specialized agents to work on this simultaneously."
      : "I understand you're interested in starting a business. To give you the most accurate guidance, could you tell me: Is this a product-based business (you make/sell something physical) or service-based?";

    // Stream the response token by token
    const words = response.split(' ');
    let current = '';
    for (const word of words) {
      await new Promise(r => setTimeout(r, 35));
      current += word + ' ';
      setDisplayedResponse(current);
    }

    setSession(s => ({
      ...s,
      messages: [...s.messages, { role: 'ai', content: response, time: new Date(), confidence: 0.87 }],
    }));
    setIsStreaming(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* View switcher */}
      <div className="flex items-center gap-1 p-1 rounded-xl inline-flex mb-4 self-start" style={{ background: 'var(--bg-elevated)' }}>
        {[
          { id: 'timeline', label: 'Journey' },
          { id: 'spatial', label: 'Canvas' },
          { id: 'agents', label: 'Agents' },
        ].map(v => (
          <button
            key={v.id}
            onClick={() => setView(v.id as any)}
            className="px-4 py-2 rounded-lg text-xs font-medium transition-all"
            style={{
              background: view === v.id ? 'var(--bg-surface)' : 'transparent',
              color: view === v.id ? 'var(--primary)' : 'var(--text-muted)',
              boxShadow: view === v.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            {v.label}
          </button>
        ))}
      </div>

      {view === 'spatial' && (
        <div className="relative flex-1 rounded-2xl overflow-hidden" style={{ background: 'var(--bg-elevated)', minHeight: '400px', border: '1px solid var(--border)' }}>
          {/* Grid background */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(139,92,246,0.1) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }} />

          {/* Mission cards positioned spatially */}
          <SpatialCard
            card={{ id: 'idea', type: 'mission', title: 'Business Idea', subtitle: 'Chocolate bouquet in Pune', status: 'done', color: '#8B5CF6', x: 40, y: 40, width: 160, height: 80 }}
            onSelect={setSelectedCard}
            selected={selectedCard === 'idea'}
            onWireStart={() => {}}
            wiringFrom={null}
          />
          <SpatialCard
            card={{ id: 'validation', type: 'mission', title: 'Market Research', subtitle: '87% opportunity score', status: 'active', progress: 65, color: '#8B5CF6', x: 240, y: 60, width: 180, height: 100 }}
            onSelect={setSelectedCard}
            selected={selectedCard === 'validation'}
            onWireStart={() => {}}
            wiringFrom={null}
          />
          <SpatialCard
            card={{ id: 'finance', type: 'mission', title: 'Finance Advisor', subtitle: 'Est. ₹73,400 needed', status: 'pending', color: '#10B981', x: 160, y: 200, width: 170, height: 80 }}
            onSelect={setSelectedCard}
            selected={selectedCard === 'finance'}
            onWireStart={() => {}}
            wiringFrom={null}
          />
          <SpatialCard
            card={{ id: 'compliance', type: 'mission', title: 'Compliance', subtitle: '3 documents needed', status: 'pending', color: '#06B6D4', x: 380, y: 180, width: 170, height: 80 }}
            onSelect={setSelectedCard}
            selected={selectedCard === 'compliance'}
            onWireStart={() => {}}
            wiringFrom={null}
          />
          <SpatialCard
            card={{ id: 'launch', type: 'mission', title: 'Launch', subtitle: '5 channels ready', status: 'pending', color: '#F97316', x: 300, y: 320, width: 160, height: 80 }}
            onSelect={setSelectedCard}
            selected={selectedCard === 'launch'}
            onWireStart={() => {}}
            wiringFrom={null}
          />

          {/* Wire lines */}
          <WireLine from={{ x: 120, y: 100 }} to={{ x: 240, y: 100 }} />
          <WireLine from={{ x: 200, y: 140 }} to={{ x: 160, y: 240 }} />
          <WireLine from={{ x: 300, y: 160 }} to={{ x: 380, y: 220 }} />
          <WireLine from={{ x: 420, y: 260 }} to={{ x: 380, y: 360 }} />

          {/* Canvas hint */}
          <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg text-xs" style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.2)' }}>
            <Zap className="w-3 h-3 inline mr-1" /> Drag cards to reorganize • Connect wires to link dependencies
          </div>
        </div>
      )}

      {view === 'timeline' && (
        <div>
          <JourneyTimeline missions={[
            { id: 'idea', phase: 'dream', status: 'completed' },
            { id: 'validation', phase: 'dream', status: 'in-progress' },
            { id: 'research', phase: 'dream', status: 'pending' },
            { id: 'branding', phase: 'build', status: 'pending' },
            { id: 'compliance', phase: 'build', status: 'pending' },
            { id: 'launch', phase: 'build', status: 'pending' },
          ]} currentPhase="dream" />
        </div>
      )}

      {view === 'agents' && (
        <div className="space-y-2 max-w-md">
          {session.agents.map(agent => (
            <AgentActivityPanel key={agent.id} agentId={agent.id} agentName={agent.name} color={agent.color} />
          ))}
        </div>
      )}

      {/* Chat interface at the bottom */}
      <div className="mt-auto pt-4">
        {/* Message history */}
        <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
          {session.messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-lg px-4 py-3 rounded-xl ${msg.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
                style={{
                  background: msg.role === 'user' ? 'var(--accent)' : 'var(--bg-surface)',
                  color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                  border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
                }}
              >
                <p className="text-sm">{msg.content}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs opacity-50">{msg.time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                  {msg.confidence && (
                    <span className="text-xs opacity-50">· {Math.round(msg.confidence * 100)}% confidence</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isStreaming && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-xl rounded-tl-sm" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                  {displayedResponse}
                  <span className="inline-block w-0.5 h-4 ml-0.5 animate-pulse" style={{ background: 'var(--accent)', verticalAlign: 'text-bottom' }} />
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about your business..."
            className="flex-1 px-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2"
            style={{ borderColor: 'var(--border)', color: 'var(--primary)' }}
          />
          <button
            onClick={handleSend}
            disabled={!inputMessage.trim() || isStreaming}
            className="px-5 py-3 rounded-xl font-semibold text-sm text-white transition-all btn-press disabled:opacity-50"
            style={{ background: 'var(--accent)' }}
          >
            {isStreaming ? '...' : 'Ask'}
          </button>
        </div>
      </div>
    </div>
  );
}