import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Layers,
  Tag as TagIcon,
  Flame,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Task, Category, Tag, Priority, Status } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: {
    title: string;
    description?: string;
    dueDate?: string | null;
    priority: Priority;
    status: Status;
    categoryId?: string | null;
    tagIds: string[];
  }) => Promise<void>;
  taskToEdit?: Task | null;
  categories: Category[];
  tags: Tag[];
  initialStatus?: Status;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  taskToEdit,
  categories,
  tags,
  initialStatus = 'PENDING',
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [status, setStatus] = useState<Status>(initialStatus);
  const [categoryId, setCategoryId] = useState<string>('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setDueDate(
        taskToEdit.dueDate
          ? new Date(taskToEdit.dueDate).toISOString().split('T')[0]
          : ''
      );
      setPriority(taskToEdit.priority);
      setStatus(taskToEdit.status);
      setCategoryId(taskToEdit.categoryId || '');
      setSelectedTagIds(taskToEdit.tags?.map((t) => t.tag.id) || []);
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('MEDIUM');
      setStatus(initialStatus);
      setCategoryId(categories.length > 0 ? categories[0].id : '');
      setSelectedTagIds([]);
    }
    setError('');
  }, [taskToEdit, isOpen, initialStatus, categories]);

  if (!isOpen) return null;

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Por favor, informe o título da tarefa.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSave({
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        priority,
        status,
        categoryId: categoryId || null,
        tagIds: selectedTagIds,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar tarefa.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-card w-full max-w-lg rounded-2xl shadow-2xl border border-slate-700/60 overflow-hidden animate-slide-up">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                {taskToEdit ? 'Editar Tarefa' : 'Nova Tarefa'}
              </h3>
              <p className="text-xs text-slate-400">
                {taskToEdit ? 'Atualize os detalhes da tarefa' : 'Preencha as informações para organizar sua rotina'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Título da Tarefa <span className="text-teal-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Entregar relatório trimestral..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Descrição Detalhada
            </label>
            <textarea
              rows={3}
              placeholder="Adicione notas, links ou instruções adicionais..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none"
            />
          </div>

          {/* Grid: Due Date & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Due Date */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-400" />
                <span>Data Limite (Prazo)</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Nível de Prioridade</span>
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-teal-500 cursor-pointer"
              >
                <option value="URGENT">Urgente 🔥</option>
                <option value="HIGH">Alta ⚡</option>
                <option value="MEDIUM">Média 📌</option>
                <option value="LOW">Baixa ☕</option>
              </select>
            </div>
          </div>

          {/* Grid: Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>Categoria</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-teal-500 cursor-pointer"
              >
                <option value="">Sem Categoria</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Status da Tarefa</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-teal-500 cursor-pointer"
              >
                <option value="PENDING">A Fazer (Pendente)</option>
                <option value="IN_PROGRESS">Em Andamento</option>
                <option value="COMPLETED">Concluída</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <TagIcon className="w-3.5 h-3.5 text-pink-400" />
              <span>Tags / Etiquetas</span>
            </label>

            {tags.length === 0 ? (
              <p className="text-xs text-slate-500">Nenhuma tag criada ainda.</p>
            ) : (
              <div className="flex flex-wrap gap-2 pt-1">
                {tags.map((tag) => {
                  const isSelected = selectedTagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                        isSelected
                          ? 'bg-teal-500 text-white shadow-glow border border-teal-400'
                          : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      #{tag.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 shadow-glow rounded-xl transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Salvando...' : taskToEdit ? 'Salvar Alterações' : 'Criar Tarefa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
