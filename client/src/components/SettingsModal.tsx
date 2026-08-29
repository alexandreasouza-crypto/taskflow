import React from 'react';
import {
  X,
  Mail,
  Calendar,
  Moon,
  Sparkles,
  Database,
} from 'lucide-react';
import { User } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  totalTasks: number;
  totalCategories: number;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  totalTasks,
  totalCategories,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-card w-full max-w-lg rounded-3xl shadow-2xl border border-slate-700/60 overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Configurações & Perfil</h3>
              <p className="text-xs text-slate-400">Informações da sua conta e preferências</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* User Profile Card */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow-glow">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-base font-bold text-white truncate">{user?.name}</h4>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-teal-400" />
                <span>{user?.email}</span>
              </p>
              <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Membro desde {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'Hoje'}</span>
              </p>
            </div>
          </div>

          {/* Database & Stats Overview */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Estatísticas da Workspace
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block mb-1">Tarefas Registradas</span>
                <span className="text-2xl font-black text-teal-400">{totalTasks}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block mb-1">Categorias Ativas</span>
                <span className="text-2xl font-black text-indigo-400">{totalCategories}</span>
              </div>
            </div>
          </div>

          {/* App Info & Theme */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Moon className="w-4 h-4 text-teal-400" />
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Tema da Interface</span>
                  <span className="text-[11px] text-slate-500">Modo Escuro Ativo (Otimizado)</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20">
                Padrão Dark
              </span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-indigo-400" />
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Armazenamento</span>
                  <span className="text-[11px] text-slate-500">SQLite Local + Prisma ORM</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Conectado
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
