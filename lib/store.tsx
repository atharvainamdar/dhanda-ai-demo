'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Business, Phase, Mission, Specialist, Approval } from '@/types';

const initialMissionData: Mission[] = [
  // Dream phase
  { id: 'idea', phase: 'dream', name: 'Business Idea', status: 'in-progress', progress: 0, tasks: [], description: 'Capture and structure your business vision' },
  { id: 'validation', phase: 'dream', name: 'Market Research', status: 'pending', progress: 0, tasks: [], description: 'Research your market, competitors, and opportunity' },
  { id: 'research', phase: 'dream', name: 'Validation', status: 'pending', progress: 0, tasks: [], description: 'Validate your business idea viability' },
  { id: 'model', phase: 'dream', name: 'Business Model', status: 'pending', progress: 0, tasks: [], description: 'Define your revenue model and cost structure' },
  { id: 'funding', phase: 'dream', name: 'Funding Plan', status: 'pending', progress: 0, tasks: [], description: 'Plan your startup capital and funding sources' },

  // Build phase
  { id: 'registration', phase: 'build', name: 'Registration', status: 'pending', progress: 0, tasks: [], description: 'Register your business legally' },
  { id: 'compliance', phase: 'build', name: 'Compliance', status: 'pending', progress: 0, tasks: [], description: 'Handle all legal requirements and licenses' },
  { id: 'branding', phase: 'build', name: 'Branding', status: 'pending', progress: 0, tasks: [], description: 'Create your brand identity, name, and logo' },
  { id: 'suppliers', phase: 'build', name: 'Suppliers', status: 'pending', progress: 0, tasks: [], description: 'Find and connect with suppliers' },
  { id: 'website', phase: 'build', name: 'Website', status: 'pending', progress: 0, tasks: [], description: 'Build and publish your website' },
  { id: 'payments', phase: 'build', name: 'Payments', status: 'pending', progress: 0, tasks: [], description: 'Set up payment infrastructure' },
  { id: 'launch', phase: 'build', name: 'Launch', status: 'pending', progress: 0, tasks: [], description: 'Launch your business across all channels' },

  // Grow phase
  { id: 'marketing', phase: 'grow', name: 'Marketing AI', status: 'pending', progress: 0, tasks: [], description: 'AI-powered marketing campaigns' },
  { id: 'sales', phase: 'grow', name: 'Sales AI', status: 'pending', progress: 0, tasks: [], description: 'AI-driven sales optimization' },
  { id: 'finance-ops', phase: 'grow', name: 'Finance AI', status: 'pending', progress: 0, tasks: [], description: 'Financial monitoring and forecasting' },
  { id: 'ops', phase: 'grow', name: 'Operations AI', status: 'pending', progress: 0, tasks: [], description: 'Operational automation and optimization' },
  { id: 'support', phase: 'grow', name: 'Support AI', status: 'pending', progress: 0, tasks: [], description: 'AI customer support' },
  { id: 'analytics', phase: 'grow', name: 'Analytics AI', status: 'pending', progress: 0, tasks: [], description: 'Business intelligence and insights' },
];

const initialSpecialists: Specialist[] = [
  { id: 'ceo', name: 'CEO Agent', role: 'ceo', status: 'idle', progress: 0, tasks: [], logs: [], insights: [], color: '#F97316' },
  { id: 'market-research', name: 'Market Research', role: 'market-research', status: 'idle', progress: 0, tasks: [], logs: [], insights: [], color: '#8B5CF6' },
  { id: 'compliance', name: 'Compliance', role: 'compliance', status: 'idle', progress: 0, tasks: [], logs: [], insights: [], color: '#06B6D4' },
  { id: 'finance', name: 'Finance', role: 'finance', status: 'idle', progress: 0, tasks: [], logs: [], insights: [], color: '#10B981' },
  { id: 'branding', name: 'Branding', role: 'branding', status: 'idle', progress: 0, tasks: [], logs: [], insights: [], color: '#EC4899' },
  { id: 'suppliers', name: 'Suppliers', role: 'suppliers', status: 'idle', progress: 0, tasks: [], logs: [], insights: [], color: '#F59E0B' },
  { id: 'website', name: 'Website', role: 'website', status: 'idle', progress: 0, tasks: [], logs: [], insights: [], color: '#3B82F6' },
  { id: 'marketing', name: 'Marketing', role: 'marketing', status: 'idle', progress: 0, tasks: [], logs: [], insights: [], color: '#EF4444' },
  { id: 'operations', name: 'Operations', role: 'operations', status: 'idle', progress: 0, tasks: [], logs: [], insights: [], color: '#6366F1' },
];

const initialMetrics: Business['metrics'] = {
  revenue: 84750,
  orders: 234,
  profit: 31200,
  activeCustomers: 189,
  marketingSpend: 12500,
  inventoryValue: 45000,
  pendingTasks: 7,
  revenueChange: 12,
  ordersChange: 18,
  profitChange: 23,
  customersChange: 46,
};

const initialApprovals: Approval[] = [
  {
    id: 'apr-1',
    specialistId: 'marketing',
    title: 'Competitor Ad Pause Detected',
    description: 'SweetTreats paused their Facebook ads. This is your chance to capture their audience.',
    expectedValue: '₹84,000 additional revenue this month',
    urgency: 'high',
    status: 'pending',
    submittedAt: new Date(),
  },
  {
    id: 'apr-2',
    specialistId: 'finance',
    title: 'Cash Flow Optimization',
    description: 'You can renegotiate payment terms with 3 suppliers to improve cash flow by ₹18,000.',
    urgency: 'medium',
    status: 'pending',
    submittedAt: new Date(Date.now() - 3600000),
  },
  {
    id: 'apr-3',
    specialistId: 'operations',
    title: 'Supplier Delay Alert',
    description: 'Your packaging supplier is delayed by 2 days. Alternative source found with same pricing.',
    expectedValue: 'Avoid 3-day production delay',
    urgency: 'high',
    status: 'pending',
    submittedAt: new Date(Date.now() - 7200000),
  },
];

