const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

const handleResponse = async <T>(response: globalThis.Response): Promise<T> => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = (data as { message?: string }).message || "Request failed";
    throw new Error(message);
  }
  return data as T;
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return handleResponse<AuthResponse>(response);
};

export const register = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  return handleResponse<AuthResponse>(response);
};

export const fetchProfile = async (token: string): Promise<AuthUser> => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await handleResponse<{ user: AuthUser }>(response);
  return data.user;
};

