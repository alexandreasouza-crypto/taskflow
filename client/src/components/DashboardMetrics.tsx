import React from 'react';
import {
  CheckCircle,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Layers,
  Flame,
  Award,
  ArrowUpRight,
  Sun,
  Sunset,
  Moon,
} from 'lucide-react';
import { DashboardStatsResponse } from '../types';

interface DashboardMetricsProps {
  userName?: string;
  data: DashboardStatsResponse | null;
  isLoading: boolean;
  onFilterClick?: (filterType: string, value?: string) => void;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  userName = 'Produtor(a)',
  data,
  isLoading,
  onFilterClick,
}) => {
  // Dynamic Greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return { text: 'Bom dia', icon: Sun, color: 'text-amber-400' };
    } else if (hour >= 12 && hour < 18) {
      return { text: 'Boa tarde', icon: Sunset, color: 'text-orange-400' };
    } else {
      return { text: 'Boa noite', icon: Moon, color: 'text-indigo-400' };
    }
  };

  const greeting = getGreeting();
  const firstName = userName.split(' ')[0] || 'Produtor(a)';

  if (isLoading || !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-64 bg-slate-800/60 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-48 rounded-3xl bg-slate-800/50 border border-slate-700/40 lg:col-span-2" />
          <div className="h-48 rounded-3xl bg-slate-800/50 border border-slate-700/40" />
        </div>
      </div>
    );
  }

  const { metrics, last7DaysHistory, priorityBreakdown, categoryBreakdown } = data;
  const maxHistoryCount = Math.max(...(last7DaysHistory?.map((h) => h.count) || [1]), 1);

  return (
    <div className="space-y-6">
      {/* Dynamic Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <greeting.icon className={`w-6 h-6 ${greeting.color}`} />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {greeting.text}, <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-400">{firstName}</span>!
            </h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Veja seu desempenho semanal e o status de todas as suas atividades.
          </p>
        </div>

        {/* Live Date Pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-300 self-start sm:self-auto">
          <Calendar className="w-4 h-4 text-teal-400" />
          <span>
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </span>
        </div>
      </div>

      {/* Main Highlights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* BIG CARD: Concluídas nos Últimos 7 Dias (Centerpiece) */}
        <div className="glass-card p-6 sm:p-7 rounded-3xl relative overflow-hidden border border-slate-700/60 shadow-2xl lg:col-span-2 flex flex-col justify-between group">
          {/* Ambient Glow */}
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-teal-500/15 rounded-full blur-3xl group-hover:bg-teal-500/25 transition-all" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-indigo-500/15 rounded-full blur-3xl" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20 shadow-glow">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Desempenho Semanal
                  </span>
                  <h3 className="text-lg font-extrabold text-white">Tarefas Feitas nos Últimos 7 Dias</h3>
                </div>
              </div>

              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Ritmo Ativo</span>
              </span>
            </div>

            {/* Big Stat & Summary */}
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-4 my-2">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl sm:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-cyan-300 to-indigo-300">
                  {metrics.completedLast7Days || metrics.completedToday || 0}
                </span>
                <span className="text-sm text-slate-400 font-medium">tarefas finalizadas nesta semana</span>
              </div>
            </div>
          </div>

          {/* 7-Days Mini Bar Chart */}
          <div className="mt-6 pt-6 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-3">
              <span>Histórico diário (7 dias)</span>
              <span>Hoje: <strong className="text-emerald-400">{metrics.completedToday}</strong> feitas</span>
            </div>

            <div className="grid grid-cols-7 gap-2 sm:gap-3 items-end h-24 pt-2">
              {last7DaysHistory?.map((day, index) => {
                const heightPercent = maxHistoryCount > 0 ? (day.count / maxHistoryCount) * 100 : 0;
                return (
                  <div key={index} className="flex flex-col items-center h-full justify-end gap-1.5 group/bar">
                    <span className="text-[10px] font-bold text-slate-400 group-hover/bar:text-white transition-colors">
                      {day.count}
                    </span>
                    <div className="w-full bg-slate-800/80 rounded-lg h-14 p-0.5 overflow-hidden flex flex-col justify-end">
                      <div
                        className={`w-full rounded-md transition-all duration-700 ${
                          day.isToday
                            ? 'bg-gradient-to-t from-teal-500 to-cyan-400 shadow-glow'
                            : day.count > 0
                            ? 'bg-gradient-to-t from-indigo-600 to-teal-500'
                            : 'bg-slate-700/40'
                        }`}
                        style={{ height: `${Math.max(heightPercent, 12)}%` }}
                      />
                    </div>
                    <span className={`text-[10px] font-bold ${day.isToday ? 'text-teal-400 font-extrabold' : 'text-slate-500'}`}>
                      {day.dayName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3 Quick Cards (Right Column) */}
        <div className="space-y-4 flex flex-col justify-between">
          {/* Card: Feitas Hoje */}
          <div
            onClick={() => onFilterClick && onFilterClick('status', 'COMPLETED')}
            className="glass-card glass-card-hover p-5 rounded-2xl cursor-pointer border border-slate-700/60"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Feitas Hoje</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-400">{metrics.completedToday}</span>
              <span className="text-xs text-slate-400">concluídas hoje</span>
            </div>
          </div>

          {/* Card: Atrasadas */}
          <div
            onClick={() => onFilterClick && onFilterClick('overdue', 'true')}
            className={`glass-card glass-card-hover p-5 rounded-2xl cursor-pointer border ${
              metrics.overdueTasks > 0
                ? 'border-rose-500/40 bg-rose-950/20'
                : 'border-slate-700/60'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Atrasadas</span>
              <div className={`p-2 rounded-xl border ${
                metrics.overdueTasks > 0
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-extrabold ${metrics.overdueTasks > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
                {metrics.overdueTasks}
              </span>
              <span className="text-xs text-slate-400">precisam de atenção</span>
            </div>
          </div>

          {/* Card: Total Ativas & Taxa */}
          <div
            onClick={() => onFilterClick && onFilterClick('status')}
            className="glass-card glass-card-hover p-5 rounded-2xl cursor-pointer border border-slate-700/60"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total & Produtividade</span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-white">{metrics.totalTasks}</span>
                <span className="text-xs text-slate-400">({metrics.pendingTasks + metrics.inProgressTasks} ativas)</span>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-teal-500/15 text-teal-300 border border-teal-500/30">
                {metrics.completionRate}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories & Priority Distribution Mini Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribuição por Categorias */}
        <div className="glass-card p-5 rounded-3xl lg:col-span-2 border border-slate-700/60">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Foco por Categoria</h3>
            </div>
            <span className="text-xs text-slate-400">{categoryBreakdown?.length || 0} categorias ativas</span>
          </div>

          {!categoryBreakdown || categoryBreakdown.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">Nenhuma categoria cadastrada.</p>
          ) : (
            <div className="space-y-3">
              {categoryBreakdown.map((cat) => (
                <div key={cat.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="font-semibold text-slate-200">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span>{cat.active} ativas / {cat.completed} prontas</span>
                      <span className="font-bold text-slate-300">({cat.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(cat.percentage, 2)}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Prioridades Ativas */}
        <div className="glass-card p-5 rounded-3xl border border-slate-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Tarefas por Prioridade</h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center">
              <span className="text-[11px] uppercase font-bold text-rose-400 block">Urgente 🔥</span>
              <span className="text-2xl font-black text-rose-300">{priorityBreakdown?.URGENT || 0}</span>
            </div>
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
              <span className="text-[11px] uppercase font-bold text-amber-400 block">Alta ⚡</span>
              <span className="text-2xl font-black text-amber-300">{priorityBreakdown?.HIGH || 0}</span>
            </div>
            <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center">
              <span className="text-[11px] uppercase font-bold text-blue-400 block">Média 📌</span>
              <span className="text-2xl font-black text-blue-300">{priorityBreakdown?.MEDIUM || 0}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-center">
              <span className="text-[11px] uppercase font-bold text-slate-400 block">Baixa ☕</span>
              <span className="text-2xl font-black text-slate-300">{priorityBreakdown?.LOW || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
