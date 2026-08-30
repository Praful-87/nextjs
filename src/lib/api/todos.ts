import type { Todo, TodoInput } from "@/types/todo";

export type FieldErrors = Record<string, string[]>;

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  errors?: FieldErrors;
};

export class ApiError extends Error {
  errors?: FieldErrors;

  constructor(message: string, errors?: FieldErrors) {
    super(message);
    this.name = "ApiError";
    this.errors = errors;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const result: ApiResponse<T> = await response.json();

  if (!response.ok) {
    throw new ApiError(result.message || "Something went wrong", result.errors);
  }

  if (result.data === undefined) {
    throw new Error("No data returned from server");
  }

  return result.data;
}

export async function createTodo(data: TodoInput): Promise<Todo> {
  const response = await fetch("/api/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse<Todo>(response);
}

export async function updateTodo(id: string, data: TodoInput): Promise<Todo> {
  const response = await fetch(`/api/todos/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse<Todo>(response);
}

export async function deleteTodo(id: string): Promise<Todo> {
  const response = await fetch(`/api/todos/${id}`, {
    method: "DELETE",
  });

  return handleResponse<Todo>(response);
}
