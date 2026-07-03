'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Sparkles, ArrowRight, Zap, Shield, Globe, TrendingUp, Star, ChevronRight } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [idea, setIdea] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async () => {
    if (!idea.trim()) return;
    setIsLoading(true);
    // Store idea in localStorage for the Dream page
    localStorage.setItem('dhandaai_idea', idea);
    await new Promise(r => setTimeout(r, 1500));
    setIsLoading(false);
    router.push('/dream');
  };

  const examples = [
    'I want to open a chocolate bouquet business',
    'I want to sell custom t-shirts online',
    'I want to start an AI coaching platform',
    'I want to open a cloud kitchen in Pune',
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-main)' }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)' }}>
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg" style={{ color: 'var(--primary)' }}>DhandaAI</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>From idea to launch in days</span>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: 'var(--secondary-light)', color: 'var(--secondary)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--secondary)' }} />
            Beta Available
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-3xl w-full text-center stagger-children">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 animate-fade-in" style={{ background: 'var(--accent-light)', border: '1px solid rgba(249,115,22,0.2)' }}>
            <Zap className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>Your AI co-founder, accountant, lawyer &amp; marketer</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 animate-fade-in" style={{ color: 'var(--primary)' }}>
            The operating system
            <br />
            <span className="gradient-text">for entrepreneurship.</span>
          </h1>

          {/* Sub */}
          <p className="text-xl leading-relaxed mb-12 max-w-xl mx-auto animate-fade-in" style={{ color: 'var(--text-secondary)' }}>
            Start, build, and grow your business — all in one conversation. No more jumping between YouTube, Google, and expensive consultants.
          </p>

          {/* Main CTA */}
          <div className="relative max-w-xl mx-auto animate-fade-in">
            <div className="absolute inset-0 rounded-2xl blur-xl opacity-30" style={{ background: 'var(--accent)' }} />
            <div className="relative rounded-2xl p-2" style={{ background: 'var(--bg-surface)', boxShadow: '0 4px 30px rgba(0,0,0,0.08)' }}>
              <div className="relative">
                <textarea
                  value={idea}
                  onChange={e => setIdea(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleStart())}
                  placeholder="What's your dream business?"
                  className="w-full px-6 py-5 text-lg rounded-xl resize-none focus:outline-none"
                  style={{
                    background: 'transparent',
                    color: 'var(--primary)',
                    minHeight: '72px',
                  }}
                  rows={2}
                />
                <div className="flex items-center justify-between px-4 pb-2">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Press Enter to start</span>
                  <button
                    onClick={handleStart}
                    disabled={!idea.trim() || isLoading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white transition-all btn-press disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: 'var(--accent)' }}
                  >
                    {isLoading ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Start Building <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Example prompts */}
          <div className="mt-6 animate-fade-in">
            <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Try one of these:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {examples.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setIdea(ex)}
                  className="px-3 py-1.5 rounded-full text-xs transition-all card-hover"
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="max-w-4xl w-full mt-24">
          <p className="text-center text-sm font-semibold uppercase tracking-wider mb-10" style={{ color: 'var(--text-muted)' }}>
            From idea to first rupee in 3 phases
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
            {[
              {
                phase: '01',
                icon: '💭',
                title: 'Dream',
                description: 'Share your idea. We research the market, validate your concept, and create a personalized roadmap — in days, not months.',
                color: '#8B5CF6',
              },
              {
                phase: '02',
                icon: '🔨',
                title: 'Build',
                description: 'Your AI team handles compliance, branding, suppliers, website, and payments — one click at a time.',
                color: '#F97316',
              },
              {
                phase: '03',
                icon: '📈',
                title: 'Grow',
                description: 'Your AI COO manages marketing, finance, operations, and HR — proactively alerting you to opportunities.',
                color: '#10B981',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl p-8 text-left card-hover"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-xs font-mono font-medium" style={{ color: item.color }}>{item.phase}</span>
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--primary)' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Social proof */}
        <div className="max-w-2xl w-full mt-24 text-center animate-fade-in">
          <div className="flex items-center justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" style={{ color: '#F59E0B' }} />
            ))}
          </div>
          <p className="text-sm italic" style={{ color: 'var(--text-secondary)' }}>
            "I was terrified of starting a business. DhandaAI held my hand through everything — from choosing a name to launching on Instagram. My first month? ₹47,000 in revenue."
          </p>
          <p className="text-sm font-semibold mt-2" style={{ color: 'var(--text-primary)' }}>— Priya Sharma, Pune</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Chocolate bouquet business, started 6 weeks ago</p>
        </div>

        {/* Features grid */}
        <div className="max-w-4xl w-full mt-24">
          <p className="text-center text-sm font-semibold uppercase tracking-wider mb-10" style={{ color: 'var(--text-muted)' }}>
            Everything you need, nothing you don't
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
            {[
              { icon: <Shield className="w-5 h-5" />, label: 'Legal Compliance', desc: 'Auto-prepare all licenses' },
              { icon: <TrendingUp className="w-5 h-5" />, label: 'Market Research', desc: 'Deep competitor analysis' },
              { icon: <Globe className="w-5 h-5" />, label: 'Website Builder', desc: 'Publish in one click' },
              { icon: <Zap className="w-5 h-5" />, label: 'AI COO', desc: 'Proactive growth agent' },
            ].map((f) => (
              <div key={f.label} className="p-5 rounded-xl text-center card-hover" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                <div className="w-10 h-10 rounded-lg mx-auto mb-3 flex items-center justify-center" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                  {f.icon}
                </div>
                <p className="font-semibold text-sm" style={{ color: 'var(--primary)' }}>{f.label}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer CTA */}
      <div className="px-8 py-12 text-center border-t" style={{ borderColor: 'var(--border)' }}>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>No credit card required. Free to start. Scales as you grow.</p>
        <button
          onClick={handleStart}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white text-lg transition-all btn-press"
          style={{ background: 'var(--accent)' }}
        >
          <Sparkles className="w-5 h-5" />
          Start Your Business Journey
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}