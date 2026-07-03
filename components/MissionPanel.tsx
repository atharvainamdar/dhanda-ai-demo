'use client';

import { useBusiness } from '@/lib/store';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Circle,
  ChevronRight,
  Loader2,
  FileText,
} from 'lucide-react';

export default function MissionPanel({ missionId }: { missionId: string }) {
  const { state, dispatch } = useBusiness();
  const router = useRouter();
  const mission = state.missions.find(m => m.id === missionId);

  if (!mission) return null;

  const handleStart = () => {
    dispatch({ type: 'START_MISSION', missionId });
    // This would trigger the AI flow for this mission
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ background: '#8B5CF615' }}>
          <FileText className="w-8 h-8" style={{ color: '#8B5CF6' }} />
        </div>
        <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--primary)' }}>{mission.name}</h2>
        {mission.description && (
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{mission.description}</p>
        )}
      </div>

      <div className="rounded-2xl p-8 text-center" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        {mission.status === 'pending' && (
          <>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              This mission is ready to begin. Your AI specialists are standing by.
            </p>
            <button
              onClick={handleStart}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all btn-press"
              style={{ background: '#8B5CF6' }}
            >
              <Loader2 className="w-4 h-4" />
              Start Mission
            </button>
          </>
        )}

        {mission.status === 'in-progress' && (
          <>
            <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin" style={{ color: '#8B5CF6' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--primary)' }}>Mission in progress...</p>
            <div className="mt-4 h-2 rounded-full overflow-hidden" style={{ background: '#8B5CF620' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${mission.progress}%`, background: '#8B5CF6' }}
              />
            </div>
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>{mission.progress}% complete</p>
          </>
        )}

        {mission.status === 'completed' && (
          <>
            <CheckCircle2 className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--secondary)' }} />
            <p className="text-sm font-bold mb-4" style={{ color: 'var(--secondary)' }}>Mission Completed!</p>
            <button
              onClick={() => {
                const nextMission = state.missions.find(
                  (m, i) => state.missions.findIndex(m2 => m2.id === mission.id) < i && m.status === 'pending' && m.phase === mission.phase
                );
                if (nextMission) router.push(`/${mission.phase}?mission=${nextMission.id}`);
              }}
              className="inline-flex items-center gap-1 text-sm font-semibold"
              style={{ color: '#8B5CF6' }}
            >
              Continue to next mission <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}