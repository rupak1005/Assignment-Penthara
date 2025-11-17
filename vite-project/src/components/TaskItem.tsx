import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import type { Task } from "@/services/taskService";

const priorityStyles: Record<string, string> = {
  low: "bg-green-100 text-green-700 border border-green-300",
  medium: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  high: "bg-red-100 text-red-700 border border-red-300",
};

interface Props {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const TaskItem: React.FC<Props> = ({ task, onToggleComplete, onEdit, onDelete }) => {
  return (
    <Card
      className={`
        shadow-sm border rounded-xl transition hover:shadow-md
        ${task.completed ? "opacity-70" : "opacity-100"}
      `}
    >
      <CardContent className="p-5 space-y-4">
        
        {/* Title & Priority */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{task.title}</h3>

          {/* Priority Badge */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${priorityStyles[task.priority]}`}
          >
            {task.priority.toUpperCase()}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {task.description}
        </p>

        {/* Actions */}
        <div className="flex justify-between items-center pt-2">
          <Button
            size="sm"
            variant={task.completed ? "secondary" : "default"}
            onClick={() => onToggleComplete(task.id)}
          >
            {task.completed ? "Completed" : "Mark Done"}
          </Button>

          <div className="flex gap-2">
            <Button size="icon" variant="outline" onClick={() => onEdit(task)}>
              <Pencil size={16} />
            </Button>
            <Button size="icon" variant="destructive" onClick={() => onDelete(task)}>
              <Trash size={16} />
            </Button>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default TaskItem;
