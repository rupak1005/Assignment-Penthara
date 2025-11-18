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
import { AnimatedInput } from '@/components/ui/animated-input';
import { Textarea } from '@/components/ui/textarea';
import { Dropdown } from '@/components/ui/dropdown';
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
      <DialogContent className="p-8 sm:p-8 sm:max-w-lg max-h-[90vh]">
        <div className="space-y-5 ">
          <DialogHeader className="mb-2 sm:mb-4">
            <DialogTitle className="text-xl font-semibold">
              {task ? 'Edit Task' : 'Add New Task'}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {task
                ? 'Update the task details below'
                : 'Fill the information to create a new task'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 pb-2">
            {/* Title */}
            <div className="space-y-2">
              <AnimatedInput
                id="title"
                name="title"
                label="Task Title *"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
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
            <div className="space-y-2">
              <AnimatedInput
                id="dueDate"
                name="dueDate"
                type="date"
                label="Due Date"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <label
                htmlFor="priority"
                className="text-sm font-medium block dark:text-gray-200 mb-2"
              >
                Priority
              </label>
              <Dropdown
                options={[
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                ]}
                value={formData.priority}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, priority: value as 'low' | 'medium' | 'high' }))
                }
                placeholder="Select priority"
              />
            </div>

            {/* Footer */}
            <DialogFooter className="mt-2 gap-3">
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default TaskForm;
