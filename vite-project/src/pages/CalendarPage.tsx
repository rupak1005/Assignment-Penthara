/**
 * CalendarPage Component
 * Calendar view with:
 *  - Task indicators on dates
 *  - Upcoming tasks
 *  - Click a date to view tasks for that day
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getTasks } from '@/services/taskService';
import type { Task } from '@/services/taskService';

const CalendarPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  /** Load tasks */
  useEffect(() => {
    const loaded = getTasks();
    setTasks(loaded);
  }, []);

  /** Helper: tasks for a particular date */
  const getTasksForDate = (date: Date): Task[] => {
    const dateStr = date.toISOString().split("T")[0];
    return tasks.filter((t) => t.dueDate === dateStr);
  };

  /** Calendar Grid Generation */
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const daysInMonth = last.getDate();
    const startOffset = first.getDay();

    const today = new Date();

    const grid: {
      date: Date;
      isCurrentMonth: boolean;
      isToday: boolean;
    }[] = [];

    /** Previous Month Padding */
    const prevMonthLast = new Date(year, month, 0);
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLast.getDate() - i);
      grid.push({ date: d, isCurrentMonth: false, isToday: false });
    }

    /** Current Month */
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      const isToday =
        dateObj.getDate() === today.getDate() &&
        dateObj.getMonth() === today.getMonth() &&
        dateObj.getFullYear() === today.getFullYear();

      grid.push({
        date: dateObj,
        isCurrentMonth: true,
        isToday,
      });
    }

    /** Next Month Padding */
    while (grid.length < 42) {
      const d = new Date(year, month + 1, grid.length - (startOffset + daysInMonth) + 1);
      grid.push({ date: d, isCurrentMonth: false, isToday: false });
    }

    return grid;
  }, [currentDate]);

  /** Selected date task list */
  const selectedDayTasks = useMemo(() => {
    if (!selectedDate) return [];
    return getTasksForDate(selectedDate);
  }, [selectedDate, tasks]);

  /** Upcoming tasks list */
  const getUpcomingTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tasks
      .filter((t) => {
        if (!t.dueDate || t.completed) return false;
        const due = new Date(t.dueDate);
        due.setHours(0, 0, 0, 0);
        return due >= today;
      })
      .sort((a, b) => +new Date(a.dueDate!) - +new Date(b.dueDate!))
      .slice(0, 10);
  };

  const upcomingTasks = getUpcomingTasks();

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "outline";
    }
  };

  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold dark:text-gray-100">Calendar</h2>
        <Button variant="outline" onClick={() => {setCurrentDate(new Date()); setSelectedDate(new Date());}}>
          Today
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Calendar Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{monthYear}</CardTitle>

              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() =>
                  setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
                }>
                  <ChevronLeft size={20} />
                </Button>

                <Button variant="outline" size="icon" onClick={() =>
                  setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
                }>
                  <ChevronRight size={20} />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>

            {/* Week Days */}
            <div className="grid grid-cols-7 mb-2">
              {weekDays.map((d) => (
                <div
                  key={d}
                  className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 p-2"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, idx) => {
                const taskList = getTasksForDate(day.date);
                const isSelected =
                  selectedDate &&
                  day.date.toDateString() === selectedDate.toDateString();

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedDate(day.date)}
                    className={`
                      p-2 min-h-[80px] border rounded-md cursor-pointer transition-all
                      ${day.isCurrentMonth ? "bg-white dark:bg-sidebar-accent" : "bg-gray-50 dark:bg-sidebar-accent/30"}
                      ${day.isToday ? "ring-2 ring-blue-500" : ""}
                      ${isSelected ? "ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20" : ""}
                      hover:bg-gray-100 dark:hover:bg-sidebar-accent/70
                    `}
                  >
                    <div
                      className={`
                        text-sm font-semibold
                        ${day.isToday ? "text-blue-600" : ""}
                        ${day.isCurrentMonth ? "text-gray-900 dark:text-gray-100" : "text-gray-400"}
                      `}
                    >
                      {day.date.getDate()}
                    </div>

                    {/* task dots */}
                    {taskList.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {taskList.slice(0, 3).map((_, i) => (
                          <div key={i} className="w-2 h-2 rounded-full bg-blue-500" />
                        ))}
                        {taskList.length > 3 && (
                          <span className="text-xs text-gray-500">+{taskList.length - 3}</span>
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
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">No upcoming tasks</p>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-sidebar-accent transition">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{task.title}</h4>
                      <Badge variant={getPriorityVariant(task.priority) as any}>
                        {task.priority}
                      </Badge>
                    </div>

                    {task.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
                    )}

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Due: {new Date(task.dueDate!).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Selected Day Tasks */}
        {selectedDate && (
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>
                Tasks on{" "}
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </CardTitle>
            </CardHeader>

            <CardContent>
              {selectedDayTasks.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No tasks for this day.</p>
              ) : (
                <div className="space-y-4">
                  {selectedDayTasks.map((task) => (
                    <div key={task.id} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-sidebar-accent transition">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{task.title}</h4>
                        <Badge variant={getPriorityVariant(task.priority) as any}>
                          {task.priority}
                        </Badge>
                      </div>

                      {task.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
};

export default CalendarPage;
