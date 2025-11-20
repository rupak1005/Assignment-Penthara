const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  priority: TaskPriority;
  completed: boolean;
  createdAt: string;
}

export type TaskPayload = Omit<Task, "id" | "completed" | "createdAt">;

const withAuth = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

const handleResponse = async <T>(response: globalThis.Response): Promise<T> => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = (data as { message?: string }).message || "Request failed";
    throw new Error(message);
  }
  return data as T;
};

export const fetchTasks = async (token: string): Promise<Task[]> => {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    headers: withAuth(token),
  });
  return handleResponse<Task[]>(response);
};

export const createTask = async (
  payload: TaskPayload,
  token: string
): Promise<Task> => {
  const body = {
    ...payload,
    description: payload.description || null,
    dueDate: payload.dueDate || null,
  };
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: withAuth(token),
    body: JSON.stringify(body),
  });
  return handleResponse<Task>(response);
};

export const updateTask = async (
  id: string,
  updates: Partial<TaskPayload & { completed: boolean }>,
  token: string
): Promise<Task> => {
  const body = {
    ...updates,
    description:
      updates.description === undefined ? undefined : updates.description || null,
    dueDate: updates.dueDate === undefined ? undefined : updates.dueDate || null,
  };
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: withAuth(token),
    body: JSON.stringify(body),
  });
  return handleResponse<Task>(response);
};

export const deleteTask = async (id: string, token: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: withAuth(token),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const message = (data as { message?: string }).message || "Failed to delete";
    throw new Error(message);
  }
};

export const toggleTaskComplete = async (
  id: string,
  token: string
): Promise<Task> => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}/toggle`, {
    method: "PATCH",
    headers: withAuth(token),
  });
  return handleResponse<Task>(response);
};

