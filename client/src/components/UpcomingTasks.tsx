import React from 'react';
import {
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Task, Status, Priority } from '../types';

interface UpcomingTasksProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: Status) => void;
  onViewAllTasks: () => void;
}

const priorityBadges: Record<Priority, { label: string; bg: string; text: string }> = {
  URGENT: { label: 'Urgente 🔥', bg: 'bg-rose-500/20 border-rose-500/40', text: 'text-rose-300' },
  HIGH: { label: 'Alta ⚡', bg: 'bg-amber-500/20 border-amber-500/40', text: 'text-amber-300' },
  MEDIUM: { label: 'Média 📌', bg: 'bg-blue-500/20 border-blue-500/40', text: 'text-blue-300' },
  LOW: { label: 'Baixa ☕', bg: 'bg-slate-700/40 border-slate-600/30', text: 'text-slate-300' },
};

export const UpcomingTasks: React.FC<UpcomingTasksProps> = ({
  tasks,
  onTaskClick,
  onStatusChange,
  onViewAllTasks,
}) => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  const tomorrowEnd = new Date(todayEnd.getTime() + 24 * 60 * 60 * 1000);

  const getDeadlineBadge = (dueDateStr?: string | null) => {
    if (!dueDateStr) return null;
    const date = new Date(dueDateStr);

    if (date < now && date < todayStart) {
      return {
        label: 'Atrasada',
        color: 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse',
        icon: AlertTriangle,
      };
    }
    if (date >= todayStart && date <= todayEnd) {
      return {
        label: 'Vence Hoje',
        color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        icon: Clock,
      };
    }
    if (date > todayEnd && date <= tomorrowEnd) {
      return {
        label: 'Amanhã',
        color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
        icon: Calendar,
      };
    }

    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return {
      label: `Em ${diffDays} dias`,
      color: 'bg-slate-800 text-teal-300 border-slate-700',
      icon: Calendar,
    };
  };

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-700/60 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Tarefas Próximas a Vencer</h3>
            <p className="text-xs text-slate-400">Prazos e prioridades do seu cronograma</p>
          </div>
        </div>

        <button
          onClick={onViewAllTasks}
          className="flex items-center gap-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300 hover:underline group"
        >
          <span>Ver todas</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Task List or Empty State */}
      {tasks.length === 0 ? (
        <div className="py-8 px-4 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80">
          <Sparkles className="w-8 h-8 text-teal-400 mx-auto mb-2 opacity-80" />
          <p className="text-sm font-semibold text-slate-300">Nenhuma tarefa urgente ou com prazo próximo!</p>
          <p className="text-xs text-slate-500 mt-1">Você está com seu cronograma 100% em dia.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-800/80">
          {tasks.map((task) => {
            const isCompleted = task.status === 'COMPLETED';
            const deadline = getDeadlineBadge(task.dueDate);
            const priorityInfo = priorityBadges[task.priority] || priorityBadges.MEDIUM;
            const formattedDate = task.dueDate
              ? new Date(task.dueDate).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                })
              : '';

            return (
              <div
                key={task.id}
                onClick={() => onTaskClick(task)}
                className="py-3.5 px-2 flex items-center justify-between gap-4 hover:bg-slate-800/40 rounded-xl cursor-pointer transition-colors group"
              >
                {/* Left: Quick complete checkbox & Title */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusChange(task.id, isCompleted ? 'PENDING' : 'COMPLETED');
                    }}
                    className="text-slate-500 hover:text-emerald-400 transition-colors shrink-0"
                    title="Concluir tarefa"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500 hover:text-teal-400" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="text-sm font-semibold text-slate-200 truncate group-hover:text-teal-300 transition-colors">
                        {task.title}
                      </h4>

                      {task.category && (
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md text-white/90 border border-white/10 shrink-0 hidden sm:inline"
                          style={{ backgroundColor: task.category.color }}
                        >
                          {task.category.name}
                        </span>
                      )}
                    </div>

                    {task.description && (
                      <p className="text-xs text-slate-400 truncate max-w-lg">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Deadline badge, Priority & Date */}
                <div className="flex items-center gap-3 shrink-0">
                  {deadline && (
                    <div
                      className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-xl border ${deadline.color}`}
                    >
                      <deadline.icon className="w-3.5 h-3.5" />
                      <span>{deadline.label}</span>
                      <span className="text-[10px] opacity-75 font-normal">({formattedDate})</span>
                    </div>
                  )}

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border hidden md:inline ${priorityInfo.bg} ${priorityInfo.text}`}
                  >
                    {priorityInfo.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
