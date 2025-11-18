/**
 * Task Service
 * 
 * This is our data layer - think of it as the "database" for our app.
 * Since we're not using a real backend, we store everything in the browser's localStorage.
 * 
 * What this file does:
 * - Defines what a Task looks like (the data structure)
 * - Provides functions to create, read, update, and delete tasks (CRUD operations)
 * - Handles saving/loading from localStorage
 * - All task-related data operations go through these functions
 * 
 * Why separate this into a service?
 * - Keeps data logic separate from UI components
 * - Makes it easy to swap localStorage for a real API later
 * - All components use the same functions, so data stays consistent
 */

/**
 * Task Interface - This defines the shape/structure of a task object
 * 
 * Think of this as a blueprint that says "every task must have these properties"
 */
export interface Task {
  id: string;                    // Unique identifier for each task (we use timestamp)
  title: string;                 // The task name/title (required)
  description?: string;          // Optional detailed description
  dueDate?: string;              // Optional due date (stored as ISO string like "2024-01-15")
  priority: 'low' | 'medium' | 'high';  // Priority level - must be one of these three
  completed: boolean;            // Whether the task is done or not
  createdAt: string;             // When the task was created (ISO timestamp)
}

// The key we use to store tasks in localStorage
// This is like a "table name" in a database
const STORAGE_KEY = 'task_tracker_tasks';

/**
 * Get all tasks from localStorage
 * 
 * This is like a "SELECT * FROM tasks" query in SQL.
 * It reads the tasks from browser storage and converts them from JSON back to JavaScript objects.
 * 
 * @returns {Task[]} Array of all tasks, or empty array if none exist or if there's an error
 * 
 * Why return empty array on error?
 * - Better to show no tasks than crash the app
 * - Components can handle empty arrays gracefully
 */
export const getTasks = (): Task[] => {
  try {
    // Get the tasks as a JSON string from localStorage
    // localStorage only stores strings, so we need to parse it
    const tasksJson = localStorage.getItem(STORAGE_KEY);
    
    // If we found something, parse it from JSON to JavaScript objects
    // If nothing found (null), return an empty array
    return tasksJson ? JSON.parse(tasksJson) : [];
  } catch (error) {
    // If something goes wrong (corrupted data, etc.), log it and return empty array
    // This prevents the app from crashing
    console.error('Error retrieving tasks:', error);
    return [];
  }
};

/**
 * Save tasks array to localStorage
 * 
 * This is like a "SAVE" operation - it writes the tasks to browser storage.
 * We convert the JavaScript array to a JSON string because localStorage only stores strings.
 * 
 * @param {Task[]} tasks - The array of tasks to save
 * 
 * Note: This overwrites ALL tasks. We always save the complete list.
 * This is simpler than trying to update individual tasks in storage.
 */
export const saveTasks = (tasks: Task[]): void => {
  try {
    // Convert the tasks array to a JSON string and save it
    // JSON.stringify converts JavaScript objects/arrays to a string format
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    // If storage is full or there's another error, log it
    // (localStorage has a ~5-10MB limit)
    console.error('Error saving tasks:', error);
  }
};

/**
 * Create a new task and add it to the list
 * 
 * This is like an "INSERT" operation in SQL.
 * We automatically generate the ID, set completed to false, and add a timestamp.
 * 
 * @param {Omit<Task, 'id' | 'completed' | 'createdAt'>} taskData - The task info from the form
 *   (We use 'Omit' to say "give us everything except id, completed, and createdAt"
 *    because we'll generate those automatically)
 * 
 * @returns {Task} The newly created task with all fields filled in
 * 
 * How it works:
 * 1. Get the current list of tasks
 * 2. Create a new task object with auto-generated fields
 * 3. Add it to the list
 * 4. Save the updated list
 * 5. Return the new task (so the UI can update immediately)
 */
export const addTask = (taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>): Task => {
  // First, get all existing tasks
  const tasks = getTasks();
  
  // Create a new task object
  // We spread (...taskData) to copy all the properties from the form
  // Then we add the auto-generated fields
  const newTask: Task = {
    id: Date.now().toString(),              // Use current timestamp as unique ID
    ...taskData,                            // Copy title, description, dueDate, priority from form
    completed: false,                       // New tasks always start as incomplete
    createdAt: new Date().toISOString(),    // Record when it was created (ISO format: "2024-01-15T10:30:00.000Z")
  };
  
  // Add the new task to the end of the array
  tasks.push(newTask);
  
  // Save the updated list back to localStorage
  saveTasks(tasks);
  
  // Return the new task so the component can use it immediately
  // (no need to reload from storage)
  return newTask;
};

