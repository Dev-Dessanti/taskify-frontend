import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { fetchTasks, Task } from '../services/api';

function TasksPage() {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const { data: tasks, isLoading, error } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  const filteredTasks = tasks?.filter((task: Task) => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Minhas Tarefas</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Sair
          </button>
        </div>
        <TaskForm />
        <div className="mb-6 flex items-center">
          <label className="text-gray-700 mr-3 font-medium">Filtrar por status:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'pending' | 'completed')}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos</option>
            <option value="pending">Pendentes</option>
            <option value="completed">Completos</option>
          </select>
        </div>
        {isLoading ? (
          <p className="text-gray-600 text-center">Carregando...</p>
        ) : error ? (
          <p className="text-red-500 text-center">Erro ao carregar as tarefas...</p>
        ) : (
          <TaskList tasks={filteredTasks || []} />
        )}
      </div>
    </div>
  );
}

export default TasksPage;