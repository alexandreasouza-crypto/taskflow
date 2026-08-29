import React from 'react';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
  return (
    <div className="fixed bottom-6 right-6 z-40 group">
      {/* Tooltip */}
      <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-slate-900/90 text-white text-xs font-semibold whitespace-nowrap shadow-xl border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-md hidden sm:block">
        Nova Tarefa (Criar Rápido)
      </div>

      {/* Button */}
      <button
        onClick={onClick}
        aria-label="Criar nova tarefa"
        className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white flex items-center justify-center shadow-glow hover:shadow-glow-purple transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-teal-500/30"
      >
        <Plus className="w-7 h-7" />
      </button>
    </div>
  );
};
