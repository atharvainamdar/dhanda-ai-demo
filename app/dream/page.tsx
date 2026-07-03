'use client';

import { Suspense } from 'react';
import DreamPageContent from './DreamPageContent';

export default function DreamPage() {
  return (
    <Suspense fallback={<DreamPageSkeleton />}>
      <DreamPageContent />
    </Suspense>
  );
}

function DreamPageSkeleton() {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-main)' }}>
      <div className="w-[280px] border-r" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
        <div className="p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg" style={{ background: 'var(--accent)' }} />
            <div className="h-4 w-24 rounded" style={{ background: 'var(--bg-elevated)' }} />
          </div>
        </div>
      </div>
      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto mt-8">
          <div className="h-8 w-48 rounded mb-4 mx-auto" style={{ background: 'var(--bg-elevated)' }} />
          <div className="h-4 w-72 rounded mx-auto" style={{ background: 'var(--bg-elevated)' }} />
        </div>
      </main>
    </div>
  );
}