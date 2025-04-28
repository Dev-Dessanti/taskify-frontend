import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask, deleteTask, Task, UpdateTaskData } from '../services/api';

interface TaskItemProps {
  task: Task;
}

function TaskItem({ task }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const queryClient = useQueryClient();

  const updateMutation = useMutation<Task, Error, { id: number; data: UpdateTaskData }>({
    mutationFn: ({ id, data }) => updateTask({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsEditing(false);
    },
  });

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: (id) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const handleStatusChange = () => {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    updateMutation.mutate({ id: task.id, data: { status: newStatus } });
  };

  const handleUpdate = () => {
    if (!title) return;
    updateMutation.mutate({ id: task.id, data: { title } });
  };

  const handleDelete = () => {
    deleteMutation.mutate(task.id);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
      <div className="flex-1">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <div>
            <h3
              className={`text-lg font-semibold ${
                task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'
              }`}
            >
              {task.title}
            </h3>
            {task.description && <p className="text-gray-600 mt-1">{task.description}</p>}
            <p className="text-sm text-gray-500 mt-1">
              Criado: {new Date(task.createdAt).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">Status: {task.status}</p>
          </div>
        )}
      </div>
      <div className="flex space-x-3">
        {isEditing ? (
          <>
            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Salvar
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Editar
            </button>
            <button
              onClick={handleStatusChange}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              {task.status === 'pending' ? 'Marcar como concluído' : 'Marcar como pendente'}
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Excluir
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default TaskItem;