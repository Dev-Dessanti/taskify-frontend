import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  createdAt: string;
  userId: number;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: string;
}

export interface UpdateTaskData {
  title?: string;
  status?: string;
}

export const registerUser = async (data: { email: string; password: string }) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const createTask = async (data: CreateTaskData): Promise<Task> => {
  const response = await api.post('/tasks', data);
  return response.data;
};

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await api.get('/tasks');
  return response.data;
};

export const updateTask = async ({ id, data }: { id: number; data: UpdateTaskData }): Promise<Task> => {
  const response = await api.patch(`/tasks/${id}`, data);
  return response.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};