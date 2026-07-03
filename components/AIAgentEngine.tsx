'use client';

import React, { useState, useRef, useEffect, useCallback, ReactNode } from 'react';
import { useBusiness } from '@/lib/store';
import {
  Sparkles,
  Brain,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Zap,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  RefreshCcw,
  Send,
  Mic,
  Camera,
  BarChart3,
  DollarSign,
  Shield,
  Package,
  Globe,
  Megaphone,
} from 'lucide-react';

// ===== Token types for realistic AI output =====
type TokenType = 'thinking' | 'reasoning' | 'action' | 'result' | 'confidence' | 'final';

interface Token {
  id: string;
  text: string;
  type: TokenType;
  confidence?: number;
  tool?: string;
}

interface AIAgent {
  id: string;
  name: string;
  role: string;
  color: string;
  icon: React.ReactNode;
  thinking: string[];
  active: boolean;
  completed: boolean;
}

// ===== Streaming token generator =====
function* tokenGenerator(text: string, delay: number = 40): Generator<Token> {
  const words = text.split(' ');
  let sentenceBuffer = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i] + (i < words.length - 1 ? ' ' : '');
    sentenceBuffer += word;

    // Detect sentence boundaries for reasoning markers
    if (sentenceBuffer.match(/[.!?]$/)) {
      yield { id: `t-${Date.now()}-${i}`, text: sentenceBuffer, type: 'final' };
      sentenceBuffer = '';
    } else if (sentenceBuffer.length > 30 && (sentenceBuffer.match(/,/g)?.length || 0) >= 2) {
      // Middle of a sentence
      yield { id: `t-${Date.now()}-${i}`, text: sentenceBuffer, type: 'final' };
      sentenceBuffer = '';
    } else {
      // Stream word by word for the streaming feel
      yield { id: `t-${Date.now()}-${i}`, text: word, type: 'final' };
    }
  }

  if (sentenceBuffer.trim()) {
    yield { id: `t-${Date.now()}-final`, text: sentenceBuffer, type: 'final' };
  }
}

