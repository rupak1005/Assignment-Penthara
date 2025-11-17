/**
 * TaskItem Component
 * 
 * Individual task item component displaying task details.
 * Handles task completion toggle and action buttons.
 */

import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import type { Task } from '@/services/taskService';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

/**
 * TaskItem component for displaying individual tasks
 * @param {TaskItemProps} props - Component props
 */
const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  /**
   * Handles checkbox change to toggle task completion
   */
  const handleCheckboxChange = () => {
    onToggleComplete(task.id);
  };

  /**
   * Handles edit button click
   */
  const handleEdit = () => {
    onEdit(task);
  };

  /**
   * Handles delete button click
   */
  const handleDelete = () => {
    onDelete(task);
  };

  /**
   * Gets priority badge variant based on priority level
   * @param {string} priority - Task priority level
   * @returns {string} Badge variant name
   */
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  /**
   * Formats date string for display
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date string
   */
  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.completed}
            onChange={handleCheckboxChange}
            className="mt-1"
            aria-label={`Mark "${task.title}" as ${task.completed ? 'pending' : 'complete'}`}
          />
          <div className="flex-1">
            <CardTitle
              className={`text-lg font-bold ${
                task.completed ? 'line-through text-gray-400' : 'text-gray-900'
              }`}
            >
              {task.title}
            </CardTitle>
            {task.description && (
              <CardDescription className="mt-2 text-gray-600">
                {task.description}
              </CardDescription>
            )}
            {task.dueDate && (
              <p className="text-sm text-gray-500 mt-2">
                Due: {formatDate(task.dueDate)}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEdit}
              className="h-8 w-8"
              aria-label={`Edit task: ${task.title}`}
            >
              <Edit2 size={16} className="text-gray-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="h-8 w-8"
              aria-label={`Delete task: ${task.title}`}
            >
              <Trash2 size={16} className="text-gray-600" />
            </Button>
          </div>
          <Badge variant={getPriorityVariant(task.priority) as any} className="bg-gray-200 text-gray-700">
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskItem;

