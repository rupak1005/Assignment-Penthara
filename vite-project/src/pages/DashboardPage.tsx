/**
 * DashboardPage Component (Beautified)
 *
 * Modern dashboard with improved UI, glassmorphism cards,
 * gradients, hover effects, and better visual hierarchy.
 */

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MonochromeBarChart } from "@/components/ui/monochrome-bar-chart";
import { ClippedAreaChart } from "@/components/ui/clipped-area-chart";
import { getTasks } from "@/services/taskService";
import type { Task } from "@/services/taskService";

const DashboardPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loadedTasks = getTasks();
    setTasks(loadedTasks);
  }, []);

  const getStats = () => ({
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
    highPriority: tasks.filter(
      (t) => t.priority === "high" && !t.completed
    ).length,
  });

  const getCompletionTrend = () => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split("T")[0];

      const completedOnDay = tasks.filter((task) => {
        if (!task.completed || !task.createdAt) return false;
        return (
          new Date(task.createdAt).toISOString().split("T")[0] === dateStr
        );
      }).length;

      return {
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        completed: completedOnDay,
      };
    });
  };

  const stats = getStats();
  const completionTrend = getCompletionTrend();

  const statusChartData = [
    { name: "Completed", value: stats.completed },
    { name: "Pending", value: stats.pending },
  ];

  const completionTrendChange =
    completionTrend.length > 1 && completionTrend[0].completed !== 0
      ? ((completionTrend[completionTrend.length - 1].completed -
          completionTrend[0].completed) /
          Math.max(completionTrend[0].completed, 1)) *
        100
      : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Good morning, User
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Track your productivity and manage tasks efficiently.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* TOTAL TASKS */}
        <Card className="backdrop-blur-lg bg-white/50 dark:bg-[#1b1d24]/60 border border-gray-200/40 dark:border-gray-700/40 shadow-md hover:shadow-lg transition">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm text-gray-600 dark:text-gray-400">
              Total Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
              {stats.total}
            </div>
          </CardContent>
        </Card>

        {/* COMPLETED */}
        <Card className="backdrop-blur-lg bg-white/50 dark:bg-[#1b1d24]/60 border border-gray-200/40 dark:border-gray-700/40 shadow-md hover:shadow-lg transition">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm text-gray-600 dark:text-gray-400">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">
              {stats.completed}
            </div>
          </CardContent>
        </Card>

        {/* PENDING */}
        <Card className="backdrop-blur-lg bg-white/50 dark:bg-[#1b1d24]/60 border border-gray-200/40 dark:border-gray-700/40 shadow-md hover:shadow-lg transition">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm text-gray-600 dark:text-gray-400">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
              {stats.pending}
            </div>
          </CardContent>
        </Card>

        {/* HIGH PRIORITY */}
        <Card className="backdrop-blur-lg bg-white/50 dark:bg-[#1b1d24]/60 border border-gray-200/40 dark:border-gray-700/40 shadow-md hover:shadow-lg transition">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm text-gray-600 dark:text-gray-400">
              High Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
              {stats.highPriority}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Chart */}
        <Card className="shadow-md dark:shadow-none">
          <CardHeader>
            <CardTitle className="font-semibold">
              Task Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MonochromeBarChart
              data={statusChartData}
              dataKey="value"
              nameKey="name"
              title=""
              description=""
              height={320}
            />
          </CardContent>
        </Card>

        {/* Trend Chart */}
        <Card className="shadow-md dark:shadow-none">
          <CardHeader>
            <CardTitle className="font-semibold">
              Completion Trend (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ClippedAreaChart
              data={completionTrend}
              dataKey="completed"
              nameKey="date"
              title=""
              description=""
              color="var(--chart-2)"
              trend={completionTrendChange}
              height={320}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
