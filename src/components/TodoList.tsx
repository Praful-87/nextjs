"use client";

import { deleteTodo, updateTodo, ApiError } from "@/lib/api/todos";
import { Todo } from "@/types/todo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type TodoListProps = {
  todos: Todo[];
  currentPage: number;
  totalPages: number;
  total: number;
  active: number;
  completed: number;
};

export default function TodoList({
  todos,
  currentPage,
  totalPages,
  total,
  active,
  completed,
}: TodoListProps) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const [searchInput, setSearchInput] = useState(search);

  const filterParam = searchParams.get("status");

  const filter =
    filterParam === "active" || filterParam === "completed"
      ? filterParam
      : "all";

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

      if (todos.length === 1 && currentPage > 1) {
        const params = new URLSearchParams(searchParams.toString());

        params.set("page", String(currentPage - 1));

        router.push(`/?${params.toString()}`);
      } else {
        router.refresh();
      }
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

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (searchInput.trim()) {
        params.set("search", searchInput.trim());
      } else {
        params.delete("search");
      }

      params.delete("page");

      router.push(`/?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <div className="space-y-4">
      {error && <p className="rounded bg-red-100 p-3 text-red-600">{error} </p>}

      <div className="mb-4 flex gap-4 text-sm text-gray-500">
        <span>Total: {total}</span>
        <span>Active: {active}</span>
        <span>Completed: {completed}</span>
      </div>

      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());

            params.set("page", String(currentPage - 1));

            router.push(`/?${params.toString()}`);
          }}
          className={`rounded border px-3 py-2 text-sm ${
            filter === "all" ? "bg-black text-white" : ""
          }`}
        >
          All
        </button>

        <button
          type="button"
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());

            params.set("page", String(currentPage + 1));

            router.push(`/?${params.toString()}`);
          }}
          className={`rounded border px-3 py-2 text-sm ${
            filter === "active" ? "bg-black text-white" : ""
          }`}
        >
          Active
        </button>

        <button
          type="button"
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());

            params.set("status", "completed");
            params.delete("page");

            router.push(`/?${params.toString()}`);
          }}
          className={`rounded border px-3 py-2 text-sm ${
            filter === "completed" ? "bg-black text-white" : ""
          }`}
        >
          Completed
        </button>
      </div>

      {/* Search Todos */}
      <div className="mb-4">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search todos..."
          className="w-full rounded border px-3 py-2 outline-none focus:ring-2"
        />
      </div>
      {/* Search Todos */}

      <div className="space-y-4 h-50 overflow-y-auto p-6">
        {todos.length === 0 ? (
          <div className="rounded-lg border p-8 text-center">
            <h2 className="text-lg font-semibold">No todos yet</h2>
            <p className="mt-2 text-sm text-gray-500">
              Create your first todo to get started.
            </p>
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo._id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <h2
                  className={
                    todo.completed
                      ? "text-lg font-semibold line-through opacity-50"
                      : "text-lg font-semibold"
                  }
                >
                  {todo.title}
                </h2>

                <p
                  className={
                    todo.completed
                      ? "text-sm line-through opacity-50"
                      : "text-sm"
                  }
                >
                  {todo.description}
                </p>
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
                  className="rounded border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {updatingId === todo._id
                    ? "Saving..."
                    : todo.completed
                      ? "Completed"
                      : "Mark complete"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());

              params.set("page", String(currentPage - 1));

              router.push(`/?${params.toString()}`);
            }}
            className="rounded border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());

              params.set("page", String(currentPage + 1));

              router.push(`/?${params.toString()}`);
            }}
            className="rounded border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
