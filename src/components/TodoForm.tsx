"use client";

import Link from "next/link";
import {
  ApiError,
  createTodo,
  updateTodo,
  type FieldErrors,
} from "@/lib/api/todos";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Todo = {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
};

type TodoFormProps = {
  mode: "create" | "edit";
  todo?: Todo;
};

export default function TodoForm({ mode, todo }: TodoFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(todo?.title ?? "");
  const [description, setDescription] = useState(todo?.description ?? "");
  const [completed, setCompleted] = useState(todo?.completed ?? false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function clearFieldError(field: string) {
    setFieldErrors((currentErrors) => {
      const updatedErrors = { ...currentErrors };

      delete updatedErrors[field];

      return updatedErrors;
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setFieldErrors({});
    setIsLoading(true);

    try {
      const data = {
        title,
        description,
        completed,
      };

      if (mode === "create") {
        await createTodo(data);

        setTitle("");
        setDescription("");
        setCompleted(false);
      } else {
        if (!todo) {
          throw new Error("Todo not found");
        }

        await updateTodo(todo._id, data);
      }

      router.refresh();
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
        setFieldErrors(error.errors ?? {});
      } else {
        setError(
          error instanceof Error ? error.message : "Something went wrong",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-lg p-6 shadow">
      {error && (
        <p className="mb-4 rounded bg-red-100 p-3 text-red-600">{error} </p>
      )}

      <h2 className="mb-4 text-2xl font-semibold">
        {mode === "create" ? "Add Todo" : "Edit Todo"}
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              clearFieldError("title");
            }}
            type="text"
            placeholder="Title"
            className="w-full rounded border p-3"
          />

          {fieldErrors.title?.[0] && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.title[0]}</p>
          )}
        </div>

        <div>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              clearFieldError("description");
            }}
            placeholder="Description"
            className="w-full rounded border p-3"
            rows={4}
          />

          {fieldErrors.description?.[0] && (
            <p className="mt-1 text-sm text-red-600">
              {fieldErrors.description[0]}
            </p>
          )}
        </div>

        {mode === "edit" && (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
            />

            <span>Completed</span>
          </label>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isLoading}
            className="cursor-pointer rounded bg-blue-600 px-5 py-2 text-white"
          >
            {isLoading
              ? mode === "create"
                ? "Adding..."
                : "Updating..."
              : mode === "create"
                ? "Add Todo"
                : "Update Todo"}
          </button>

          {mode === "edit" && (
            <Link
              href="/"
              className="flex items-center justify-center rounded bg-blue-400 px-5 py-2"
            >
              Home
            </Link>
          )}
        </div>
      </form>
    </div>
  );
}
