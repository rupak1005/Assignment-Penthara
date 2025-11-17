/**
 * CalendarPage Component
 * 
 * Calendar view with task indicators and upcoming tasks.
 * Displays calendar with dots on dates where tasks are scheduled.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getTasks } from '@/services/taskService';
import type { Task } from '@/services/taskService';

/**
 * CalendarPage component for displaying calendar with task indicators
 */
const CalendarPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Load tasks from localStorage
  useEffect(() => {
    const loadedTasks = getTasks();
    setTasks(loadedTasks);
  }, []);

  /**
   * Gets tasks for a specific date
   * @param {Date} date - Date to get tasks for
   * @returns {Task[]} Array of tasks for that date
   */
  const getTasksForDate = (date: Date): Task[] => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      return task.dueDate === dateStr;
    });
  };

  /**
   * Checks if a date has tasks
   * @param {Date} date - Date to check
   * @returns {boolean} True if date has tasks
   */
  const hasTasks = (date: Date): boolean => {
    return getTasksForDate(date).length > 0;
  };

  /**
   * Gets task count for a date
   * @param {Date} date - Date to get task count for
   * @returns {number} Number of tasks for that date
   */
  const getTaskCount = (date: Date): number => {
    return getTasksForDate(date).length;
  };

  /**
   * Navigates to previous month
   */
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  /**
   * Navigates to next month
   */
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  /**
   * Navigates to today
   */
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  /**
   * Gets calendar days for current month
   * @returns {Array} Array of calendar days
   */
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: Array<{ date: Date; isCurrentMonth: boolean; isToday: boolean }> = [];

    // Previous month's trailing days
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonth.getDate() - i);
      days.push({ date, isCurrentMonth: false, isToday: false });
    }

    // Current month's days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
      days.push({ date, isCurrentMonth: true, isToday });
    }

    // Next month's leading days
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({ date, isCurrentMonth: false, isToday: false });
    }

    return days;
  }, [currentDate]);

  /**
   * Gets upcoming tasks sorted by due date
   * @returns {Task[]} Array of upcoming tasks
   */
  const getUpcomingTasks = (): Task[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tasks
      .filter((task) => {
        if (!task.dueDate || task.completed) return false;
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate >= today;
      })
      .sort((a, b) => {
        if (!a.dueDate || !b.dueDate) return 0;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      })
      .slice(0, 10);
  };

  /**
   * Gets priority badge variant
   * @param {string} priority - Task priority
   * @returns {string} Badge variant
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

  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const upcomingTasks = getUpcomingTasks();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold text-gray-900">Calendar</h2>
        <Button onClick={goToToday} variant="outline">
          Today
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">{monthYear}</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                  <ChevronLeft size={20} />
                </Button>
                <Button variant="outline" size="icon" onClick={goToNextMonth}>
                  <ChevronRight size={20} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-gray-600 p-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((dayInfo, index) => {
                const tasksCount = hasTasks(dayInfo.date) ? getTaskCount(dayInfo.date) : 0;

                return (
                  <div
                    key={index}
                    className={`
                      relative min-h-[80px] p-2 border rounded-md
                      ${dayInfo.isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                      ${dayInfo.isToday ? 'ring-2 ring-blue-500' : ''}
                      hover:bg-gray-100 cursor-pointer transition-colors
                    `}
                  >
                    <div
                      className={`
                        text-sm font-medium mb-1
                        ${dayInfo.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                        ${dayInfo.isToday ? 'text-blue-600 font-bold' : ''}
                      `}
                    >
                      {dayInfo.date.getDate()}
                    </div>
                    {tasksCount > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {Array.from({ length: Math.min(tasksCount, 3) }).map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 rounded-full bg-blue-500"
                            title={`${tasksCount} task(s) on this date`}
                          />
                        ))}
                        {tasksCount > 3 && (
                          <span className="text-xs text-gray-500">+{tasksCount - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No upcoming tasks</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{task.title}</h4>
                      <Badge variant={getPriorityVariant(task.priority) as any} className="ml-2">
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </Badge>
                    </div>
                    {task.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    {task.dueDate && (
                      <p className="text-xs text-gray-500">
                        Due: {new Date(task.dueDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarPage;

