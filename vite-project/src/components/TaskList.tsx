import React, { useState } from 'react';
import { AlertCircle, Grid, List } from 'lucide-react';
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

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  filter,
  onToggleComplete,
  onEdit,
  onDelete,
  onAddTask,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const getFilteredTasks = (): Task[] => {
    switch (filter) {
      case 'completed':
        return tasks.filter((task) => task.completed);
      case 'pending':
        return tasks.filter((task) => !task.completed);
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  const getEmptyStateMessage = () => {
    switch (filter) {
      case 'completed':
        return {
          title: 'No completed tasks',
          description: 'Mark some tasks as completed to see them here.',
        };
      case 'pending':
        return {
          title: 'No pending tasks',
          description: 'You have completed all your tasks. Great work!',
        };
      default:
        return {
          title: 'No tasks found',
          description: 'Create your first task to get started.',
        };
    }
  };

  if (filteredTasks.length === 0) {
    const emptyState = getEmptyStateMessage();
    return (
      <Card className="py-10 sm:py-14 px-4 sm:px-6 shadow-sm dark:shadow-none border-[1.5px] dark:border-gray-700">
        <CardContent className="text-center flex flex-col items-center">
          <AlertCircle className="text-gray-400 dark:text-gray-500 mb-3 sm:mb-4" size={40} />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {emptyState.title}
          </h3>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-5 sm:mb-6 max-w-md px-4">
            {emptyState.description}
          </p>
          {filter === 'all' && (
            <Button onClick={onAddTask} variant="default" className="w-full sm:w-auto">
              Add Your First Task
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      {/* View Toggle */}
      <div className="flex justify-between sm:justify-end items-center mb-4 gap-2">
        <div className="sm:hidden text-sm text-gray-600 dark:text-gray-400 font-medium">
          {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
            aria-label="Grid View"
            className="h-9 w-9 sm:h-10 sm:w-10"
          >
            <Grid size={18} className="sm:w-5 sm:h-5" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
            aria-label="List View"
            className="h-9 w-9 sm:h-10 sm:w-10"
          >
            <List size={18} className="sm:w-5 sm:h-5" />
          </Button>
        </div>
      </div>

      {/* Task List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 animate-fadeIn">
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
      ) : (
        <div className="flex flex-col space-y-2 sm:space-y-3 animate-fadeIn">
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
      )}
    </div>
  );
};

export default TaskList;
