import React from 'react';
import {
  Calendar,
  AlertCircle,
  CheckCircle2,
  Circle,
  Trash2,
  Edit2,
} from 'lucide-react';
import { Task, Status, Priority } from '../types';

interface TaskListViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: Status) => void;
  onDeleteTask: (taskId: string) => void;
}

const priorityBadges: Record<Priority, { label: string; bg: string; text: string }> = {
  URGENT: { label: 'Urgente 🔥', bg: 'bg-rose-500/20 border-rose-500/40', text: 'text-rose-300' },
  HIGH: { label: 'Alta ⚡', bg: 'bg-amber-500/20 border-amber-500/40', text: 'text-amber-300' },
  MEDIUM: { label: 'Média 📌', bg: 'bg-blue-500/20 border-blue-500/40', text: 'text-blue-300' },
  LOW: { label: 'Baixa ☕', bg: 'bg-slate-700/40 border-slate-600/30', text: 'text-slate-300' },
};

export const TaskListView: React.FC<TaskListViewProps> = ({
  tasks,
  onTaskClick,
  onStatusChange,
  onDeleteTask,
}) => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  if (tasks.length === 0) {
    return (
      <div className="glass-card p-12 rounded-2xl text-center border-dashed">
        <p className="text-slate-400 font-medium">Nenhuma tarefa encontrada com os filtros selecionados.</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="divide-y divide-slate-800/80">
        {tasks.map((task) => {
          const isCompleted = task.status === 'COMPLETED';
          const priorityInfo = priorityBadges[task.priority] || priorityBadges.MEDIUM;

          let isOverdue = false;
          let isToday = false;
          let formattedDate: string | null = null;

          if (task.dueDate) {
            const date = new Date(task.dueDate);
            isOverdue = !isCompleted && date < now;
            isToday = !isCompleted && date >= startOfToday && date <= endOfToday;
            formattedDate = date.toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: date.getFullYear() !== now.getFullYear() ? '2-digit' : undefined,
            });
          }

          return (
            <div
              key={task.id}
              onClick={() => onTaskClick(task)}
              className={`p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-slate-800/50 cursor-pointer transition-colors group ${
                isCompleted ? 'bg-slate-900/40 opacity-75' : ''
              }`}
            >
              {/* Left: Checkbox & Info */}
              <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                {/* Complete Checkbox */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(task.id, isCompleted ? 'PENDING' : 'COMPLETED');
                  }}
                  className="mt-0.5 sm:mt-0 text-slate-500 hover:text-teal-400 transition-colors shrink-0"
                  title={isCompleted ? 'Marcar como pendente' : 'Concluir tarefa'}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 hover:text-teal-400" />
                  )}
                </button>

                {/* Title and Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4
                      className={`text-sm font-semibold text-slate-100 truncate max-w-md ${
                        isCompleted ? 'line-through text-slate-400' : ''
                      }`}
                    >
                      {task.title}
                    </h4>

                    {/* Category pill */}
                    {task.category && (
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md text-white/90 border border-white/10"
                        style={{ backgroundColor: task.category.color }}
                      >
                        {task.category.name}
                      </span>
                    )}

                    {/* Priority badge */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${priorityInfo.bg} ${priorityInfo.text}`}
                    >
                      {priorityInfo.label}
                    </span>
                  </div>

                  {task.description && (
                    <p className="text-xs text-slate-400 truncate max-w-xl mb-1">
                      {task.description}
                    </p>
                  )}

                  {/* Tags */}
                  {task.tags && task.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 mt-1">
                      {task.tags.map((item) => (
                        <span
                          key={item.tag.id}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                        >
                          #{item.tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Due Date & Actions */}
              <div className="flex items-center gap-4 shrink-0">
                {/* Due date badge */}
                {formattedDate ? (
                  <div
                    className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border ${
                      isOverdue
                        ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                        : isToday
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        : 'bg-slate-800/80 text-slate-400 border-slate-700'
                    }`}
                  >
                    {isOverdue ? (
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    ) : (
                      <Calendar className="w-3.5 h-3.5" />
                    )}
                    <span>{formattedDate}</span>
                    {isOverdue && <span className="text-[9px] uppercase font-bold">Atrasada</span>}
                  </div>
                ) : (
                  <span className="text-slate-600 text-xs hidden sm:inline">Sem prazo</span>
                )}

                {/* Status selector */}
                <select
                  value={task.status}
                  onChange={(e) => {
                    e.stopPropagation();
                    onStatusChange(task.id, e.target.value as Status);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 focus:outline-none focus:border-teal-500 cursor-pointer hidden md:block"
                >
                  <option value="PENDING">Pendente</option>
                  <option value="IN_PROGRESS">Em Andamento</option>
                  <option value="COMPLETED">Concluída</option>
                </select>

                {/* Action buttons */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTaskClick(task);
                    }}
                    className="p-1.5 hover:text-teal-400 hover:bg-slate-800 rounded-lg transition-colors text-slate-400"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTask(task.id);
                    }}
                    className="p-1.5 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-slate-400"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
