/**
 * TasksPage Component
 * 
 * This is the main page where users manage their tasks.
 * Think of it as the "command center" for all task operations.
 * 
 * What it does:
 * - Displays all tasks in a list/grid view
 * - Allows creating, editing, and deleting tasks
 * - Provides filtering by status (all/pending/completed) and priority
 * - Integrates with the global search from the header
 * - Shows statistics (total, completed, pending counts)
 * 
 * How it works:
 * - Loads tasks from localStorage when page loads
 * - Manages multiple pieces of state (tasks, filters, dialog states)
 * - Passes data and callbacks down to child components
 * - Handles all user actions (add, edit, delete, toggle complete)
 */

import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Dropdown } from '@/components/ui/dropdown';
import { fetchTasks, createTask, updateTask, deleteTask, toggleTaskComplete } from '@/services/taskService';
import type { Task } from '@/services/taskService';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import type { TaskFormData } from '@/components/TaskForm';

interface TasksPageProps {
  searchQuery?: string;  // The search text from the header search bar
  token: string;
}

/**
 * TasksPage component for managing tasks
 * 
 * This component receives the searchQuery from the parent (App component)
 * and uses it to filter tasks as the user types.
 * 
 * @param {TasksPageProps} props - Component props
 */
const TasksPage: React.FC<TasksPageProps> = ({ searchQuery = '', token }) => {
  // State to hold all tasks - this is the "source of truth" for this page
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter by task status: show all tasks, only completed, or only pending
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  
  // Filter by priority: 'all', 'high', 'medium', or 'low'
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  
  // Controls whether the "Add/Edit Task" dialog is visible
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Controls whether the "Delete Confirmation" dialog is visible
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Stores which task the user wants to delete (for the confirmation dialog)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Stores which task the user is currently editing (null means we're creating a new task)
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  /**
   * Load tasks from localStorage when this page first loads.
   * 
   * This runs once when the component mounts (the empty [] dependency array
   * means "run only on mount, not when other things change").
   * 
   * We load tasks here so the page always shows the latest data from storage.
   */
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const loadedTasks = await fetchTasks(token);
        setTasks(loadedTasks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tasks');
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [token]);

  /**
   * Handle creating a new task
   * 
   * Called when user submits the form to create a new task.
   * We add it to localStorage AND update our local state immediately
   * (so the UI updates right away without needing to reload).
   * 
   * @param {TaskFormData} formData - The task data from the form
   */
  const handleAddTask = async (formData: TaskFormData) => {
    try {
      setError(null);
      const newTask = await createTask(formData, token);
      setTasks((prevTasks) => [...prevTasks, newTask]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task');
    }
  };

  /**
   * Handle updating an existing task
   * 
   * Called when user submits the form to edit a task.
   * We update it in localStorage AND update our local state.
   * 
   * @param {TaskFormData} formData - The updated task data from the form
   */
  const handleUpdateTask = async (formData: TaskFormData) => {
    // Safety check: make sure we're actually editing a task
    if (!editingTask) return;

    try {
      setError(null);
      const updatedTask = await updateTask(editingTask.id, formData, token);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === editingTask.id ? updatedTask : task))
      );
      setEditingTask(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  /**
   * Handle form submission - works for both adding and editing
   * 
   * This is a "smart" function that checks if we're editing or creating.
   * If editingTask is set, we update. Otherwise, we create new.
   * 
   * @param {TaskFormData} formData - The task data from the form
   */
  const handleFormSubmit = (formData: TaskFormData) => {
    if (editingTask) {
      // We have a task being edited, so update it
      handleUpdateTask(formData);
    } else {
      // No task being edited, so create a new one
      handleAddTask(formData);
    }
  };

  /**
   * Handle toggling a task's completed status (check/uncheck)
   * 
   * Called when user clicks the "Mark Done" or "Completed" button on a task.
   * This flips the completed status and updates both storage and UI.
   * 
   * @param {string} id - The ID of the task to toggle
   */
  const handleToggleComplete = async (id: string) => {
    try {
      setError(null);
      const updatedTask = await toggleTaskComplete(id, token);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  /**
   * Handle when user clicks "Edit" on a task
   * 
   * We store which task is being edited and open the form dialog.
   * The form will be pre-filled with the task's current data.
   * 
   * @param {Task} task - The task the user wants to edit
   */
  const handleEdit = (task: Task) => {
    // Remember which task we're editing
    setEditingTask(task);
    
    // Open the form dialog (same dialog used for add/edit)
    setIsAddDialogOpen(true);
  };

  /**
   * Handle when user clicks "Delete" on a task
   * 
   * We don't delete immediately - instead, we show a confirmation dialog.
   * This prevents accidental deletions.
   * 
   * @param {Task} task - The task the user wants to delete
   */
  const handleDeleteClick = (task: Task) => {
    // Remember which task they want to delete
    setSelectedTask(task);
    
    // Show the confirmation dialog
    setIsDeleteDialogOpen(true);
  };

  /**
   * Handle when user confirms they want to delete a task
   * 
   * This is called when they click "Delete Task" in the confirmation dialog.
   * Only now do we actually delete it from storage and update the UI.
   */
  const handleDeleteConfirm = async () => {
    // Safety check: make sure we have a task selected
    if (!selectedTask) return;

    try {
      setError(null);
      await deleteTask(selectedTask.id, token);
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== selectedTask.id)
      );
      setSelectedTask(null);
      setIsDeleteDialogOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  /**
   * Handle closing the add/edit task dialog
   * 
   * Called when user clicks Cancel or closes the dialog.
   * We reset the editing state so next time they open it, it's a fresh form.
   */
  const handleCloseDialog = () => {
    // Close the dialog
    setIsAddDialogOpen(false);
    
    // Clear the editing state (so next time it's a new task, not editing)
    setEditingTask(null);
  };

  /**
   * Calculate statistics about the tasks
   * 
   * This counts how many tasks are total, completed, and pending.
   * We use these numbers to display in the filter tabs (e.g., "All (5)").
   * 
   * @returns {Object} An object with total, completed, and pending counts
   */
  const getStats = () => {
    return {
      total: tasks.length,                                    // Total number of tasks
      completed: tasks.filter((task) => task.completed).length,  // Count of completed tasks
      pending: tasks.filter((task) => !task.completed).length,   // Count of incomplete tasks
    };
  };

  // Calculate stats once (we'll use this in the UI)
  const stats = getStats();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-accent-foreground ">Task List</h2>
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

      {error && (
        <div className="p-3 rounded-md bg-red-500/10 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <Tabs value={filter} onValueChange={(value: string) => setFilter(value as typeof filter)}>
          <TabsList>
            <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="w-full sm:w-auto sm:min-w-[200px]">
          <Dropdown
            options={[
              { value: 'all', label: 'All Priorities' },
              { value: 'high', label: 'High Priority' },
              { value: 'medium', label: 'Medium Priority' },
              { value: 'low', label: 'Low Priority' },
            ]}
            value={priorityFilter}
            onChange={setPriorityFilter}
            placeholder="Filter by priority"
          />
        </div>
      </div>

      {/* 
        TaskList Component
        This displays all the tasks. We filter them before passing to TaskList:
        
        1. Search Filter: If user typed something in the header search bar,
           only show tasks whose title or description contains that text
           (case-insensitive search)
        
        2. Priority Filter: If user selected a priority in the dropdown,
           only show tasks with that priority level
        
        Note: The status filter (all/pending/completed) is handled inside TaskList
        component itself, so we pass the filter prop separately.
      */}
      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground">Loading tasks...</div>
      ) : (
        <TaskList
          tasks={tasks.filter((task) => {
          // Step 1: Apply search filter (if user typed something)
          if (searchQuery.trim()) {
            // Convert search query to lowercase for case-insensitive matching
            const query = searchQuery.toLowerCase();
            
            // Check if the search text appears in title OR description
            // If it doesn't appear in either, exclude this task from results
            if (
              !task.title.toLowerCase().includes(query) &&
              !(task.description && task.description.toLowerCase().includes(query))
            ) {
              return false; // Don't include this task
            }
          }
          
          // Step 2: Apply priority filter (if user selected a specific priority)
          if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
            return false; // Don't include this task (priority doesn't match)
          }
          
          // If we made it here, include this task in the results
          return true;
          })}
          filter={filter}  // Status filter (all/pending/completed) - handled inside TaskList
          onToggleComplete={handleToggleComplete}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onAddTask={() => setIsAddDialogOpen(true)}
        />
      )}

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

