import {
  User,
  Task,
  Category,
  Tag,
  DashboardStatsResponse,
  Priority,
  Status,
} from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_URL || '/api';

const getHeaders = () => {
  const token = localStorage.getItem('taskflow_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Ocorreu um erro na requisição.');
  }
  return data;
}

export const api = {
  // Auth
  async login(credentials: { email: string; password: string }): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(res);
  },

  async register(data: { name: string; email: string; password: string }): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async getMe(): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Dashboard
  async getDashboardStats(): Promise<DashboardStatsResponse> {
    const res = await fetch(`${API_BASE}/dashboard/stats`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Categories
  async getCategories(): Promise<{ categories: Category[] }> {
    const res = await fetch(`${API_BASE}/categories`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async createCategory(data: { name: string; color: string }): Promise<{ category: Category }> {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateCategory(id: string, data: { name?: string; color?: string }): Promise<{ category: Category }> {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteCategory(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Tags
  async getTags(): Promise<{ tags: Tag[] }> {
    const res = await fetch(`${API_BASE}/tags`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async createTag(data: { name: string; color: string }): Promise<{ tag: Tag }> {
    const res = await fetch(`${API_BASE}/tags`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateTag(id: string, data: { name?: string; color?: string }): Promise<{ tag: Tag }> {
    const res = await fetch(`${API_BASE}/tags/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteTag(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/tags/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Tasks
  async getTasks(params?: {
    status?: Status;
    priority?: Priority;
    categoryId?: string;
    tagId?: string;
    search?: string;
  }): Promise<{ tasks: Task[] }> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.priority) query.append('priority', params.priority);
    if (params?.categoryId) query.append('categoryId', params.categoryId);
    if (params?.tagId) query.append('tagId', params.tagId);
    if (params?.search) query.append('search', params.search);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`${API_BASE}/tasks${queryString}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async createTask(data: {
    title: string;
    description?: string;
    dueDate?: string | null;
    priority: Priority;
    status?: Status;
    categoryId?: string | null;
    tagIds?: string[];
  }): Promise<{ task: Task }> {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateTask(
    id: string,
    data: Partial<{
      title: string;
      description: string | null;
      dueDate: string | null;
      priority: Priority;
      status: Status;
      categoryId: string | null;
      tagIds: string[];
      order: number;
    }>
  ): Promise<{ task: Task }> {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async moveTask(id: string, data: { status?: Status; order?: number }): Promise<{ task: Task }> {
    const res = await fetch(`${API_BASE}/tasks/${id}/move`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteTask(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};
