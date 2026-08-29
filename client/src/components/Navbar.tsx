import React from 'react';
import {
  CheckSquare2,
  Plus,
  Tag as TagIcon,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onOpenNewTask: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenNewTask,
  onOpenSettings,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-indigo-600 flex items-center justify-center shadow-glow">
            <CheckSquare2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-400 to-indigo-400">
                TaskFlow
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Painel & Gestão Pessoal</p>
          </div>
        </div>

        {/* Action buttons & User profile */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-xl transition-all"
            title="Gerenciar Categorias e Tags"
          >
            <TagIcon className="w-4 h-4 text-indigo-400" />
            <span className="hidden md:inline">Categorias & Tags</span>
          </button>

          <button
            onClick={onOpenNewTask}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 shadow-glow rounded-xl transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Tarefa</span>
          </button>

          <div className="h-6 w-px bg-slate-800 mx-1" />

          {/* User info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400 font-semibold text-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-slate-200 leading-tight">{user?.name}</p>
                <p className="text-xs text-slate-400 leading-tight truncate max-w-[120px]">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
              title="Sair da Conta"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
