import TaskItem from './TaskItem';
import { Task } from '../services/api';

interface TaskListProps {
  tasks: Task[];
}

function TaskList({ tasks }: TaskListProps) {
  if (!tasks || tasks.length === 0) {
    return <p className="text-gray-600 text-center">Tarefas não encontradas.</p>;
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}

export default TaskList;