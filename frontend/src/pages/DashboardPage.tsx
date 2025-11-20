/**
 * DashboardPage Component (Beautified)
 *
 * Modern dashboard with improved UI, glassmorphism cards,
 * gradients, hover effects, and better visual hierarchy.
 */

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonochromeBarChart } from "@/components/ui/monochrome-bar-chart";
import { ClippedAreaChart } from "@/components/ui/clipped-area-chart";
import { AnimatedProgressBar } from "@/components/ui/animated-progress-bar";
import { NumberFlow } from "@/components/ui/number-flow";
import { DynamicIsland } from "@/components/ui/dynamic-island";
import { fetchTasks } from "@/services/taskService";
import type { Task } from "@/services/taskService";
import { parseDateOnly } from "@/lib/utils";

interface DashboardPageProps {
  token: string;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ token }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showNotification, setShowNotification] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        const loadedTasks = await fetchTasks(token);
        setTasks(loadedTasks);
      } catch (error) {
        console.error("Failed to load dashboard tasks", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [token]);

  const getStats = () => ({
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
    highPriority: tasks.filter((t) => t.priority === "high" && !t.completed)
      .length,
  });

  const getCompletionTrend = () => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split("T")[0];

      const completedOnDay = tasks.filter((task) => {
        if (!task.completed || !task.createdAt) return false;
        return new Date(task.createdAt).toISOString().split("T")[0] === dateStr;
      }).length;

      return {
        label: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        dateFull: date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
        iso: dateStr,
        completed: completedOnDay,
      };
    });
  };

  const stats = getStats();
  const completionTrend = getCompletionTrend();
  const completionPercent =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const remainingTasks = Math.max(stats.total - stats.completed, 0);
  const highPriorityPending = stats.highPriority;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueToday = tasks.filter((t) => {
    if (!t.dueDate || t.completed) return false;
    const due = parseDateOnly(t.dueDate);
    if (!due) return false;
    return due.getTime() === today.getTime();
  }).length;

  const nextDueTask = tasks
    .filter((t) => t.dueDate && !t.completed)
    .sort((a, b) => {
      const dateA = parseDateOnly(a.dueDate);
      const dateB = parseDateOnly(b.dueDate);
      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;
      return dateA.getTime() - dateB.getTime();
    })[0];
  const nextDueLabel = nextDueTask
    ? parseDateOnly(nextDueTask.dueDate!)?.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        weekday: "short",
      }) ?? "No upcoming deadlines"
    : "No upcoming deadlines";

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

  const trendRange = {
    start: completionTrend[0]?.dateFull ?? "N/A",
    end: completionTrend[completionTrend.length - 1]?.dateFull ?? "N/A",
  };

  const totalCompletedWeek = completionTrend.reduce(
    (sum, day) => sum + day.completed,
    0
  );

  const peakDay = completionTrend.reduce((best, current) =>
    current.completed > best.completed ? current : best
  );

  const averagePerDay = completionTrend.length
    ? (totalCompletedWeek / completionTrend.length).toFixed(1)
    : "0";

  // Get upcoming tasks for Dynamic Island
  const upcomingTasksCount = tasks.filter((t) => {
    if (!t.dueDate || t.completed) return false;
    const due = parseDateOnly(t.dueDate);
    if (!due) return false;
    const todayLocal = new Date();
    todayLocal.setHours(0, 0, 0, 0);
    const sevenDaysOut = new Date(todayLocal);
    sevenDaysOut.setDate(sevenDaysOut.getDate() + 7);
    return due >= todayLocal && due <= sevenDaysOut;
  }).length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {isLoading && (
        <p className="text-sm text-muted-foreground">Loading insights...</p>
      )}
      {/* Dynamic Island Notification */}
      {upcomingTasksCount > 0 && (
        <DynamicIsland
          isVisible={showNotification}
          onClose={() => setShowNotification(false)}
          position="top"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {upcomingTasksCount} task{upcomingTasksCount !== 1 ? "s" : ""} due
              soon
            </span>
          </div>
        </DynamicIsland>
      )}

      {/* Header */}
      <div className="mb-4">
        <h2 className="text-4xl font-extrabold text-accent-foreground tracking-tight">
          Welcome User
        </h2>
        <p className="text-accent-foreground text-lg">
          Track your productivity and manage tasks efficiently.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
        {/* TOTAL TASKS */}
        <Card className="backdrop-blur-lg bg-white/50 dark:bg-[#1b1d24]/60 border border-gray-200/40 dark:border-gray-700/40 shadow-md hover:shadow-lg transition bg-sidebar dark:bg-sidebar-accent">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm text-accent-foreground">
              Total Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold bg-linear-to-r from-cyan-700 to-cyan-900 bg-clip-text text-transparent dark:bg-linear-to-r dark:from-cyan-400 dark:to-cyan-700">
              <NumberFlow value={stats.total} />
            </div>
          </CardContent>
        </Card>

        {/* COMPLETED */}
        <Card className="backdrop-blur-lg bg-white/50 dark:bg-[#1b1d24]/60 border border-gray-200/40 dark:border-gray-700/40 shadow-md hover:shadow-lg transition bg-sidebar dark:bg-sidebar-accent">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm text-accent-foreground">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold bg-linear-to-r from-green-700 to-green-900 bg-clip-text text-transparent dark:bg-linear-to-r dark:from-green-400 dark:to-green-700">
              <NumberFlow value={stats.completed} />
            </div>
          </CardContent>
        </Card>

        {/* PENDING */}
        <Card className="backdrop-blur-lg bg-white/50 dark:bg-[#1b1d24]/60 border border-gray-200/40 dark:border-gray-700/40 shadow-md hover:shadow-lg transition bg-sidebar dark:bg-sidebar-accent">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm text-accent-foreground">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold bg-linear-to-r from-orange-700 to-orange-900 bg-clip-text text-transparent dark:bg-linear-to-r dark:from-orange-400 dark:to-orange-700">
              <NumberFlow value={stats.pending} />
            </div>
          </CardContent>
        </Card>

        {/* HIGH PRIORITY */}
        <Card className="backdrop-blur-lg bg-white/50 dark:bg-[#1b1d24]/60 border border-gray-200/40 dark:border-gray-700/40 shadow-md hover:shadow-lg transition bg-sidebar dark:bg-sidebar-accent">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm text-accent-foreground">
              High Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold bg-linear-to-r from-red-700 to-red-900 bg-clip-text text-transparent dark:bg-linear-to-r dark:from-red-400 dark:to-red-700">
              <NumberFlow value={stats.highPriority} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="shadow-md dark:shadow-none bg-sidebar dark:bg-sidebar-accent">
        <CardHeader>
          <CardTitle className="font-semibold">
            Task Completion Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AnimatedProgressBar
            value={completionPercent}
            label="Overall Progress"
            showLabel={true}
            color="bg-emerald-700"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="rounded-xl border border-border/60 p-3">
              <p className="text-xs uppercase text-muted-foreground tracking-wide">
                Completed
              </p>
              <p className="text-lg font-semibold text-foreground">
                {stats.completed}
                <span className="text-xs text-muted-foreground ml-1">
                  ({completionPercent}%)
                </span>
              </p>
            </div>
            <div className="rounded-xl border border-border/60 p-3">
              <p className="text-xs uppercase text-muted-foreground tracking-wide">
                Remaining
              </p>
              <p className="text-lg font-semibold text-foreground">
                {remainingTasks}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 p-3">
              <p className="text-xs uppercase text-muted-foreground tracking-wide">
                High Priority
              </p>
              <p className="text-lg font-semibold text-foreground">
                {highPriorityPending}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 p-3">
              <p className="text-xs uppercase text-muted-foreground tracking-wide">
                Due Today
              </p>
              <p className="text-lg font-semibold text-foreground">
                {dueToday}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
            <p>
              You've completed {stats.completed} out of {stats.total} tasks.
            </p>
            <p>
              Next deadline:{" "}
              <span className="font-medium text-foreground">
                {nextDueLabel}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
        {" "}
        {/* Status Chart */}{" "}
        <Card className="shadow-md dark:shadow-none bg-sidebar dark:bg-sidebar-accent">
          {" "}
          <CardHeader>
            {" "}
            <CardTitle className="font-semibold">
              {" "}
              Task Status Overview{" "}
            </CardTitle>{" "}
          </CardHeader>{" "}
          <CardContent>
            {" "}
            <MonochromeBarChart
              data={statusChartData}
              dataKey="value"
              nameKey="name"
              title=""
              description=""
              height={320}
            />{" "}
          </CardContent>{" "}
        </Card>{" "}
        {/* Trend Chart */}{" "}
        <Card className="shadow-md dark:shadow-none h-fit bg-sidebar dark:bg-sidebar-accent ">
          {" "}
          <CardHeader>
            {" "}
            <CardTitle className="font-semibold">
              {" "}
              Completion Trend (Last 7 Days){" "}
            </CardTitle>{" "}
          </CardHeader>{" "}
          <CardContent className="space-y-4">
            {" "}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              {" "}
              <div>
                {" "}
                <p className="text-xs uppercase text-muted-foreground tracking-wide">
                  {" "}
                  Date Range{" "}
                </p>{" "}
                <p className="font-medium text-foreground">
                  {" "}
                  {trendRange.start} – {trendRange.end}{" "}
                </p>{" "}
              </div>{" "}
              <div>
                {" "}
                <p className="text-xs uppercase text-muted-foreground tracking-wide">
                  {" "}
                  Total Completed{" "}
                </p>{" "}
                <p className="font-medium text-foreground">
                  {" "}
                  {totalCompletedWeek}{" "}
                  <span className="text-xs text-muted-foreground ml-1">
                    {" "}
                    ({averagePerDay}/day avg){" "}
                  </span>{" "}
                </p>{" "}
              </div>{" "}
              <div>
                {" "}
                <p className="text-xs uppercase text-muted-foreground tracking-wide">
                  {" "}
                  Peak Day{" "}
                </p>{" "}
                <p className="font-medium text-foreground">
                  {" "}
                  {peakDay?.dateFull ?? "N/A"} ({peakDay?.completed ?? 0}){" "}
                </p>{" "}
              </div>{" "}
            </div>{" "}
            <ClippedAreaChart
              data={completionTrend}
              dataKey="completed"
              nameKey="label"
              title=""
              description=""
              color="var(--chart-2)"
              trend={completionTrendChange}
              height={240}
            />{" "}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
              {" "}
              {completionTrend.map((day) => (
                <div
                  key={day.iso}
                  className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2"
                >
                  {" "}
                  <div>
                    {" "}
                    <p className="text-sm font-medium text-foreground">
                      {" "}
                      {day.weekday}{" "}
                    </p>{" "}
                    <p>{day.dateFull}</p>{" "}
                  </div>{" "}
                  <span className="text-base font-semibold text-foreground">
                    {" "}
                    {day.completed}{" "}
                  </span>{" "}
                </div>
              ))}{" "}
            </div>{" "}
          </CardContent>{" "}
        </Card>{" "}
      </div>
    </div>
  );
};

export default DashboardPage;
