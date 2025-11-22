export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
  completedAt?: number;
  dueDate?: number;
  assigneeEmail?: string;
  reminderSent?: boolean;
}

export enum FilterType {
  ALL = 'ALL',
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING'
}

export interface DashboardStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
}