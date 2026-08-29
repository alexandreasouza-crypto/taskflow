import React from 'react';
import {
  Search,
  Kanban,
  List,
  X,
} from 'lucide-react';
import { Category, Tag } from '../types';

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedTag: string;
  onTagChange: (value: string) => void;
  selectedPriority: string;
  onPriorityChange: (value: string) => void;
  viewMode: 'kanban' | 'list';
  onViewModeChange: (mode: 'kanban' | 'list') => void;
  categories: Category[];
  tags: Tag[];
  onClearFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedTag,
  onTagChange,
  selectedPriority,
  onPriorityChange,
  viewMode,
  onViewModeChange,
  categories,
  tags,
  onClearFilters,
}) => {
  const hasActiveFilters = Boolean(
    search || selectedCategory || selectedTag || selectedPriority
  );

  return (
    <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-3 flex-1">
        {/* Search input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por título ou descrição..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category select */}
        <div className="relative min-w-[140px]">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-teal-500 transition-all appearance-none cursor-pointer"
          >
            <option value="">Todas as Categorias</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tag select */}
        <div className="relative min-w-[130px]">
          <select
            value={selectedTag}
            onChange={(e) => onTagChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-teal-500 transition-all appearance-none cursor-pointer"
          >
            <option value="">Todas as Tags</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                #{tag.name}
              </option>
            ))}
          </select>
        </div>

        {/* Priority select */}
        <div className="relative min-w-[130px]">
          <select
            value={selectedPriority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-teal-500 transition-all appearance-none cursor-pointer"
          >
            <option value="">Todas Prioridades</option>
            <option value="URGENT">Urgente 🔥</option>
            <option value="HIGH">Alta ⚡</option>
            <option value="MEDIUM">Média 📌</option>
            <option value="LOW">Baixa ☕</option>
          </select>
        </div>

        {/* Clear filters button */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-all"
          >
            <X className="w-3.5 h-3.5" />
            <span>Limpar</span>
          </button>
        )}
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl self-end md:self-auto">
        <button
          onClick={() => onViewModeChange('kanban')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            viewMode === 'kanban'
              ? 'bg-teal-500 text-white shadow-glow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Modo Quadro Kanban"
        >
          <Kanban className="w-4 h-4" />
          <span className="hidden sm:inline">Quadro Kanban</span>
        </button>

        <button
          onClick={() => onViewModeChange('list')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            viewMode === 'list'
              ? 'bg-teal-500 text-white shadow-glow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Modo Lista Detalhada"
        >
          <List className="w-4 h-4" />
          <span className="hidden sm:inline">Modo Lista</span>
        </button>
      </div>
    </div>
  );
};
