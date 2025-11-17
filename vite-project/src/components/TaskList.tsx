/**
 * TaskList Component
 * 
 * Component for displaying a list of tasks with filtering support.
 * Handles task status filtering and empty state display.
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Task } from '@/services/taskService';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  filter: 'all' | 'completed' | 'pending';
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onAddTask: () => void;
}

/**
 * TaskList component for displaying filtered tasks
 * @param {TaskListProps} props - Component props
 */
const TaskList: React.FC<TaskListProps> = ({
  tasks,
  filter,
  onToggleComplete,
  onEdit,
  onDelete,
  onAddTask,
}) => {
  /**
   * Filters tasks based on current filter status
   * @returns {Task[]} Filtered array of tasks
   */
  const getFilteredTasks = (): Task[] => {
    switch (filter) {
      case 'completed':
        return tasks.filter((task) => task.completed);
      case 'pending':
        return tasks.filter((task) => !task.completed);
      case 'all':
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  /**
   * Gets empty state message based on filter
   * @returns {Object} Empty state message and description
   */
  const getEmptyStateMessage = () => {
    switch (filter) {
      case 'completed':
        return {
          title: 'No completed tasks',
          description: 'Complete some tasks to see them here',
        };
      case 'pending':
        return {
          title: 'No pending tasks',
          description: 'All your tasks are completed! Great job!',
        };
      default:
        return {
          title: 'No tasks found',
          description: 'Create a new task to get started',
        };
    }
  };

  if (filteredTasks.length === 0) {
    const emptyState = getEmptyStateMessage();
    
    return (
      <Card className="py-12">
        <CardContent className="text-center">
          <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {emptyState.title}
          </h3>
          <p className="text-gray-500 mb-4">{emptyState.description}</p>
          {filter === 'all' && (
            <Button onClick={onAddTask}>
              Add Your First Task
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;