/**
 * Update an existing task
 * 
 * This is like an "UPDATE" operation in SQL.
 * We find the task by ID and update only the fields that are provided.
 * 
 * @param {string} id - The unique ID of the task to update
 * @param {Partial<Task>} updates - An object with only the fields to change
 *   (Partial means "some or all fields, but not required to have all of them")
 *   Example: { title: "New title" } or { completed: true, priority: "high" }
 * 
 * @returns {Task | null} The updated task if found, or null if task doesn't exist
 * 
 * How it works:
 * 1. Get all tasks
 * 2. Find the index of the task with matching ID
 * 3. If found, merge the updates with existing task data
 * 4. Save the updated list
 * 5. Return the updated task
 */
export const updateTask = (id: string, updates: Partial<Task>): Task | null => {
  // Get all current tasks
  const tasks = getTasks();
  
  // Find which position in the array this task is at
  // findIndex returns -1 if not found, or the index (0, 1, 2, etc.) if found
  const taskIndex = tasks.findIndex((task) => task.id === id);
  
  // If task not found (index is -1), return null
  // This tells the caller "sorry, that task doesn't exist"
  if (taskIndex === -1) {
    return null;
  }
  
  // Update the task by merging old data with new data
  // The spread operator (...) copies all properties
  // Updates come second, so they overwrite any matching properties
  // Example: { title: "Old", priority: "low" } + { priority: "high" } = { title: "Old", priority: "high" }
  tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
  
  // Save the updated list
  saveTasks(tasks);
  
  // Return the updated task
  return tasks[taskIndex];
};

/**
 * Delete a task by ID
 * 
 * This is like a "DELETE" operation in SQL.
 * We remove the task from the list and save the updated list.
 * 
 * @param {string} id - The unique ID of the task to delete
 * @returns {boolean} True if task was found and deleted, false if task doesn't exist
 * 
 * How it works:
 * 1. Get all tasks
 * 2. Filter out the task with matching ID (keep all others)
 * 3. Check if the list got shorter (meaning we found and removed it)
 * 4. Save the filtered list
 * 5. Return true if deleted, false if not found
 */
export const deleteTask = (id: string): boolean => {
  // Get all current tasks
  const tasks = getTasks();
  
  // Create a new array with all tasks EXCEPT the one we want to delete
  // filter() keeps items where the condition is true
  // So we keep tasks where task.id !== id (not equal to the ID we want to delete)
  const filteredTasks = tasks.filter((task) => task.id !== id);
  
  // If the filtered list is the same length as the original,
  // that means we didn't find the task to delete (nothing was removed)
  if (filteredTasks.length === tasks.length) {
    return false; // Task not found - nothing was deleted
  }
  
  // Save the updated list (without the deleted task)
  saveTasks(filteredTasks);
  
  // Return true to indicate success
  return true;
};

/**
 * Toggle a task's completed status (mark as done/undone)
 * 
 * This is a convenience function that makes it easy to check/uncheck tasks.
 * Instead of manually calling updateTask with { completed: true/false },
 * this function automatically flips the current state.
 * 
 * @param {string} id - The unique ID of the task to toggle
 * @returns {Task | null} The updated task if found, null if task doesn't exist
 * 
 * How it works:
 * 1. Find the task
 * 2. If found, flip its completed status (true becomes false, false becomes true)
 * 3. Use updateTask to save the change
 * 
 * Example:
 * - Task is incomplete (completed: false) → becomes completed: true
 * - Task is complete (completed: true) → becomes completed: false
 */
export const toggleTaskComplete = (id: string): Task | null => {
  // Get all tasks
  const tasks = getTasks();
  
  // Find the specific task we want to toggle
  // find() returns the task object if found, or undefined if not found
  const task = tasks.find((t) => t.id === id);
  
  // If task doesn't exist, return null
  if (!task) {
    return null;
  }
  
  // Use updateTask to flip the completed status
  // !task.completed means "the opposite of current completed value"
  // If completed is false, !false = true
  // If completed is true, !true = false
  return updateTask(id, { completed: !task.completed });
};

