export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type Status = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | string;

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  _count?: {
    tasks: number;
  };
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  _count?: {
    tasks: number;
  };
}

export interface TaskTagRelation {
  taskId: string;
  tagId: string;
  tag: Tag;
}

export interface Task {
  id: string;
  userId: string;
  categoryId?: string | null;
  category?: Category | null;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  priority: Priority;
  status: Status;
  completedAt?: string | null;
  tags?: TaskTagRelation[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface DayHistory {
  date: string;
  dayName: string;
  count: number;
  isToday: boolean;
}

export interface DashboardMetrics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedToday: number;
  completedLast7Days: number;
  overdueTasks: number;
  dueToday: number;
  upcomingTasks: number;
  completionRate: number;
}

export interface CategoryBreakdown {
  id: string;
  name: string;
  color: string;
  total: number;
  completed: number;
  active: number;
  percentage: number;
}

export interface PriorityBreakdown {
  URGENT: number;
  HIGH: number;
  MEDIUM: number;
  LOW: number;
}

export interface DashboardStatsResponse {
  metrics: DashboardMetrics;
  last7DaysHistory: DayHistory[];
  priorityBreakdown: PriorityBreakdown;
  categoryBreakdown: CategoryBreakdown[];
  upcomingTasksList: Task[];
  overduePreview: Task[];
  dueTodayPreview: Task[];
  recentTasks: Task[];
  totalCategories: number;
  totalTags: number;
}

export interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  bgBadge: string;
  countColor: string;
  isCustom?: boolean;
}
