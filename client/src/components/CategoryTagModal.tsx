import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Layers,
  Tag as TagIcon,
  Palette,
  Check,
} from 'lucide-react';
import { Category, Tag } from '../types';

interface CategoryTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  tags: Tag[];
  onCreateCategory: (name: string, color: string) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  onCreateTag: (name: string, color: string) => Promise<void>;
  onDeleteTag: (id: string) => Promise<void>;
}

const COLOR_PALETTE = [
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#8b5cf6', // Violet
  '#f59e0b', // Amber
  '#ef4444', // Rose
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#6366f1', // Indigo
  '#14b8a6', // Teal
  '#64748b', // Slate
];

export const CategoryTagModal: React.FC<CategoryTagModalProps> = ({
  isOpen,
  onClose,
  categories,
  tags,
  onCreateCategory,
  onDeleteCategory,
  onCreateTag,
  onDeleteTag,
}) => {
  const [activeTab, setActiveTab] = useState<'categories' | 'tags'>('categories');
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(`Informe o nome da ${activeTab === 'categories' ? 'categoria' : 'tag'}.`);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (activeTab === 'categories') {
        await onCreateCategory(name.trim(), selectedColor);
      } else {
        await onCreateTag(name.trim(), selectedColor);
      }
      setName('');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar item.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-card w-full max-w-md rounded-2xl shadow-2xl border border-slate-700/60 overflow-hidden animate-slide-up">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Categorias & Tags</h3>
              <p className="text-xs text-slate-400">Personalize seus marcadores e cores</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-slate-800 bg-slate-900/40 p-1">
          <button
            onClick={() => {
              setActiveTab('categories');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'categories'
                ? 'bg-slate-800 text-teal-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Categorias ({categories.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('tags');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'tags'
                ? 'bg-slate-800 text-teal-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TagIcon className="w-3.5 h-3.5" />
            <span>Tags ({tags.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Create Form */}
          <form onSubmit={handleCreate} className="space-y-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Nova {activeTab === 'categories' ? 'Categoria' : 'Tag'}
              </label>
              <input
                type="text"
                placeholder={
                  activeTab === 'categories'
                    ? 'Ex: Finanças, Saúde, Projetos...'
                    : 'Ex: Urgente, Revisão, Cliente...'
                }
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Color selection palette */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                <Palette className="w-3 h-3 text-slate-400" />
                <span>Escolher Cor</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {COLOR_PALETTE.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className="w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110 relative"
                    style={{ backgroundColor: color }}
                  >
                    {selectedColor === color && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-glow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar {activeTab === 'categories' ? 'Categoria' : 'Tag'}</span>
            </button>
          </form>

          {/* List of existing items */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              {activeTab === 'categories' ? 'Categorias Ativas' : 'Tags Cadastradas'}
            </span>

            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {activeTab === 'categories' ? (
                categories.length === 0 ? (
                  <p className="text-xs text-slate-500 py-2">Nenhuma categoria criada.</p>
                ) : (
                  categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-sm font-medium text-slate-200">{cat.name}</span>
                        {cat._count && (
                          <span className="text-[10px] text-slate-500">({cat._count.tasks} tarefas)</span>
                        )}
                      </div>

                      <button
                        onClick={() => onDeleteCategory(cat.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Excluir categoria"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )
              ) : tags.length === 0 ? (
                <p className="text-xs text-slate-500 py-2">Nenhuma tag criada.</p>
              ) : (
                tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }} />
                      <span className="text-sm font-medium text-slate-200">#{tag.name}</span>
                      {tag._count && (
                        <span className="text-[10px] text-slate-500">({tag._count.tasks} tarefas)</span>
                      )}
                    </div>

                    <button
                      onClick={() => onDeleteTag(tag.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Excluir tag"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
