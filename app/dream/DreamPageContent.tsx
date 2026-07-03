'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useBusiness } from '@/lib/store';
import Sidebar from '@/components/Sidebar';
import AmbientIntelligence from '@/components/AmbientIntelligence';
import { StreamingResponse, MultiModalInput, DREAM_AI_RESPONSES, UncertaintyState } from '@/components/AIAgentEngine';
import {
  Sparkles,
  Brain,
  CheckCircle2,
  ChevronRight,
  Target,
  BarChart3,
  DollarSign,
  FileText,
  Lightbulb,
  Zap,
  X,
  RefreshCcw,
} from 'lucide-react';
import MarketResearchPanel from '@/components/MarketResearchPanel';
import ValidationPanel from '@/components/ValidationPanel';
import MissionPanel from '@/components/MissionPanel';

type ResponseKey = 'ideaCapture' | 'marketResearch' | 'validation';
type ResponseData = typeof DREAM_AI_RESPONSES[keyof typeof DREAM_AI_RESPONSES];

export default function DreamPageContent() {
  const { state, dispatch } = useBusiness();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeMissionId = searchParams.get('mission') || 'idea';

  const [phase, setPhase] = useState<'input' | 'research' | 'validation' | 'complete'>('input');
  const [currentResponse, setCurrentResponse] = useState<ResponseData | null>(null);
  const [responseKey, setResponseKey] = useState<ResponseKey | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const savedIdea = localStorage.getItem('dhandaai_idea');
    if (savedIdea && !state.idea) {
      dispatch({ type: 'SET_IDEA', idea: savedIdea });
      setInputValue(savedIdea);
    }
  }, []);

  const handleSubmit = async (message?: string) => {
    const text = message || inputValue.trim();
    if (!text) return;

    dispatch({ type: 'SET_IDEA', idea: text });
    localStorage.setItem('dhandaai_idea', text);

    // Choose the right response based on the message
    let responseKey: ResponseKey = 'ideaCapture';
    let response: ResponseData = DREAM_AI_RESPONSES.ideaCapture;

    if (text.toLowerCase().includes('chocolate')) {
      responseKey = 'ideaCapture';
      response = DREAM_AI_RESPONSES.ideaCapture;
      setPhase('research');
      dispatch({ type: 'START_MISSION', missionId: 'validation' });
    } else if (text.toLowerCase().includes('market') || text.toLowerCase().includes('competitor')) {
      responseKey = 'marketResearch';
      response = DREAM_AI_RESPONSES.marketResearch;
      setPhase('validation');
    } else if (text.toLowerCase().includes('validate') || text.toLowerCase().includes('score')) {
      responseKey = 'validation';
      response = DREAM_AI_RESPONSES.validation;
      setPhase('complete');
    }

    setCurrentResponse(response);
    setResponseKey(responseKey);
    setIsStreaming(true);
    setInputValue('');
  };

  const handleResponseComplete = () => {
    setIsStreaming(false);
    if (responseKey === 'ideaCapture') {
      setTimeout(() => setShowRoadmap(true), 500);
    }
  };

  const handleNextResearch = () => {
    setCurrentResponse(DREAM_AI_RESPONSES.marketResearch);
    setResponseKey('marketResearch');
    setIsStreaming(true);
    dispatch({ type: 'START_MISSION', missionId: 'research' });
  };

  const handleValidation = () => {
    setCurrentResponse(DREAM_AI_RESPONSES.validation);
    setResponseKey('validation');
    setIsStreaming(true);
    setPhase('complete');
  };

  const activeMission = state.missions.find(m => m.id === activeMissionId);

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-main)' }}>
      <Sidebar />

      <main className="flex-1 ml-[280px] min-h-screen flex flex-col" style={{ paddingBottom: '320px' }}>
        {/* Header */}
        <div className="px-8 py-6 border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#8B5CF615' }}>
              <Brain className="w-5 h-5" style={{ color: '#8B5CF6' }} />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--primary)' }}>Phase 1: Dream</h1>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Your AI co-founders are working in parallel</p>
            </div>
            <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: '#8B5CF615', color: '#8B5CF6' }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#8B5CF6' }} />
              {state.missions.filter(m => m.phase === 'dream' && m.status === 'completed').length}/{state.missions.filter(m => m.phase === 'dream').length} missions
            </div>
          </div>

          {/* Phase progress */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${(state.missions.filter(m => m.phase === 'dream' && m.status === 'completed').length / state.missions.filter(m => m.phase === 'dream').length) * 100}%`,
                  background: 'linear-gradient(90deg, #8B5CF6, #A78BFA)',
                }}
              />
            </div>
            <span className="text-xs font-mono" style={{ color: '#8B5CF6' }}>
              {Math.round((state.missions.filter(m => m.phase === 'dream' && m.status === 'completed').length / state.missions.filter(m => m.phase === 'dream').length) * 100)}%
            </span>
          </div>
        </div>

        {/* Main interaction area */}
        <div className="flex-1 flex">
          <div className="flex-1 p-8">
            <div className="max-w-2xl mx-auto">
              {/* Agent activity feed */}
              {currentResponse?.agents && currentResponse.agents.length > 0 && (
                <div className="mb-6">
                  {currentResponse.agents.map((agent) => (
                    <div
                      key={agent.id}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all"
                      style={{
                        background: agent.completed
                          ? 'rgba(16,185,129,0.08)'
                          : agent.active
                          ? `${agent.color}10`
                          : 'var(--bg-elevated)',
                        border: `1px solid ${agent.completed ? 'rgba(16,185,129,0.2)' : agent.active ? `${agent.color}30` : 'var(--border)'}`,
                      }}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{
                          background: agent.completed ? 'var(--secondary)' : agent.active ? agent.color : 'var(--bg-surface)',
                          color: 'white',
                        }}
                      >
                        {agent.completed ? <CheckCircle2 className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold" style={{ color: agent.completed ? 'var(--secondary)' : agent.active ? agent.color : 'var(--text-muted)' }}>
                          {agent.name}
                        </p>
                        {agent.active && (
                          <div className="flex items-center gap-1 mt-0.5">
                            {agent.thinking.slice(0, 2).map((t, i) => (
                              <span key={i} className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{t}</span>
                            ))}
                          </div>
                        )}
                        {agent.completed && (
                          <p className="text-[10px]" style={{ color: 'var(--secondary)' }}>Analysis complete</p>
                        )}
                      </div>
                      {agent.active && (
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: agent.color }} />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Streaming response */}
              {currentResponse && (
                <div className="mb-6 p-6 rounded-2xl animate-fade-in" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                  <StreamingResponse
                    agentName="DhandaAI"
                    agentColor="#8B5CF6"
                    agentIcon={<Sparkles className="w-4 h-4" />}
                    thinking={currentResponse.thinking}
                    reasoning={currentResponse.reasoning}
                    response={currentResponse.response}
                    confidence={currentResponse.confidence}
                    agents={currentResponse.agents}
                    onComplete={handleResponseComplete}
                  />

                  {/* Contextual action buttons */}
                  {!isStreaming && (
                    <div className="mt-4 flex items-center gap-2 pt-4 border-t animate-fade-in" style={{ borderColor: 'var(--border)' }}>
                      {responseKey === 'ideaCapture' && (
                        <>
                          <button
                            onClick={handleNextResearch}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all btn-press"
                            style={{ background: '#8B5CF6' }}
                          >
                            <BarChart3 className="w-4 h-4" />
                            Run Market Research
                          </button>
                          <button className="px-4 py-2 rounded-xl text-sm" style={{ color: 'var(--text-muted)' }}>
                            <RefreshCcw className="w-4 h-4 inline mr-1" /> Refine my idea
                          </button>
                        </>
                      )}
                      {responseKey === 'marketResearch' && (
                        <>
                          <button
                            onClick={handleValidation}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all btn-press"
                            style={{ background: '#8B5CF6' }}
                          >
                            <Target className="w-4 h-4" />
                            Validate My Business
                          </button>
                          <button className="px-4 py-2 rounded-xl text-sm" style={{ color: 'var(--text-muted)' }}>
                            Show competitors
                          </button>
                        </>
                      )}
                      {responseKey === 'validation' && (
                        <>
                          <button
                            onClick={() => { dispatch({ type: 'SET_PHASE', phase: 'build' }); router.push('/build'); }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all btn-press"
                            style={{ background: 'linear-gradient(135deg, #F97316, #F59E0B)' }}
                          >
                            <Zap className="w-4 h-4" />
                            Move to Build Phase
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Input area — always visible for quick questions */}
              {phase !== 'input' || currentResponse ? (
                <div className="mb-4">
                  <MultiModalInput
                    value={inputValue}
                    onChange={setInputValue}
                    onSubmit={() => handleSubmit(inputValue)}
                    disabled={isStreaming}
                    placeholder="Ask follow-up questions... What licenses do I need? How much money?"
                  />
                </div>
              ) : (
                /* Initial state */
                <div className="text-center mb-12 animate-fade-in">
                  <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center animate-float" style={{ background: '#8B5CF615' }}>
                    <Lightbulb className="w-10 h-10" style={{ color: '#8B5CF6' }} />
                  </div>
                  <h2 className="text-2xl font-extrabold mb-3" style={{ color: 'var(--primary)' }}>
                    What's your dream?
                  </h2>
                  <p className="text-sm max-w-md mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>
                    Tell me about the business you want to build. Be as specific or vague as you like — I'll guide you from there.
                  </p>
                </div>
              )}

              {/* Quick suggestion chips */}
              {!currentResponse && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    'I want to open a chocolate bouquet business in Pune',
                    'I want to sell custom t-shirts online',
                    'I want to start an AI coaching platform',
                    'I want to open a cloud kitchen',
                  ].map(s => (
                    <button
                      key={s}
                      onClick={() => { setInputValue(s); handleSubmit(s); }}
                      className="px-4 py-2.5 rounded-2xl text-sm transition-all card-hover"
                      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Roadmap preview */}
              {showRoadmap && !currentResponse && (
                <div className="mt-8 p-6 rounded-2xl animate-fade-in-up" style={{ background: '#8B5CF610', border: '1px solid #8B5CF630' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4" style={{ color: '#8B5CF6' }} />
                    <span className="text-sm font-bold" style={{ color: '#8B5CF6' }}>Your personalized roadmap is ready</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { name: 'Market Research', desc: '87% opportunity in your area', icon: BarChart3, done: false },
                      { name: 'Business Validation', desc: '98% score with manageable risks', icon: Target, done: false },
                      { name: 'Cost Planning', desc: '₹73,400 estimated startup cost', icon: DollarSign, done: false },
                      { name: 'Build Phase', desc: '7 specialists ready to help', icon: Sparkles, done: false },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-surface)' }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#8B5CF615' }}>
                          <item.icon className="w-4 h-4" style={{ color: '#8B5CF6' }} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>{item.name}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                        </div>
                        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#8B5CF6' }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="w-80 border-l p-6 overflow-y-auto" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
              Mission Progress
            </h3>
            <div className="space-y-3">
              {state.missions.filter(m => m.phase === 'dream').map((mission, i) => {
                const icons: Record<string, React.ReactNode> = {
                  idea: <Sparkles className="w-3.5 h-3.5" />,
                  validation: <BarChart3 className="w-3.5 h-3.5" />,
                  research: <Target className="w-3.5 h-3.5" />,
                  model: <FileText className="w-3.5 h-3.5" />,
                  funding: <DollarSign className="w-3.5 h-3.5" />,
                };
                return (
                  <div
                    key={mission.id}
                    onClick={() => mission.status !== 'pending' && router.push(`/dream?mission=${mission.id}`)}
                    className={`p-3 rounded-xl cursor-pointer transition-all ${mission.status !== 'pending' ? 'card-hover' : ''}`}
                    style={{
                      background: mission.status === 'in-progress' ? '#8B5CF610' : mission.status === 'completed' ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                      border: mission.status === 'in-progress' ? '1px solid #8B5CF640' : '1px solid var(--border)',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center"
                        style={{
                          background: mission.status === 'completed' ? 'var(--secondary)' : mission.status === 'in-progress' ? '#8B5CF6' : 'var(--bg-elevated)',
                          color: mission.status === 'completed' || mission.status === 'in-progress' ? 'white' : 'var(--text-muted)',
                        }}
                      >
                        {mission.status === 'completed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : icons[mission.id] || <Circle className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold" style={{ color: mission.status === 'completed' ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                          {mission.name}
                        </p>
                        {mission.status === 'in-progress' && (
                          <div className="mt-1.5 h-1.5 rounded-full overflow-hidden" style={{ background: '#8B5CF620' }}>
                            <div className="h-full rounded-full transition-all" style={{ width: `${mission.progress}%`, background: '#8B5CF6' }} />
                          </div>
                        )}
                      </div>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{i + 1}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Knowledge base preview */}
            <div className="mt-6 p-4 rounded-xl" style={{ background: '#8B5CF608' }}>
              <p className="text-xs font-semibold mb-2" style={{ color: '#8B5CF6' }}>💡 What I've learned about you</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <CheckCircle2 className="w-3 h-3" style={{ color: '#8B5CF6' }} />
                  Business type: Product (physical goods)
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <CheckCircle2 className="w-3 h-3" style={{ color: '#8B5CF6' }} />
                  Location: Pune, Maharashtra
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <CheckCircle2 className="w-3 h-3" style={{ color: '#8B5CF6' }} />
                  Budget: ₹50,000–80,000
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Ambient Intelligence Bar — always visible */}
      <AmbientIntelligence />
    </div>
  );
}

function Circle(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}