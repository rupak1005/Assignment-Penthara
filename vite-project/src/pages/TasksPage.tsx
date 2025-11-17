/**
 * TasksPage Component
 * 
 * Main page component for task management.
 * Handles task CRUD operations, filtering, and state management.
 */

import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getTasks, addTask, updateTask, deleteTask, toggleTaskComplete } from '@/services/taskService';
import type { Task } from '@/services/taskService';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import type { TaskFormData } from '@/components/TaskForm';

interface TasksPageProps {
  searchQuery?: string;
}

/**
 * TasksPage component for managing tasks
 * @param {TasksPageProps} props - Component props
 */
const TasksPage: React.FC<TasksPageProps> = ({ searchQuery = '' }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const loadedTasks = getTasks();
    setTasks(loadedTasks);
  }, []);

  /**
   * Handles adding a new task
   * @param {TaskFormData} formData - Form data for new task
   */
  const handleAddTask = (formData: TaskFormData) => {
    const newTask = addTask(formData);
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  /**
   * Handles updating an existing task
   * @param {TaskFormData} formData - Updated form data
   */
  const handleUpdateTask = (formData: TaskFormData) => {
    if (!editingTask) return;

    const updatedTask = updateTask(editingTask.id, formData);
    if (updatedTask) {
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === editingTask.id ? updatedTask : task))
      );
      setEditingTask(null);
    }
  };

  /**
   * Handles task form submission (both add and edit)
   * @param {TaskFormData} formData - Form data
   */
  const handleFormSubmit = (formData: TaskFormData) => {
    if (editingTask) {
      handleUpdateTask(formData);
    } else {
      handleAddTask(formData);
    }
  };

  /**
   * Handles toggling task completion status
   * @param {string} id - Task ID to toggle
   */
  const handleToggleComplete = (id: string) => {
    const updatedTask = toggleTaskComplete(id);
    if (updatedTask) {
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
    }
  };

  /**
   * Handles edit button click
   * @param {Task} task - Task to edit
   */
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsAddDialogOpen(true);
  };

  /**
   * Handles delete button click
   * @param {Task} task - Task to delete
   */
  const handleDeleteClick = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteDialogOpen(true);
  };

  /**
   * Handles confirmed task deletion
   */
  const handleDeleteConfirm = () => {
    if (!selectedTask) return;

    const success = deleteTask(selectedTask.id);
    if (success) {
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== selectedTask.id)
      );
      setSelectedTask(null);
      setIsDeleteDialogOpen(false);
    }
  };

  /**
   * Handles closing the add/edit dialog
   */
  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingTask(null);
  };

  /**
   * Calculates task statistics
   * @returns {Object} Task statistics object
   */
  const getStats = () => {
    return {
      total: tasks.length,
      completed: tasks.filter((task) => task.completed).length,
      pending: tasks.filter((task) => !task.completed).length,
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Task List</h2>
        <Button
          onClick={() => {
            setEditingTask(null);
            setIsAddDialogOpen(true);
          }}
        >
          <Plus size={16} className="mr-2" />
          Add Task
        </Button>
      </div>

      <Tabs value={filter} onValueChange={(value: string) => setFilter(value as typeof filter)}>
        <TabsList>
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
        </TabsList>
      </Tabs>

      <TaskList
        tasks={tasks.filter((task) => {
          if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            return (
              task.title.toLowerCase().includes(query) ||
              (task.description && task.description.toLowerCase().includes(query))
            );
          }
          return true;
        })}
        filter={filter}
        onToggleComplete={handleToggleComplete}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onAddTask={() => setIsAddDialogOpen(true)}
      />

      {/* Add/Edit Task Dialog */}
      <TaskForm
        isOpen={isAddDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleFormSubmit}
        task={editingTask}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedTask?.title}"? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedTask(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TasksPage;