// ===== Reasoning trace component =====
function ReasoningTrace({ reasoning, visible }: { reasoning: string; visible: boolean }) {
  const [expanded, setExpanded] = useState(false);

  if (!visible || !reasoning) return null;

  return (
    <div className="my-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg transition-all"
        style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.2)' }}
      >
        <Brain className="w-3 h-3" />
        <span className="font-medium">Reasoning trace</span>
        {expanded ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
      </button>

      {expanded && (
        <div className="mt-2 p-3 rounded-lg font-mono text-xs leading-relaxed animate-fade-in" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)', color: '#8B5CF6' }}>
          {reasoning.split('\n').map((line, i) => (
            <div key={i} className="flex items-start gap-2">
              <span style={{ color: 'rgba(139,92,246,0.5)' }}>→</span>
              <span>{line}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ===== Confidence indicator =====
function ConfidenceMeter({ confidence, label }: { confidence: number; label?: string }) {
  const color = confidence >= 0.85 ? '#10B981' : confidence >= 0.65 ? '#F59E0B' : '#EF4444';
  const desc = confidence >= 0.85 ? 'High confidence' : confidence >= 0.65 ? 'Moderate' : 'Uncertain';

  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex items-center gap-1.5">
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label || 'Confidence'}:</span>
        <div className="flex gap-0.5">
          {[0.25, 0.5, 0.75, 1.0].map((threshold) => (
            <div
              key={threshold}
              className="w-1.5 h-4 rounded-full transition-all"
              style={{
                background: confidence >= threshold ? color : 'rgba(0,0,0,0.1)',
              }}
            />
          ))}
        </div>
        <span className="text-xs font-medium" style={{ color }}>
          {Math.round(confidence * 100)}%
        </span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>({desc})</span>
      </div>
    </div>
  );
}

// ===== Agent orchestration visualization =====
function AgentOrchestration({ agents }: { agents: AIAgent[] }) {
  return (
    <div className="mb-4 p-4 rounded-xl" style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.15)' }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#8B5CF6' }} />
        <span className="text-xs font-semibold" style={{ color: '#8B5CF6' }}>Multi-Agent Orchestration</span>
        <span className="text-xs text-white/40 ml-auto">{agents.filter(a => a.active).length} agents active</span>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {agents.map((agent, i) => (
          <React.Fragment key={agent.id}>
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg flex-shrink-0 transition-all"
              style={{
                background: agent.completed
                  ? 'rgba(16,185,129,0.15)'
                  : agent.active
                  ? `${agent.color}20`
                  : 'rgba(255,255,255,0.05)',
                border: `1px solid ${agent.completed ? 'rgba(16,185,129,0.3)' : agent.active ? `${agent.color}40` : 'rgba(255,255,255,0.1)'}`,
              }}
            >
              <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ color: agent.completed ? '#10B981' : agent.active ? agent.color : 'rgba(255,255,255,0.3)' }}>
                {agent.completed ? <CheckCircle2 className="w-3 h-3" /> : agent.icon}
              </div>
              <span className="text-xs font-medium whitespace-nowrap" style={{ color: agent.completed ? '#10B981' : agent.active ? agent.color : 'rgba(255,255,255,0.3)' }}>
                {agent.name}
              </span>
              {agent.active && !agent.completed && (
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: agent.color }} />
              )}
            </div>
            {i < agents.length - 1 && (
              <div className="flex items-center justify-center w-6 flex-shrink-0">
                <ChevronRight className="w-3 h-3 text-white/20" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Agent thinking indicators */}
      {agents.filter(a => a.active && !a.completed).map(agent => (
        <div key={`thinking-${agent.id}`} className="mt-2 animate-fade-in">
          <div className="flex items-center gap-1.5 mb-1">
            <Brain className="w-3 h-3" style={{ color: agent.color }} />
            <span className="text-xs font-medium" style={{ color: agent.color }}>{agent.role} thinking...</span>
          </div>
          <div className="space-y-1">
            {agent.thinking.slice(0, 3).map((t, i) => (
              <div key={i} className="flex items-center gap-1.5 ml-4">
                <span className="text-xs" style={{ color: agent.color, opacity: 0.5 }}>·</span>
                <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.5)' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ===== Main AI response stream component =====
interface StreamingResponseProps {
  agentName: string;
  agentColor: string;
  agentIcon: React.ReactNode;
  thinking: string;
  reasoning: string;
  response: string;
  confidence: number;
  agents?: AIAgent[];
  onComplete?: () => void;
}

export function StreamingResponse({
  agentName,
  agentColor,
  agentIcon,
  thinking,
  reasoning,
  response,
  confidence,
  agents,
  onComplete,
}: StreamingResponseProps) {
  const [displayedTokens, setDisplayedTokens] = useState<Token[]>([]);
  const [showThinking, setShowThinking] = useState(true);
  const [showReasoning, setShowReasoning] = useState(false);
  const [status, setStatus] = useState<'thinking' | 'reasoning' | 'streaming' | 'done'>('thinking');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const tokens: Token[] = [];
    let index = 0;

    // Phase 1: Thinking
    setStatus('thinking');
    const thinkingTimer = setTimeout(() => {
      if (cancelled) return;
      setStatus('reasoning');
      setShowReasoning(true);

      // Phase 2: Reason through
      setTimeout(() => {
        if (cancelled) return;
        setStatus('streaming');

        // Phase 3: Stream the actual response
        const gen = tokenGenerator(response, 35);
        let result = gen.next();

        const streamInterval = setInterval(() => {
          if (cancelled || result.done) {
            clearInterval(streamInterval);
            if (!cancelled) {
              setStatus('done');
              onComplete?.();
            }
            return;
          }

          tokens.push(result.value);
          setDisplayedTokens([...tokens]);
          result = gen.next();

          // Auto-scroll
          if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
          }
        }, 35);
      }, 1200);
    }, 1200);

    return () => {
      cancelled = true;
      clearTimeout(thinkingTimer);
    };
  }, [response, onComplete]);

  const statusLabels = {
    thinking: 'Analyzing request...',
    reasoning: 'Reasoning through options...',
    streaming: 'Responding...',
    done: 'Complete',
  };

  return (
    <div ref={containerRef} className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
      {/* Agent header */}
      <div className="flex items-center gap-2 mb-1">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `${agentColor}20`, color: agentColor }}>
          {agentIcon}
        </div>
        <span className="text-xs font-semibold" style={{ color: agentColor }}>{agentName}</span>
        <div className="flex items-center gap-1 ml-auto">
          <div
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{
              background: status === 'done' ? '#10B981' : status === 'streaming' ? agentColor : status === 'reasoning' ? '#F59E0B' : '#8B5CF6',
            }}
          />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{statusLabels[status]}</span>
        </div>
      </div>

      {/* Thinking phase */}
      {status === 'thinking' && (
        <div className="flex items-center gap-2 animate-fade-in">
          <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: agentColor }} />
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{thinking}</span>
        </div>
      )}

      {/* Reasoning trace */}
      {showReasoning && (status === 'reasoning' || status === 'streaming' || status === 'done') && (
        <ReasoningTrace reasoning={reasoning} visible={showReasoning} />
      )}

      {/* Streamed response */}
      {(status === 'streaming' || status === 'done') && (
        <div className="pl-0">
          <div className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            {displayedTokens.map((token) => (
              <span
                key={token.id}
                className="animate-fade-in"
                style={{ animationDuration: '0ms' }}
              >
                {token.text}
              </span>
            ))}
            {status === 'streaming' && (
              <span className="inline-block w-0.5 h-4 ml-0.5 animate-pulse" style={{ background: agentColor, verticalAlign: 'text-bottom' }} />
            )}
          </div>

          {/* Confidence */}
          {status === 'done' && <ConfidenceMeter confidence={confidence} label="This response" />}
        </div>
      )}
    </div>
  );
}

