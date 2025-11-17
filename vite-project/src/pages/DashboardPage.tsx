/**
 * DashboardPage Component
 *
 * Dashboard view showing task statistics and overview with charts.
 * Displays task metrics, charts, and recent activities.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MonochromeBarChart } from '@/components/ui/monochrome-bar-chart';
import { ClippedAreaChart } from '@/components/ui/clipped-area-chart';
import { getTasks } from '@/services/taskService';
import type { Task } from '@/services/taskService';


/**
 * DashboardPage component for displaying task overview with analytics
 */
const DashboardPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load tasks from localStorage
  useEffect(() => {
    const loadedTasks = getTasks();
    setTasks(loadedTasks);
  }, []);

  /**
   * Calculates task statistics
   * @returns {Object} Task statistics object
   */
  const getStats = () => {
    return {
      total: tasks.length,
      completed: tasks.filter((task) => task.completed).length,
      pending: tasks.filter((task) => !task.completed).length,
      highPriority: tasks.filter((task) => task.priority === 'high' && !task.completed).length,
    };
  };

  /**
   * Prepares data for completion trend chart
   * @returns {Array} Chart data array
   */
  const getCompletionTrend = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split('T')[0];

      const completedOnDay = tasks.filter((task) => {
        if (!task.completed || !task.createdAt) return false;
        const taskDate = new Date(task.createdAt).toISOString().split('T')[0];
        return taskDate === dateStr;
      }).length;

      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        completed: completedOnDay,
      };
    });

    return last7Days;
  };

  const stats = getStats();
  const completionTrend = getCompletionTrend();

  const statusChartData = [
    { name: 'Completed', value: stats.completed },
    { name: 'Pending', value: stats.pending },
  ];


  const completionTrendChange =
    completionTrend.length > 1 && completionTrend[0].completed !== 0
      ? ((completionTrend[completionTrend.length - 1].completed - completionTrend[0].completed) /
          Math.max(completionTrend[0].completed, 1)) *
        100
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-3xl font-bold dark:text-sidebar-foreground text-gray-900 mb-2">
          Good morning, User
        </h2>
        <p className="text-gray-600 dark:text-gray-400">Manage your tasks efficiently and effectively.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 ">
              High Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.highPriority}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonochromeBarChart
          data={statusChartData}
          dataKey="value"
          nameKey="name"
          title="Task Status Overview"
          description="Completed vs Pending tasks"
          height={320}
        />
        <ClippedAreaChart
          data={completionTrend}
          dataKey="completed"
          nameKey="date"
          title="Completion Trend"
          description="Tasks completed in the last 7 days"
          color="var(--chart-2)"
          trend={completionTrendChange}
          height={320}
        />
      </div>

    </div>
  );
};

export default DashboardPage;
