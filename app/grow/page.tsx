'use client';

import { Suspense } from 'react';
import GrowPageContent from './GrowPageContent';

export default function GrowPage() {
  return (
    <Suspense fallback={<GrowPageSkeleton />}>
      <GrowPageContent />
    </Suspense>
  );
}

function GrowPageSkeleton() {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-main)' }}>
      <div className="w-[280px] border-r" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
        <div className="p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg" style={{ background: '#10B981' }} />
            <div className="h-4 w-24 rounded" style={{ background: 'var(--bg-elevated)' }} />
          </div>
        </div>
      </div>
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto mt-8">
          <div className="h-8 w-48 rounded mb-4" style={{ background: 'var(--bg-elevated)' }} />
          <div className="h-4 w-72 rounded mb-6" style={{ background: 'var(--bg-elevated)' }} />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 rounded-2xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}