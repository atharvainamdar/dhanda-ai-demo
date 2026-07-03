export type Phase = 'dream' | 'build' | 'grow';

export type MissionStatus = 'pending' | 'in-progress' | 'completed';

export type SpecialistRole =
  | 'market-research'
  | 'validation'
  | 'compliance'
  | 'finance'
  | 'branding'
  | 'suppliers'
  | 'website'
  | 'marketing'
  | 'operations'
  | 'sales'
  | 'support'
  | 'analytics'
  | 'hr'
  | 'ceo';

export type SpecialistStatus = 'idle' | 'working' | 'ready' | 'alert';

export type ApprovalUrgency = 'low' | 'medium' | 'high';
export type ApprovalStatus = 'pending' | 'approved' | 'dismissed';

export interface LogEntry {
  id: string;
  message: string;
  timestamp: Date;
  type?: 'info' | 'success' | 'warning' | 'progress';
}

export interface Task {
  id: string;
  name: string;
  status: 'pending' | 'completed';
}

export interface Mission {
  id: string;
  phase: Phase;
  name: string;
  status: MissionStatus;
  progress: number;
  tasks: Task[];
  description?: string;
}

export interface Insight {
  id: string;
  type: 'opportunity' | 'alert' | 'metric' | 'greeting';
  title: string;
  description: string;
  value?: string;
  change?: string;
  positive?: boolean;
  actionRequired?: boolean;
  specialistId?: string;
}

export interface Specialist {
  id: string;
  name: string;
  role: SpecialistRole;
  status: SpecialistStatus;
  progress: number;
  tasks: Task[];
  logs: LogEntry[];
  insights: Insight[];
  color: string;
}

export interface Approval {
  id: string;
  specialistId: string;
  title: string;
  description: string;
  expectedValue?: string;
  urgency: ApprovalUrgency;
  status: ApprovalStatus;
  submittedAt: Date;
}

export interface BusinessMetrics {
  revenue: number;
  orders: number;
  profit: number;
  activeCustomers: number;
  marketingSpend: number;
  inventoryValue: number;
  pendingTasks: number;
  revenueChange: number;
  ordersChange: number;
  profitChange: number;
  customersChange: number;
}

export interface Business {
  name: string;
  idea: string;
  location: string;
  phase: Phase;
  missions: Mission[];
  specialists: Specialist[];
  approvals: Approval[];
  metrics: BusinessMetrics;
  brandingChoices?: {
    name: string;
    logoStyle: string;
    brandIdentity: string;
  };
  websiteReady: boolean;
  launched: boolean;
}

export interface LaunchItem {
  channel: string;
  icon: string;
  status: 'pending' | 'live';
}