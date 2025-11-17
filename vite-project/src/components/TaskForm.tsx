/**
 * TaskForm Component
 * 
 * Styled and spacing-fixed version.
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Task } from '@/services/taskService';

export interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: TaskFormData) => void;
  task?: Task | null;
}

const TaskForm: React.FC<TaskFormProps> = ({ isOpen, onClose, onSubmit, task }) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium'
  });

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setFormData({
          title: task.title,
          description: task.description || '',
          dueDate: task.dueDate || '',
          priority: task.priority
        });
      } else {
        setFormData({
          title: '',
          description: '',
          dueDate: '',
          priority: 'medium'
        });
      }
    }
  }, [isOpen, task]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onSubmit(formData);
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium'
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-6 sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold">
            {task ? 'Edit Task' : 'Add New Task'}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {task
              ? 'Update the task details below'
              : 'Fill the information to create a new task'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-1.5">
            <label
              htmlFor="title"
              className="text-sm font-medium block dark:text-gray-200"
            >
              Task Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              name="title"
              placeholder="Enter task title"
              value={formData.title}
              onChange={handleChange}
              required
              className="h-10"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label
              htmlFor="description"
              className="text-sm font-medium block dark:text-gray-200"
            >
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter description (optional)"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Due Date */}
          <div className="space-y-1.5">
            <label
              htmlFor="dueDate"
              className="text-sm font-medium block dark:text-gray-200"
            >
              Due Date
            </label>
            <Input
              id="dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              className="h-10"
            />
          </div>

          {/* Priority */}
          <div className="space-y-1.5">
            <label
              htmlFor="priority"
              className="text-sm font-medium block dark:text-gray-200"
            >
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full h-10 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 dark:text-gray-200 bg-white dark:bg-sidebar-accent focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Footer */}
          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="px-4"
            >
              Cancel
            </Button>
            <Button type="submit" className="px-5">
              {task ? 'Update Task' : 'Add Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default TaskForm;
