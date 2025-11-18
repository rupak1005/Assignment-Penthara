import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash, CalendarDays, CheckCircle2 } from "lucide-react";
import type { Task } from "@/services/taskService";

const priorityStyles: Record<string, string> = {
  low: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-200",
  medium: "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-200",
  high: "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/20 dark:text-rose-200",
};

interface Props {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const TaskItem: React.FC<Props> = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <Card
      className={`
        group flex  w-full flex-col rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm
        shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg
        ${task.completed ? "opacity-70" : "opacity-100"}
      `}
    >
      <CardContent className="flex h-full flex-col gap-4 px-4 py-4 sm:px-5 sm:py-5 overflow-hidden">

{/* Title & Priority */}
<div className="flex items-start justify-between gap-3">
  <div className="space-y-1.5">
    <h3 className="text-base sm:text-lg font-semibold text-foreground leading-tight line-clamp-2">
      {task.title}
    </h3>

    {formattedDueDate && (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <CalendarDays className="h-4 w-4" />
        <span>Due {formattedDueDate}</span>
      </div>
    )}
  </div>

  <Badge
    className={`inline-flex items-center gap-1.5 rounded-full border text-[10px] sm:text-xs tracking-wide px-2 py-1 ${priorityStyles[task.priority]}`}
  >
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${
        task.priority === "high"
          ? "bg-rose-600"
          : task.priority === "medium"
          ? "bg-amber-600"
          : "bg-emerald-600"
      }`}
    />
    <span className="capitalize">{task.priority}</span>
  </Badge>
</div>

{/* Description */}
{task.description ? (
  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
    {task.description}
  </p>
) : (
  <p className="text-sm text-muted-foreground italic">
    No description provided.
  </p>
)}

{/* Actions */}
<div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
  <Button
    size="sm"
    variant={task.completed ? "secondary" : "default"}
    onClick={() => onToggleComplete(task.id)}
    className="gap-1"
  >
    <CheckCircle2 className="h-4 w-4" />
    {task.completed ? "Completed" : "Mark done"}
  </Button>

  <div className="flex gap-2">
    <Button
      size="icon"
      variant="outline"
      onClick={() => onEdit(task)}
      className="rounded-full"
    >
      <Pencil size={15} />
    </Button>
    <Button
      size="icon"
      variant="destructive"
      onClick={() => onDelete(task)}
      className="rounded-full"
    >
      <Trash size={15} />
    </Button>
  </div>
</div>

</CardContent>

    </Card>
  );
};

export default TaskItem;
