"use client";

import { deleteTodo, updateTodo, ApiError } from "@/lib/api/todos";
import { Todo } from "@/types/todo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type TodoListProps = {
  todos: Todo[];
};

export default function TodoList({ todos }: TodoListProps) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleToggle(todo: Todo) {
    setError("");
    setUpdatingId(todo._id);

    try {
      await updateTodo(todo._id, {
        title: todo.title,
        description: todo.description,
        completed: !todo.completed,
      });

      router.refresh();
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError(
          error instanceof Error ? error.message : "Something went wrong",
        );
      }
    } finally {
      setUpdatingId(null);
    }
  }
  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Todo?",
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setDeletingId(id);

    try {
      await deleteTodo(id);

      router.refresh();
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError(
          error instanceof Error ? error.message : "Something went wrong",
        );
      }
    } finally {
      setDeletingId(null);
    }
  }

  if (todos.length === 0) {
    return (
      <div className="space-y-4">
        {error && (
          <p className="rounded bg-red-100 p-3 text-red-600">{error}</p>
        )}

        {todos.length === 0 ? (
          <p>No Todos yet.</p>
        ) : (
          <div className="h-50 space-y-4 overflow-y-auto p-6">
            {/* todos */}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && <p className="rounded bg-red-100 p-3 text-red-600">{error} </p>}

      <div className="h-50 space-y-4 overflow-y-auto p-6">
        {todos.map((todo) => (
          <div
            key={todo._id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div>
              <h2 className="text-lg font-semibold">{todo.title}</h2>

              <p>{todo.description}</p>
            </div>

            <div className="flex flex-col gap-2">
              <Link
                href={`/todos/edit/${todo._id}`}
                className="flex h-10 w-18 items-center justify-center rounded bg-blue-400"
              >
                Edit
              </Link>

              <button
                className="h-10 w-18 cursor-pointer rounded bg-red-600 px-3 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => handleDelete(todo._id)}
                disabled={deletingId === todo._id}
              >
                {deletingId === todo._id ? "Deleting..." : "Delete"}
              </button>
              <button
                type="button"
                onClick={() => handleToggle(todo)}
                disabled={updatingId === todo._id}
                className="rounded border px-3 py-2 disabled:opacity-50"
              >
                {updatingId === todo._id
                  ? "Updating..."
                  : todo.completed
                    ? "Completed"
                    : "Mark complete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
