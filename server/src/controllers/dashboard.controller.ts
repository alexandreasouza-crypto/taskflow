import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    const sevenDaysAgo = new Date(startOfToday.getTime() - 6 * 24 * 60 * 60 * 1000);
    const next7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const [
      allTasks,
      categories,
      tags,
    ] = await Promise.all([
      prisma.task.findMany({
        where: { userId },
        include: {
          category: true,
          tags: {
            include: { tag: true },
          },
        },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.category.findMany({
        where: { userId },
        include: {
          tasks: true,
        },
      }),
      prisma.tag.findMany({
        where: { userId },
      }),
    ]);

    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter((t) => t.status === 'COMPLETED').length;
    const pendingTasks = allTasks.filter((t) => t.status === 'PENDING').length;
    const inProgressTasks = allTasks.filter((t) => t.status === 'IN_PROGRESS').length;

    // Concluídas hoje
    const completedToday = allTasks.filter(
      (t) => t.status === 'COMPLETED' && t.completedAt && new Date(t.completedAt) >= startOfToday && new Date(t.completedAt) <= endOfToday
    ).length;

    // Concluídas nos últimos 7 dias
    const completedLast7Days = allTasks.filter(
      (t) => t.status === 'COMPLETED' && t.completedAt && new Date(t.completedAt) >= sevenDaysAgo
    ).length;

    // Histórico diário dos últimos 7 dias
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const last7DaysHistory = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
      const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

      const count = allTasks.filter(
        (t) => t.status === 'COMPLETED' && t.completedAt && new Date(t.completedAt) >= dayStart && new Date(t.completedAt) <= dayEnd
      ).length;

      last7DaysHistory.push({
        date: dayStart.toISOString().split('T')[0],
        dayName: dayNames[d.getDay()],
        count,
        isToday: i === 0,
      });
    }

    // Atrasadas (dueDate anterior a agora e não concluída)
    const overdueTasksList = allTasks.filter(
      (t) => t.status !== 'COMPLETED' && t.dueDate && new Date(t.dueDate) < now
    );
    const overdueTasks = overdueTasksList.length;

    // Vencem hoje
    const dueTodayList = allTasks.filter(
      (t) => t.status !== 'COMPLETED' && t.dueDate && new Date(t.dueDate) >= startOfToday && new Date(t.dueDate) <= endOfToday
    );
    const dueToday = dueTodayList.length;

    // Próximas 7 dias
    const upcomingTasks = allTasks.filter(
      (t) => t.status !== 'COMPLETED' && t.dueDate && new Date(t.dueDate) > endOfToday && new Date(t.dueDate) <= next7Days
    ).length;

    // Lista de tarefas próximas a vencer (ordenadas por prazo mais próximo)
    const upcomingTasksList = allTasks
      .filter((t) => t.status !== 'COMPLETED' && t.dueDate)
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());

    // Distribuição por prioridade (apenas não concluídas para foco ativo)
    const activeTasks = allTasks.filter((t) => t.status !== 'COMPLETED');
    const priorityBreakdown = {
      URGENT: activeTasks.filter((t) => t.priority === 'URGENT').length,
      HIGH: activeTasks.filter((t) => t.priority === 'HIGH').length,
      MEDIUM: activeTasks.filter((t) => t.priority === 'MEDIUM').length,
      LOW: activeTasks.filter((t) => t.priority === 'LOW').length,
    };

    // Distribuição por categoria
    const categoryBreakdown = categories.map((cat) => {
      const catTasks = allTasks.filter((t) => t.categoryId === cat.id);
      const catCompleted = catTasks.filter((t) => t.status === 'COMPLETED').length;
      return {
        id: cat.id,
        name: cat.name,
        color: cat.color,
        total: catTasks.length,
        completed: catCompleted,
        active: catTasks.length - catCompleted,
        percentage: totalTasks > 0 ? Math.round((catTasks.length / totalTasks) * 100) : 0,
      };
    });

    // Tarefas sem categoria
    const uncategorizedTasks = allTasks.filter((t) => !t.categoryId);
    if (uncategorizedTasks.length > 0) {
      categoryBreakdown.push({
        id: 'uncategorized',
        name: 'Geral / Sem Categoria',
        color: '#94a3b8',
        total: uncategorizedTasks.length,
        completed: uncategorizedTasks.filter((t) => t.status === 'COMPLETED').length,
        active: uncategorizedTasks.filter((t) => t.status !== 'COMPLETED').length,
        percentage: totalTasks > 0 ? Math.round((uncategorizedTasks.length / totalTasks) * 100) : 0,
      });
    }

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.json({
      metrics: {
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        completedToday,
        completedLast7Days,
        overdueTasks,
        dueToday,
        upcomingTasks,
        completionRate,
      },
      last7DaysHistory,
      priorityBreakdown,
      categoryBreakdown,
      upcomingTasksList: upcomingTasksList.slice(0, 10),
      overduePreview: overdueTasksList.slice(0, 5),
      dueTodayPreview: dueTodayList.slice(0, 5),
      recentTasks: allTasks.slice(0, 6),
      totalCategories: categories.length,
      totalTags: tags.length,
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Erro ao calcular métricas do painel.' });
  }
};
