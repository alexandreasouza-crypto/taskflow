import React, { useState } from 'react';
import {
  Calendar,
  AlertCircle,
  Trash2,
  Edit2,
  Plus,
  X,
  Columns,
} from 'lucide-react';
import { Task, Status, Priority, KanbanColumn } from '../types';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: Status) => void;
  onDeleteTask: (taskId: string) => void;
  onQuickAdd: (status: Status) => void;
  columns?: KanbanColumn[];
  onAddColumn?: (title: string) => void;
  onDeleteColumn?: (columnId: string) => void;
}

const DEFAULT_COLUMNS: KanbanColumn[] = [
  {
    id: 'PENDING',
    title: 'A Fazer (Pendente)',
    color: 'border-amber-500/30',
    bgBadge: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    countColor: 'text-amber-400',
  },
  {
    id: 'IN_PROGRESS',
    title: 'Em Andamento',
    color: 'border-blue-500/30',
    bgBadge: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
    countColor: 'text-blue-400',
  },
  {
    id: 'COMPLETED',
    title: 'Concluído',
    color: 'border-emerald-500/30',
    bgBadge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    countColor: 'text-emerald-400',
  },
];

const priorityBadges: Record<Priority, { label: string; bg: string; text: string }> = {
  URGENT: { label: 'Urgente 🔥', bg: 'bg-rose-500/20 border-rose-500/40', text: 'text-rose-300' },
  HIGH: { label: 'Alta ⚡', bg: 'bg-amber-500/20 border-amber-500/40', text: 'text-amber-300' },
  MEDIUM: { label: 'Média 📌', bg: 'bg-blue-500/20 border-blue-500/40', text: 'text-blue-300' },
  LOW: { label: 'Baixa ☕', bg: 'bg-slate-700/40 border-slate-600/30', text: 'text-slate-300' },
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onTaskClick,
  onStatusChange,
  onDeleteTask,
  onQuickAdd,
  columns = DEFAULT_COLUMNS,
  onAddColumn,
  onDeleteColumn,
}) => {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      onStatusChange(taskId, status as Status);
    }
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  const handleCreateColumnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColumnTitle.trim()) return;
    if (onAddColumn) {
      onAddColumn(newColumnTitle.trim());
    }
    setNewColumnTitle('');
    setIsAddingColumn(false);
  };

  const formatDueDate = (dateStr?: string | null, isCompleted?: boolean) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const isOverdue = !isCompleted && date < now;
    const isToday = !isCompleted && date >= startOfToday && date <= endOfToday;

    const formatted = date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: date.getFullYear() !== now.getFullYear() ? '2-digit' : undefined,
    });

    return {
      formatted,
      isOverdue,
      isToday,
    };
  };

  return (
    <div className="space-y-4">
      {/* Board Top Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
          <Columns className="w-4 h-4 text-teal-400" />
          <span>Quadro Kanban ({columns.length} colunas)</span>
        </div>

        {/* Create new column button trigger */}
        {!isAddingColumn ? (
          <button
            onClick={() => setIsAddingColumn(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs font-semibold text-teal-300 hover:text-white transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nova Coluna</span>
          </button>
        ) : (
          <form onSubmit={handleCreateColumnSubmit} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Nome da coluna..."
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-teal-500/60 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Criar
            </button>
            <button
              type="button"
              onClick={() => setIsAddingColumn(false)}
              className="p-1.5 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-flow-col lg:auto-cols-[minmax(320px,1fr)] gap-6 overflow-x-auto pb-4">
        {columns.map((column) => {
          const columnTasks = tasks.filter((t) => t.status === column.id);
          const isTarget = dragOverColumn === column.id;

          return (
            <div
              key={column.id}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
              className={`flex flex-col rounded-3xl bg-slate-900/70 border ${
                isTarget ? 'border-teal-500 ring-2 ring-teal-500/20 bg-slate-900/90' : column.color
              } transition-all min-h-[500px] max-h-[calc(100vh-260px)] overflow-hidden shadow-lg`}
            >
              {/* Column Header */}
              <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/90">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${column.bgBadge} truncate`}>
                    {column.title}
                  </span>
                  <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 ${column.countColor}`}>
                    {columnTasks.length}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onQuickAdd(column.id as Status)}
                    className="p-1.5 text-slate-400 hover:text-teal-300 hover:bg-teal-500/10 rounded-lg transition-colors"
                    title="Adicionar tarefa nesta coluna"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  {column.isCustom && onDeleteColumn && (
                    <button
                      onClick={() => onDeleteColumn(column.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Excluir coluna"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Column Task Cards */}
              <div className="p-3 flex-1 overflow-y-auto space-y-3">
                {columnTasks.length === 0 ? (
                  <div className="h-36 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-800 rounded-2xl">
                    <p className="text-xs text-slate-500">Nenhuma tarefa nesta coluna.</p>
                    <button
                      onClick={() => onQuickAdd(column.id as Status)}
                      className="mt-2 text-xs font-semibold text-teal-400 hover:underline"
                    >
                      + Criar primeira
                    </button>
                  </div>
                ) : (
                  columnTasks.map((task) => {
                    const dueInfo = formatDueDate(task.dueDate, task.status === 'COMPLETED');
                    const priorityInfo = priorityBadges[task.priority] || priorityBadges.MEDIUM;

                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onClick={() => onTaskClick(task)}
                        className={`glass-card p-4 rounded-2xl cursor-grab active:cursor-grabbing hover:border-teal-500/40 hover:shadow-xl transition-all duration-200 group relative ${
                          draggedTaskId === task.id ? 'opacity-40 scale-95' : 'opacity-100'
                        }`}
                      >
                        {/* Top row: Category & Priority */}
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          {task.category ? (
                            <span
                              className="text-[11px] font-semibold px-2 py-0.5 rounded-md text-white/90 border border-white/10 truncate max-w-[140px]"
                              style={{ backgroundColor: task.category.color }}
                            >
                              {task.category.name}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500 font-medium">Sem Categoria</span>
                          )}

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${priorityInfo.bg} ${priorityInfo.text}`}>
                            {priorityInfo.label}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className={`text-sm font-semibold text-slate-100 mb-1 leading-snug ${
                          task.status === 'COMPLETED' ? 'line-through text-slate-400' : ''
                        }`}>
                          {task.title}
                        </h4>

                        {/* Description preview */}
                        {task.description && (
                          <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                            {task.description}
                          </p>
                        )}

                        {/* Tags */}
                        {task.tags && task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {task.tags.map((item) => (
                              <span
                                key={item.tag.id}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-medium"
                              >
                                #{item.tag.name}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Bottom Footer: Due Date & Actions */}
                        <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                          {dueInfo ? (
                            <div className={`flex items-center gap-1.5 font-medium ${
                              dueInfo.isOverdue
                                ? 'text-rose-400 font-bold'
                                : dueInfo.isToday
                                ? 'text-amber-400 font-bold'
                                : 'text-slate-400'
                            }`}>
                              {dueInfo.isOverdue ? (
                                <AlertCircle className="w-3.5 h-3.5" />
                              ) : (
                                <Calendar className="w-3.5 h-3.5" />
                              )}
                              <span>{dueInfo.formatted}</span>
                              {dueInfo.isOverdue && <span className="text-[9px] uppercase px-1 rounded bg-rose-500/20">Atrasada</span>}
                              {dueInfo.isToday && <span className="text-[9px] uppercase px-1 rounded bg-amber-500/20">Hoje</span>}
                            </div>
                          ) : (
                            <span className="text-slate-600 text-[11px]">Sem prazo</span>
                          )}

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onTaskClick(task);
                              }}
                              className="p-1 hover:text-teal-400 hover:bg-slate-800 rounded transition-colors text-slate-400"
                              title="Editar Tarefa"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteTask(task.id);
                              }}
                              className="p-1 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors text-slate-400"
                              title="Excluir Tarefa"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
