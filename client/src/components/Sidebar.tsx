import React from 'react';
import {
  Home,
  CheckSquare2,
  ListTodo,
  Tag as TagIcon,
  Settings,
  LogOut,
  Plus,
  ChevronRight,
  X,
} from 'lucide-react';
import { User } from '../types';

export type NavTab = 'home' | 'tasks' | 'categories' | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  user: User | null;
  onOpenNewTask: () => void;
  onLogout: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  taskCounts?: {
    total: number;
    pending: number;
    completed: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  user,
  onOpenNewTask,
  onLogout,
  isOpenMobile,
  onCloseMobile,
  taskCounts,
}) => {
  const navItems = [
    {
      id: 'home' as NavTab,
      label: 'Início',
      icon: Home,
      description: 'Painel & Métricas',
    },
    {
      id: 'tasks' as NavTab,
      label: 'Minhas Tarefas',
      icon: ListTodo,
      description: 'Kanban & Lista',
      badge: taskCounts?.pending ? `${taskCounts.pending}` : undefined,
    },
    {
      id: 'categories' as NavTab,
      label: 'Categorias & Tags',
      icon: TagIcon,
      description: 'Marcadores e Cores',
    },
    {
      id: 'settings' as NavTab,
      label: 'Configurações',
      icon: Settings,
      description: 'Perfil & Ajustes',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900/95 backdrop-blur-2xl border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Section */}
        <div>
          {/* Logo & Brand Header */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center shadow-glow">
                <CheckSquare2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-400 to-indigo-400">
                    TaskFlow
                  </span>
                  <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20">
                    PRO
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Gestão & Produtividade</p>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Create Task CTA */}
          <div className="p-4">
            <button
              onClick={() => {
                onOpenNewTask();
                if (isOpenMobile) onCloseMobile();
              }}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 shadow-glow flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Tarefa</span>
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="px-3 space-y-1.5">
            <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Menu Principal
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (isOpenMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-500/15 to-indigo-500/15 text-teal-300 border border-teal-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        isActive ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <div className="text-left">
                      <span className="block leading-tight font-semibold">{item.label}</span>
                      <span className="text-[10px] text-slate-500 block">{item.description}</span>
                    </div>
                  </div>

                  {item.badge ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      {item.badge}
                    </span>
                  ) : isActive ? (
                    <ChevronRight className="w-4 h-4 text-teal-400" />
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: User Card & Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-200 truncate">{user?.name || 'Usuário'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email || 'conta@taskflow.dev'}</p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0 ml-1"
              title="Sair da Conta"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
