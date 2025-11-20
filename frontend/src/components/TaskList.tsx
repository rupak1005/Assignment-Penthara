/**
 * TaskList Component
 * 
 * This component displays a list of tasks in either grid or list view.
 * It also groups tasks by date ranges (Today, This Week, etc.) using accordions.
 * 
 * Features:
 * - Grid/List view toggle
 * - Task grouping by due date
 * - Empty state handling
 * - Status filtering (all/pending/completed)
 * 
 * The tasks are already filtered by search and priority in the parent component,
 * so this component just handles status filtering and display.
 */

import React, { useState, useMemo } from 'react';
import { AlertCircle, Grid, List } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion } from '@/components/ui/accordion';
import type { Task } from '@/services/taskService';
import TaskItem from './TaskItem';
import { parseDateOnly } from '@/lib/utils';

interface TaskListProps {
  tasks: Task[];                                    // The tasks to display (already filtered by search/priority)
  filter: 'all' | 'completed' | 'pending';         // Status filter: show all, only completed, or only pending
  onToggleComplete: (id: string) => void;          // Callback when user marks task as done/undone
  onEdit: (task: Task) => void;                    // Callback when user clicks edit
  onDelete: (task: Task) => void;                  // Callback when user clicks delete
  onAddTask: () => void;                           // Callback when user wants to add a task (from empty state)
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  filter,
  onToggleComplete,
  onEdit,
  onDelete,
  onAddTask,
}) => {
  // State to track whether we're showing tasks in grid view or list view
  // Grid view: cards in a grid layout (like Pinterest)
  // List view: tasks stacked vertically (like a traditional list)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  /**
   * Filter tasks by completion status
   * 
   * This applies the status filter (all/pending/completed) to the tasks.
   * The tasks have already been filtered by search and priority in the parent.
   * 
   * @returns {Task[]} Filtered array of tasks
   */
  const getFilteredTasks = (): Task[] => {
    switch (filter) {
      case 'completed':
        // Only show tasks that are marked as completed
        return tasks.filter((task) => task.completed);
      case 'pending':
        // Only show tasks that are NOT completed
        return tasks.filter((task) => !task.completed);
      default:
        // Show all tasks (no filtering by status)
        return tasks;
    }
  };

  // Get the filtered tasks (by status)
  const filteredTasks = getFilteredTasks();

  /**
   * Group tasks by their due dates into categories
   * 
   * This organizes tasks into groups like "Today", "This Week", etc.
   * We use useMemo to avoid recalculating this every render - it only
   * recalculates when filteredTasks changes.
   * 
   * Categories:
   * - Today: Tasks due today
   * - This Week: Tasks due in the next 7 days
   * - This Month: Tasks due in the next month
   * - Later: Tasks due more than a month away
   * - No Date: Tasks without a due date
   * 
   * @returns {Object} An object with category names as keys and task arrays as values
   */
  const groupedTasks = useMemo(() => {
    // Initialize empty groups for each category
    const groups: { [key: string]: Task[] } = {
      'Today': [],
      'This Week': [],
      'This Month': [],
      'Later': [],
      'No Date': [],
    };

    // Get today's date and set time to midnight (00:00:00)
    // This makes date comparisons easier (we only care about the date, not the time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculate dates for "This Week" (7 days from now) and "This Month" (1 month from now)
    const weekFromNow = new Date(today);
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    
    const monthFromNow = new Date(today);
    monthFromNow.setMonth(monthFromNow.getMonth() + 1);

    // Go through each task and put it in the appropriate group
    filteredTasks.forEach((task) => {
      // If task has no due date, put it in "No Date" group
      if (!task.dueDate) {
        groups['No Date'].push(task);
        return;  // Skip to next task
      }

      // Parse the due date and compare using local time
      const dueDate = parseDateOnly(task.dueDate);
      if (!dueDate) {
        groups['No Date'].push(task);
        return;
      }

      // Categorize the task based on when it's due
      if (dueDate.getTime() === today.getTime()) {
        // Due today
        groups['Today'].push(task);
      } else if (dueDate > today && dueDate <= weekFromNow) {
        // Due within the next 7 days (but not today)
        groups['This Week'].push(task);
      } else if (dueDate > weekFromNow && dueDate <= monthFromNow) {
        // Due within the next month (but more than a week away)
        groups['This Month'].push(task);
      } else {
        // Due more than a month away (or in the past - though we filter those out above)
        groups['Later'].push(task);
      }
    });

    return groups;
  }, [filteredTasks]);  // Only recalculate when filteredTasks changes

  /**
   * Convert grouped tasks into accordion items
   * 
   * This takes the grouped tasks and formats them for the Accordion component.
   * Each group becomes an accordion section that can be expanded/collapsed.
   * 
   * We use useMemo to avoid recreating this structure on every render.
   * It only recalculates when the dependencies change.
   * 
   * @returns {Array} Array of accordion item objects with title, children, and defaultOpen
   */
  const accordionItems = useMemo(() => {
    // Convert the groups object into an array of [groupName, tasksArray] pairs
    // Then filter out any groups that have no tasks (no point showing empty groups)
    // Then map each group into an accordion item format
    return Object.entries(groupedTasks)
      .filter(([_, tasks]) => tasks.length > 0)  // Only include groups with tasks
      .map(([groupTitle, tasks]) => ({
        // Title shows the group name and count: "Today (3)" or "This Week (5)"
        title: `${groupTitle} (${tasks.length})`,
        
        // The content of the accordion section - the actual task cards/list items
        children: (
          <div className={viewMode === 'grid' 
            // Grid view: keep cards at a maximum of two columns for a zoomed-in feel
            ? "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
            // List view: vertical stack of tasks
            : "flex flex-col space-y-2 sm:space-y-3 h-full gap-2"
          }>
            {/* Render each task in this group as a TaskItem component */}
            {tasks.map((task) => (
              <TaskItem
                key={task.id}  // React needs a unique key for each item in a list
                task={task}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        ),
        
        // "Today" and "This Week" sections are open by default
        // This makes sense because these are usually the most important tasks
        defaultOpen: groupTitle === 'Today' || groupTitle === 'This Week',
      }));
  }, [groupedTasks, viewMode, onToggleComplete, onEdit, onDelete]);

  /**
   * Get the appropriate empty state message based on the current filter
   * 
   * When there are no tasks to show, we display a helpful message.
   * The message changes depending on which filter is active.
   * 
   * @returns {Object} Object with title and description for the empty state
   */
  const getEmptyStateMessage = () => {
    switch (filter) {
      case 'completed':
        // User is viewing completed tasks but has none
        return {
          title: 'No completed tasks',
          description: 'Mark some tasks as completed to see them here.',
        };
      case 'pending':
        // User is viewing pending tasks but has none (all done!)
        return {
          title: 'No pending tasks',
          description: 'You have completed all your tasks. Great work!',
        };
      default:
        // User is viewing all tasks but has none (or they're all filtered out)
        return {
          title: 'No tasks found',
          description: 'Create your first task to get started.',
        };
    }
  };

  /**
   * Empty State: Show a friendly message when there are no tasks
   * 
   * This is displayed when filteredTasks is empty. It provides helpful
   * guidance to the user about what to do next.
   */
  if (filteredTasks.length === 0) {
    const emptyState = getEmptyStateMessage();
    return (
      <Card className="py-10 sm:py-14 px-4 sm:px-6 shadow-sm dark:shadow-none border-[1.5px] dark:border-gray-700">
        <CardContent className="text-center flex flex-col items-center">
          {/* Alert icon to indicate empty state */}
          <AlertCircle className="text-gray-400 dark:text-gray-500 mb-3 sm:mb-4" size={40} />
          
          {/* Title message */}
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {emptyState.title}
          </h3>
          
          {/* Description message */}
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-5 sm:mb-6 max-w-md px-4">
            {emptyState.description}
          </p>
          
          {/* Show "Add Task" button only when viewing all tasks */}
          {/* (No point showing it if they're filtered to completed/pending) */}
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

      {/* Task List with Accordion Grouping */}
      {accordionItems.length > 0 ? (
        <div className="animate-fadeIn bg-sidebar">
          <Accordion items={accordionItems} allowMultiple={true} />
        </div>
      ) : (
        <div className="animate-fadeIn">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            <div className="flex flex-col space-y-2 sm:space-y-3">
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
      )}
    </div>
  );
};

export default TaskList;