// ===== Pre-configured AI responses for the Dream phase =====
export const DREAM_AI_RESPONSES = {
  ideaCapture: {
    thinking: 'Understanding the business vision...',
    reasoning: `Based on "chocolate bouquet business", I'm analyzing:
→ Product type: Physical goods (custom packaging required)
→ Market: Gifting segment (seasonal, events-driven)
→ Location: Pune, Maharashtra (tier-1.5 city, high gifting culture)
→ Competition: Moderate (local bakers + online players)
→ Regulatory: FSSAI likely required, GST mandatory above 20L
→ Initial investment estimate: ₹50,000-80,000
→ Revenue model: Per-unit markup + customization premium
This is a validated, high-margin micro-business concept.`,
    response: `Amazing. I'll help you build this business. This usually takes around 7–12 days depending on complexity.

Here's what I see in your idea: a chocolate bouquet business in Pune is a smart choice — the gifting market here is ₹400+ crore annually, and personalized gifting is growing 23% YoY. Your investment range of ₹50,000–80,000 is realistic for a lean launch.

Let me research your market in real-time to validate this further.`,
    confidence: 0.89,
    agents: [
      { id: 'market-research', name: 'Market Research', role: 'Analyzing market data', color: '#8B5CF6', icon: <BarChart3 className="w-3 h-3" />, thinking: ['Scanning competitor landscape...', 'Analyzing customer reviews...', 'Calculating market size...'], active: true, completed: false },
      { id: 'finance', name: 'Finance', role: 'Estimating costs', color: '#10B981', icon: <DollarSign className="w-3 h-3" />, thinking: ['Benchmarking similar businesses...', 'Calculating unit economics...'], active: false, completed: false },
      { id: 'compliance', name: 'Compliance', role: 'Checking requirements', color: '#06B6D4', icon: <Shield className="w-3 h-3" />, thinking: ['Identifying required licenses...', 'Checking FSSAI requirements...'], active: false, completed: false },
    ] as AIAgent[],
  },
  marketResearch: {
    thinking: 'Running multi-source research on your market...',
    reasoning: `Market Research Agent is running parallel analysis:
→ Google Maps data: 23 chocolate/gift shops within 8km of center
→ Social media: 847 posts about chocolate bouquets in Pune this month
→ Pricing: Range from ₹499 (basic) to ₹4,999 (premium)
→ Customer reviews: "Presentation" and "Freshness" are top 2 mentioned qualities
→ Seasonal: Dec-Feb is peak (340% above average demand)
→ Supplier proximity: 4 chocolate wholesalers within 50km
Opportunity score: 87/100. This is a viable, underserved niche in your area.`,
    response: `Research complete. Here's what I found for your chocolate bouquet business in Pune:

📊 **Market Opportunity: 87/100** (High)
• ₹120 crore annual gifting market in Pune
• Only 8 dedicated chocolate bouquet businesses (vs. 200+ in Mumbai)
• Average order value: ₹899 | Average margin: 48%
• Your location has 23 competing gift shops — but 0 focus on chocolate-only bouquets

💰 **Realistic first month**: ₹35,000–55,000 revenue with ₹40,000 investment
⏱️ **Break-even**: 18 days (vs. 45-day industry average)

Your biggest opportunity: Online ordering + Instagram marketing. Only 2 competitors have active online presence.

Ready to validate this?`,
    confidence: 0.87,
    agents: [
      { id: 'market-research', name: 'Market Research', role: 'Research complete', color: '#8B5CF6', icon: <BarChart3 className="w-3 h-3" />, thinking: [], active: false, completed: true },
      { id: 'finance', name: 'Finance', role: 'Cost analysis complete', color: '#10B981', icon: <DollarSign className="w-3 h-3" />, thinking: [], active: false, completed: true },
      { id: 'compliance', name: 'Compliance', role: 'License check complete', color: '#06B6D4', icon: <Shield className="w-3 h-3" />, thinking: [], active: false, completed: true },
    ] as AIAgent[],
  },
  validation: {
    thinking: 'Scoring your business model across 5 dimensions...',
    reasoning: `Validation across 5 dimensions:
1. Idea Viability: 92/100 — Clear product, defined audience, realistic execution
2. Market Opportunity: 87/100 — Underserved niche, growing category, local gap
3. Location Fit: 95/100 — Pune has high gifting culture, residential density ideal
4. Competition Level: 78/100 — Moderate competition but clear differentiation path
5. Financial Feasibility: 88/100 — Low capex, high margin, fast payback

Risk factors identified:
• Seasonal dependency (Dec-Feb = 60% revenue)
• Supplier dependency for chocolate quality
• Packaging differentiation is key

Overall: STRONG VALIDATION with manageable risks.`,
    response: `✅ **Business Validation: 89%** — Strong

Your chocolate bouquet business scores well across every dimension:

| Dimension | Score | Insight |
|-----------|-------|---------|
| Idea Viability | 92% | Clear, executable concept |
| Market Opportunity | 87% | Underserved, growing niche |
| Location Fit | 95% | Perfect market for this |
| Competition Level | 78% | Room for 5+ players |
| Financial Feasibility | 88% | 48% margins, 18-day payback |

⚠️ **Things to note:**
• 60% of revenue concentrated in Oct–Feb (plan inventory accordingly)
• Focus on Instagram + WhatsApp for first 100 customers
• Your USP: "Same-day delivery" + "Custom note printing"

The next step is yours: we can move to Build phase and start creating your business. What would you like to do?`,
    confidence: 0.91,
    agents: [] as AIAgent[],
  },
};

