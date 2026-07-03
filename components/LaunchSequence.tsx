'use client';

import { useState, useEffect } from 'react';
import { useBusiness } from '@/lib/store';
import { useRouter } from 'next/navigation';
import {
  Rocket,
  CheckCircle2,
  MapPin,
  MessageSquare,
  Globe,
  Megaphone,
  Sparkles,
  PartyPopper,
} from 'lucide-react';
import { InstagramIcon } from './CustomIcons';

const LAUNCH_CHANNELS = [
  { id: 'instagram', name: 'Instagram Business', icon: InstagramIcon, color: '#E1306C' },
  { id: 'google', name: 'Google Business', icon: MapPin, color: '#4285F4' },
  { id: 'whatsapp', name: 'WhatsApp Business', icon: MessageSquare, color: '#25D366' },
  { id: 'website', name: 'Website', icon: Globe, color: '#F97316' },
  { id: 'meta', name: 'Meta Ads', icon: Megaphone, color: '#1877F2' },
];

export default function LaunchSequence() {
  const { state, dispatch } = useBusiness();
  const router = useRouter();
  const [phase, setPhase] = useState<'ready' | 'launching' | 'complete'>('ready');
  const [currentChannel, setCurrentChannel] = useState(0);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    if (phase === 'launching') {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setCurrentChannel(i);
        if (i >= LAUNCH_CHANNELS.length) {
          clearInterval(interval);
          setTimeout(() => {
            setPhase('complete');
            setConfetti(true);
            dispatch({ type: 'LAUNCH' });
            dispatch({ type: 'UPDATE_MISSION', missionId: 'launch', progress: 100, status: 'completed' });
          }, 800);
        }
      }, 900);

      return () => clearInterval(interval);
    }
  }, [phase, dispatch]);

  const handleLaunch = () => {
    setPhase('launching');
    setCurrentChannel(0);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {phase === 'ready' && (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-3xl mx-auto mb-8 flex items-center justify-center animate-float" style={{ background: 'linear-gradient(135deg, #F97316, #F59E0B)' }}>
            <Rocket className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold mb-4" style={{ color: 'var(--primary)' }}>
            Ready to Launch?
          </h2>
          <p className="text-sm max-w-md mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>
            Your business will go live across all channels simultaneously. This is the moment your dream becomes real.
          </p>

          {/* Channels preview */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {LAUNCH_CHANNELS.map((channel) => (
              <div
                key={channel.id}
                className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ background: `${channel.color}15`, border: `1px solid ${channel.color}40` }}
              >
                <channel.icon className="w-4 h-4" style={{ color: channel.color }} />
                <span className="text-xs font-medium" style={{ color: channel.color }}>{channel.name}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleLaunch}
            className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-bold text-xl text-white transition-all btn-press shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #F97316, #F59E0B, #EAB308)',
              boxShadow: '0 8px 30px rgba(249, 115, 22, 0.4)',
            }}
          >
            <Rocket className="w-6 h-6" />
            Launch Business
          </button>
        </div>
      )}

      {phase === 'launching' && (
        <div className="text-center py-16">
          <div className="mb-8">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse" style={{ background: '#F9731620' }}>
              <Rocket className="w-8 h-8 animate-bounce" style={{ color: 'var(--accent)' }} />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--primary)' }}>Launching...</h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Setting up your business across all channels</p>
          </div>

          {/* Launch progress */}
          <div className="space-y-3 max-w-md mx-auto">
            {LAUNCH_CHANNELS.map((channel, i) => {
              const isDone = i < currentChannel;
              const isActive = i === currentChannel;
              return (
                <div
                  key={channel.id}
                  className={`flex items-center gap-3 p-4 rounded-xl transition-all ${isActive ? 'animate-pulse' : ''}`}
                  style={{
                    background: isDone ? 'var(--secondary-light)' : isActive ? '#F9731615' : 'var(--bg-surface)',
                    border: isDone ? '1px solid var(--secondary)' : isActive ? '1px solid #F9731640' : '1px solid var(--border)',
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: isDone ? 'var(--secondary)' : isActive ? channel.color : 'var(--bg-elevated)',
                      color: isDone || isActive ? 'white' : 'var(--text-muted)',
                    }}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : <channel.icon className="w-4 h-4" />}
                  </div>
                  <span className="text-sm font-medium flex-1" style={{ color: isDone ? 'var(--secondary)' : 'var(--primary)' }}>
                    {channel.name}
                  </span>
                  {isDone && <span className="text-xs font-semibold" style={{ color: 'var(--secondary)' }}>Live ✓</span>}
                  {isActive && (
                    <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: channel.color }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {phase === 'complete' && (
        <div className="text-center py-16 relative">
          {/* Confetti */}
          {confetti && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 rounded-full animate-confetti"
                  style={{
                    background: ['#F97316', '#10B981', '#8B5CF6', '#EC4899', '#F59E0B', '#3B82F6'][i % 6],
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
          )}

          <div className="relative">
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center animate-bounce" style={{ background: 'var(--secondary)' }}>
              <PartyPopper className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold mb-3" style={{ color: 'var(--primary)' }}>
              🎉 Your Business is Live!
            </h2>
            <p className="text-sm max-w-md mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>
              Congratulations! Your business is now active across all 5 channels. You're officially an entrepreneur.
            </p>

            {/* Live indicators */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {LAUNCH_CHANNELS.map((channel) => (
                <div
                  key={channel.id}
                  className="flex items-center gap-2 px-4 py-2 rounded-full"
                  style={{ background: `${channel.color}15`, border: `1px solid ${channel.color}40` }}
                >
                  <CheckCircle2 className="w-4 h-4" style={{ color: channel.color }} />
                  <span className="text-xs font-medium" style={{ color: channel.color }}>{channel.name} Live</span>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-2xl max-w-md mx-auto mb-8" style={{ background: 'var(--secondary-light)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <p className="text-sm font-bold" style={{ color: 'var(--secondary)' }}>Your AI COO is now active</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                Your CEO Agent is monitoring your business 24/7 and will alert you to opportunities and issues.
              </p>
            </div>

            <button
              onClick={() => router.push('/grow')}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white text-lg transition-all btn-press"
              style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
            >
              <Sparkles className="w-5 h-5" />
              Enter Grow Phase
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(400px) rotate(720deg); opacity: 0; }
        }
        .animate-confetti {
          animation: confetti-fall 3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}