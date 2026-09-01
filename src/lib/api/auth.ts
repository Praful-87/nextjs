import type { User } from "@/types/user";

export type FieldErrors = Record<string, string[]>;

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  errors?: FieldErrors;
};

export class AuthApiError extends Error {
  errors?: FieldErrors;

  constructor(message: string, errors?: FieldErrors) {
    super(message);
    this.name = "AuthApiError";
    this.errors = errors;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const result: ApiResponse<T> = await response.json();

  if (!response.ok) {
    throw new AuthApiError(
      result.message || "Something went wrong",
      result.errors,
    );
  }

  if (result.data === undefined) {
    throw new Error("No data returned from server");
  }

  return result.data;
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}): Promise<User> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse<User>(response);
}

export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<User> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse<User>(response);
}

export async function logoutUser() {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
  });

  return handleResponse<{ message: string }>(response);
}