// ===== Multi-modal input bar =====
interface MultiModalInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function MultiModalInput({ value, onChange, onSubmit, disabled, placeholder }: MultiModalInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className="rounded-2xl p-1 transition-all duration-300"
      style={{
        background: 'var(--bg-surface)',
        border: focused ? '2px solid var(--accent)' : '1px solid var(--border)',
        boxShadow: focused ? '0 0 0 4px rgba(249,115,22,0.1)' : 'none',
      }}
    >
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (value.trim()) onSubmit();
              }
            }}
            placeholder={placeholder || 'Ask anything about your business...'}
            className="w-full px-5 py-4 text-base rounded-xl resize-none focus:outline-none"
            style={{ background: 'transparent', color: 'var(--primary)', minHeight: '56px' }}
            rows={1}
          />
        </div>

        {/* Multimodal buttons */}
        <div className="flex items-center gap-1 pb-2 pr-2">
          <button className="w-8 h-8 rounded-lg flex items-center justify-center transition-all" style={{ color: 'var(--text-muted)' }} title="Voice input (coming soon)">
            <Mic className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center transition-all" style={{ color: 'var(--text-muted)' }} title="Image analysis (coming soon)">
            <Camera className="w-4 h-4" />
          </button>
          <button
            onClick={onSubmit}
            disabled={!value.trim() || disabled}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all btn-press disabled:opacity-40"
            style={{ background: value.trim() && !disabled ? 'var(--accent)' : 'var(--bg-elevated)', color: value.trim() && !disabled ? 'white' : 'var(--text-muted)' }}
          >
            {disabled ? (
              <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Suggestion chips */}
      {focused && !value && (
        <div className="flex flex-wrap gap-2 px-4 pb-3">
          {['What licenses do I need?', 'Help me choose a brand name', 'How much money do I need?', 'Show my competitors'].map(s => (
            <button
              key={s}
              onClick={() => onChange(s)}
              className="px-3 py-1.5 rounded-full text-xs transition-all"
              style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ===== Uncertain / "I don't know" state =====
export function UncertaintyState({ query, suggestions }: { query: string; suggestions: string[] }) {
  return (
    <div className="p-6 rounded-2xl text-center animate-fade-in" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
      <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ background: '#F59E0B15' }}>
        <AlertTriangle className="w-6 h-6" style={{ color: '#F59E0B' }} />
      </div>
      <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--primary)' }}>I'm not certain about this</h3>
      <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
        For "{query}", I need more context to give you an accurate answer.
      </p>
      <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>Would you like me to:</p>
      <div className="flex flex-wrap justify-center gap-2">
        {suggestions.map((s, i) => (
          <button
            key={i}
            className="px-4 py-2 rounded-xl text-xs font-medium transition-all btn-press"
            style={{ background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid rgba(249,115,22,0.2)' }}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-center gap-1">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#F59E0B' }} />
        <span className="text-xs" style={{ color: '#F59E0B' }}>Confidence: 34% — recommending human review</span>
      </div>
    </div>
  );
}