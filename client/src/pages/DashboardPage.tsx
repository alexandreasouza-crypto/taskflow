import React, { useState, useEffect, useCallback } from 'react';
import {
  Sidebar,
  NavTab,
} from '../components/Sidebar';
import {
  DashboardMetrics,
} from '../components/DashboardMetrics';
import {
  UpcomingTasks,
} from '../components/UpcomingTasks';
import {
  FilterBar,
} from '../components/FilterBar';
import {
  KanbanBoard,
} from '../components/KanbanBoard';
import {
  TaskListView,
} from '../components/TaskListView';
import {
  TaskModal,
} from '../components/TaskModal';
import {
  CategoryTagModal,
} from '../components/CategoryTagModal';
import {
  SettingsModal,
} from '../components/SettingsModal';
import {
  FloatingActionButton,
} from '../components/FloatingActionButton';
import {
  ToastContainer,
  ToastMessage,
} from '../components/Toast';
import {
  Menu,
  Plus,
  ListTodo,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Task,
  Category,
  Tag,
  DashboardStatsResponse,
  Status,
  Priority,
  KanbanColumn,
} from '../types';

const INITIAL_COLUMNS: KanbanColumn[] = [
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

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  // Navigation tab
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Data states
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Dynamic Kanban Columns
  const [columns, setColumns] = useState<KanbanColumn[]>(() => {
    const saved = localStorage.getItem('taskflow_columns');
    return saved ? JSON.parse(saved) : INITIAL_COLUMNS;
  });

  // Filter & View states
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<string>('');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskInitialStatus, setTaskInitialStatus] = useState<Status>('PENDING');
  const [isCategoryTagModalOpen, setIsCategoryTagModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  // Toast state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load all dashboard data
  const loadData = useCallback(async () => {
    try {
      const [tasksRes, categoriesRes, tagsRes, statsRes] = await Promise.all([
        api.getTasks({
          status: undefined,
          priority: (selectedPriority as Priority) || undefined,
          categoryId: selectedCategory || undefined,
          tagId: selectedTag || undefined,
          search: search || undefined,
        }),
        api.getCategories(),
        api.getTags(),
        api.getDashboardStats(),
      ]);

      setTasks(tasksRes.tasks);
      setCategories(categoriesRes.categories);
      setTags(tagsRes.tags);
      setStats(statsRes);
    } catch (error: any) {
      console.error('Error loading data:', error);
      addToast('error', error.message || 'Erro ao carregar informações.');
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedCategory, selectedTag, selectedPriority]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Tab Selection from Sidebar
  const handleSelectTab = (tab: NavTab) => {
    if (tab === 'categories') {
      setIsCategoryTagModalOpen(true);
    } else if (tab === 'settings') {
      setIsSettingsModalOpen(true);
    } else {
      setCurrentTab(tab);
    }
  };

  // Task Actions
  const handleSaveTask = async (taskData: {
    title: string;
    description?: string;
    dueDate?: string | null;
    priority: Priority;
    status: Status;
    categoryId?: string | null;
    tagIds: string[];
  }) => {
    try {
      if (taskToEdit) {
        await api.updateTask(taskToEdit.id, taskData);
        addToast('success', 'Tarefa atualizada com sucesso!');
      } else {
        await api.createTask(taskData);
        addToast('success', 'Nova tarefa criada com sucesso!');
      }
      await loadData();
    } catch (error: any) {
      addToast('error', error.message || 'Erro ao salvar tarefa.');
      throw error;
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: Status) => {
    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );

      await api.moveTask(taskId, { status: newStatus });
      addToast('info', 'Status da tarefa atualizado.');
      
      // Refresh stats in background
      const statsRes = await api.getDashboardStats();
      setStats(statsRes);
    } catch (error: any) {
      addToast('error', 'Erro ao alterar status da tarefa.');
      await loadData();
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta tarefa?')) return;

    try {
      await api.deleteTask(taskId);
      addToast('success', 'Tarefa removida com sucesso.');
      await loadData();
    } catch (error: any) {
      addToast('error', 'Erro ao excluir tarefa.');
    }
  };

  const handleQuickAdd = (status: Status = 'PENDING') => {
    setTaskToEdit(null);
    setTaskInitialStatus(status);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  // Dynamic Columns handler
  const handleAddColumn = (title: string) => {
    const newId = `CUSTOM_${Date.now()}`;
    const newCol: KanbanColumn = {
      id: newId,
      title,
      color: 'border-indigo-500/30',
      bgBadge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
      countColor: 'text-indigo-400',
      isCustom: true,
    };
    const updated = [...columns, newCol];
    setColumns(updated);
    localStorage.setItem('taskflow_columns', JSON.stringify(updated));
    addToast('success', `Coluna "${title}" criada com sucesso!`);
  };

  const handleDeleteColumn = (columnId: string) => {
    const updated = columns.filter((c) => c.id !== columnId);
    setColumns(updated);
    localStorage.setItem('taskflow_columns', JSON.stringify(updated));
    addToast('info', 'Coluna removida.');
  };

  // Category & Tag handlers
  const handleCreateCategory = async (name: string, color: string) => {
    await api.createCategory({ name, color });
    addToast('success', `Categoria "${name}" criada!`);
    await loadData();
  };

  const handleDeleteCategory = async (id: string) => {
    await api.deleteCategory(id);
    addToast('success', 'Categoria excluída.');
    await loadData();
  };

  const handleCreateTag = async (name: string, color: string) => {
    await api.createTag({ name, color });
    addToast('success', `Tag "#${name}" criada!`);
    await loadData();
  };

  const handleDeleteTag = async (id: string) => {
    await api.deleteTag(id);
    addToast('success', 'Tag excluída.');
    await loadData();
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedTag('');
    setSelectedPriority('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row text-slate-100">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Left Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        user={user}
        onOpenNewTask={() => handleQuickAdd('PENDING')}
        onLogout={logout}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        taskCounts={{
          total: stats?.metrics.totalTasks || 0,
          pending: (stats?.metrics.pendingTasks || 0) + (stats?.metrics.inProgressTasks || 0),
          completed: stats?.metrics.completedTasks || 0,
        }}
      />

      {/* Main Content Area (With left margin for desktop sidebar) */}
      <div className="flex-1 lg:ml-72 flex flex-col min-w-0 pb-20">
        {/* Mobile Header Bar */}
        <header className="h-16 px-4 flex items-center justify-between border-b border-slate-800 lg:hidden glass-nav sticky top-0 z-30">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-extrabold text-base bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-400">
            TaskFlow
          </span>
          <button
            onClick={() => handleQuickAdd('PENDING')}
            className="p-2 rounded-xl bg-teal-500 text-white shadow-glow"
          >
            <Plus className="w-5 h-5" />
          </button>
        </header>

        {/* Dynamic Main View */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
          {currentTab === 'home' ? (
            /* TAB 1: INÍCIO (Overview & Dashboard Highlights) */
            <>
              {/* Dynamic Greeting & Large 7-Day Card */}
              <DashboardMetrics
                userName={user?.name}
                data={stats}
                isLoading={isLoading}
                onFilterClick={() => setCurrentTab('tasks')}
              />

              {/* Lista das Tarefas Próximas a Vencer */}
              <UpcomingTasks
                tasks={stats?.upcomingTasksList || []}
                onTaskClick={handleEditTask}
                onStatusChange={handleStatusChange}
                onViewAllTasks={() => setCurrentTab('tasks')}
              />
            </>
          ) : (
            /* TAB 2: MINHAS TAREFAS (Kanban Board & List View) */
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                    <ListTodo className="w-7 h-7 text-teal-400" />
                    <span>Minhas Tarefas</span>
                  </h2>
                  <p className="text-sm text-slate-400 mt-0.5">
                    Gerencie, filtre e organize suas atividades no quadro visual.
                  </p>
                </div>
              </div>

              {/* Filters Bar */}
              <FilterBar
                search={search}
                onSearchChange={setSearch}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedTag={selectedTag}
                onTagChange={setSelectedTag}
                selectedPriority={selectedPriority}
                onPriorityChange={setSelectedPriority}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                categories={categories}
                tags={tags}
                onClearFilters={handleClearFilters}
              />

              {/* Board or List */}
              {viewMode === 'kanban' ? (
                <KanbanBoard
                  tasks={tasks}
                  onTaskClick={handleEditTask}
                  onStatusChange={handleStatusChange}
                  onDeleteTask={handleDeleteTask}
                  onQuickAdd={handleQuickAdd}
                  columns={columns}
                  onAddColumn={handleAddColumn}
                  onDeleteColumn={handleDeleteColumn}
                />
              ) : (
                <TaskListView
                  tasks={tasks}
                  onTaskClick={handleEditTask}
                  onStatusChange={handleStatusChange}
                  onDeleteTask={handleDeleteTask}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Floating Action Button (Always available in bottom right) */}
      <FloatingActionButton onClick={() => handleQuickAdd('PENDING')} />

      {/* Task Creation & Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
        categories={categories}
        tags={tags}
        initialStatus={taskInitialStatus}
      />

      {/* Category & Tag Manager Modal */}
      <CategoryTagModal
        isOpen={isCategoryTagModalOpen}
        onClose={() => setIsCategoryTagModalOpen(false)}
        categories={categories}
        tags={tags}
        onCreateCategory={handleCreateCategory}
        onDeleteCategory={handleDeleteCategory}
        onCreateTag={handleCreateTag}
        onDeleteTag={handleDeleteTag}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        user={user}
        totalTasks={stats?.metrics.totalTasks || 0}
        totalCategories={categories.length}
      />
    </div>
  );
};
