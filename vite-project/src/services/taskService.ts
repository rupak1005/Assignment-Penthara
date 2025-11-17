/**
 * Task Service
 * 
 * Service layer for handling task data operations with localStorage.
 * Provides CRUD operations for tasks.
 */

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'task_tracker_tasks';

/**
 * Retrieves all tasks from localStorage
 * @returns {Task[]} Array of tasks, or empty array if none exist or error occurs
 */
export const getTasks = (): Task[] => {
  try {
    const tasksJson = localStorage.getItem(STORAGE_KEY);
    return tasksJson ? JSON.parse(tasksJson) : [];
  } catch (error) {
    console.error('Error retrieving tasks:', error);
    return [];
  }
};

/**
 * Saves tasks array to localStorage
 * @param {Task[]} tasks - Array of tasks to save
 */
export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};

/**
 * Adds a new task to the list
 * @param {Omit<Task, 'id' | 'completed' | 'createdAt'>} taskData - Task data without auto-generated fields
 * @returns {Task} The newly created task
 */
export const addTask = (taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>): Task => {
  const tasks = getTasks();
  const newTask: Task = {
    id: Date.now().toString(),
    ...taskData,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
};

/**
 * Updates an existing task
 * @param {string} id - Task ID to update
 * @param {Partial<Task>} updates - Partial task data to update
 * @returns {Task | null} Updated task if found, null otherwise
 */
export const updateTask = (id: string, updates: Partial<Task>): Task | null => {
  const tasks = getTasks();
  const taskIndex = tasks.findIndex((task) => task.id === id);
  
  if (taskIndex === -1) {
    return null;
  }
  
  tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
  saveTasks(tasks);
  return tasks[taskIndex];
};

/**
 * Deletes a task by ID
 * @param {string} id - Task ID to delete
 * @returns {boolean} True if task was deleted, false otherwise
 */
export const deleteTask = (id: string): boolean => {
  const tasks = getTasks();
  const filteredTasks = tasks.filter((task) => task.id !== id);
  
  if (filteredTasks.length === tasks.length) {
    return false; // Task not found
  }
  
  saveTasks(filteredTasks);
  return true;
};

/**
 * Toggles the completed status of a task
 * @param {string} id - Task ID to toggle
 * @returns {Task | null} Updated task if found, null otherwise
 */
export const toggleTaskComplete = (id: string): Task | null => {
  const tasks = getTasks();
  const task = tasks.find((t) => t.id === id);
  
  if (!task) {
    return null;
  }
  
  return updateTask(id, { completed: !task.completed });
};