const initialBusiness: Business = {
  name: '',
  idea: '',
  location: '',
  phase: 'dream',
  missions: initialMissionData,
  specialists: initialSpecialists,
  approvals: initialApprovals,
  metrics: initialMetrics,
  websiteReady: false,
  launched: false,
};

type Action =
  | { type: 'SET_IDEA'; idea: string; location?: string }
  | { type: 'COMPLETE_IDEA' }
  | { type: 'START_MISSION'; missionId: string }
  | { type: 'UPDATE_MISSION'; missionId: string; progress: number; status?: Mission['status'] }
  | { type: 'COMPLETE_MISSION'; missionId: string }
  | { type: 'ADD_LOG'; specialistId: string; message: string; logType?: 'info' | 'success' | 'warning' | 'progress' }
  | { type: 'UPDATE_SPECIALIST'; specialistId: string; status: Specialist['status']; progress?: number }
  | { type: 'ADD_TASK'; specialistId: string; taskName: string }
  | { type: 'COMPLETE_TASK'; specialistId: string; taskId: string }
  | { type: 'SET_PHASE'; phase: Phase }
  | { type: 'APPROVE_ACTION'; approvalId: string }
  | { type: 'DISMISS_ACTION'; approvalId: string }
  | { type: 'SET_BRAND_CHOICES'; choices: Business['brandingChoices'] }
  | { type: 'SET_WEBSITE_READY'; ready: boolean }
  | { type: 'LAUNCH' }
  | { type: 'RESET' };

function reducer(state: Business, action: Action): Business {
  switch (action.type) {
    case 'SET_IDEA':
      return { ...state, idea: action.idea, location: action.location || '' };

    case 'COMPLETE_IDEA': {
      const missions = state.missions.map(m =>
        m.id === 'idea' ? { ...m, status: 'completed' as const, progress: 100 } : m
      );
      return { ...state, missions, phase: 'dream' };
    }

    case 'START_MISSION': {
      const missions = state.missions.map(m =>
        m.id === action.missionId ? { ...m, status: 'in-progress' as const } : m
      );
      return { ...state, missions };
    }

    case 'UPDATE_MISSION': {
      const missions = state.missions.map(m =>
        m.id === action.missionId ? { ...m, progress: action.progress, ...(action.status ? { status: action.status } : {}) } : m
      );
      return { ...state, missions };
    }

    case 'COMPLETE_MISSION': {
      const missions = state.missions.map(m =>
        m.id === action.missionId ? { ...m, status: 'completed' as const, progress: 100 } : m
      );
      return { ...state, missions };
    }

    case 'ADD_LOG': {
      const specialists = state.specialists.map(s =>
        s.id === action.specialistId
          ? {
              ...s,
              logs: [...s.logs, { id: `log-${Date.now()}`, message: action.message, timestamp: new Date(), type: action.logType || 'info' }],
            }
          : s
      );
      return { ...state, specialists };
    }

    case 'UPDATE_SPECIALIST': {
      const specialists = state.specialists.map(s =>
        s.id === action.specialistId ? { ...s, status: action.status, ...(action.progress !== undefined ? { progress: action.progress } : {}) } : s
      );
      return { ...state, specialists };
    }

    case 'ADD_TASK': {
      const specialists = state.specialists.map(s =>
        s.id === action.specialistId
          ? { ...s, tasks: [...s.tasks, { id: `task-${Date.now()}`, name: action.taskName, status: 'pending' as const }] }
          : s
      );
      return { ...state, specialists };
    }

    case 'COMPLETE_TASK': {
      const specialists = state.specialists.map(s =>
        s.id === action.specialistId
          ? { ...s, tasks: s.tasks.map(t => (t.id === action.taskId ? { ...t, status: 'completed' as const } : t)) }
          : s
      );
      return { ...state, specialists };
    }

    case 'SET_PHASE':
      return { ...state, phase: action.phase };

    case 'APPROVE_ACTION': {
      const approvals = state.approvals.map(a =>
        a.id === action.approvalId ? { ...a, status: 'approved' as const } : a
      );
      return { ...state, approvals };
    }

    case 'DISMISS_ACTION': {
      const approvals = state.approvals.map(a =>
        a.id === action.approvalId ? { ...a, status: 'dismissed' as const } : a
      );
      return { ...state, approvals };
    }

    case 'SET_BRAND_CHOICES':
      return { ...state, brandingChoices: action.choices };

    case 'SET_WEBSITE_READY':
      return { ...state, websiteReady: action.ready };

    case 'LAUNCH':
      return { ...state, launched: true, phase: 'grow' };

    case 'RESET':
      return initialBusiness;

    default:
      return state;
  }
}

const BusinessContext = createContext<{
  state: Business;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialBusiness);
  return <BusinessContext.Provider value={{ state, dispatch }}>{children}</BusinessContext.Provider>;
}

export function useBusiness() {
  const ctx = useContext(BusinessContext);
  if (!ctx) throw new Error('useBusiness must be used within BusinessProvider');
  return ctx;
}

export { initialMissionData, initialSpecialists, initialMetrics, initialApprovals };