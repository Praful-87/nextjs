"use client";

import { useState } from "react";

type Todo = {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
};

type TodoFormProps = {
  fetchTodos?: () => Promise<void>;
  mode: "create" | "edit";
  todo?: Todo;
};

export default function TodoForm({
  fetchTodos,
  mode,
  todo,
}: TodoFormProps) {
  const [title, setTitle] = useState(todo?.title ?? "");
  const [description, setDescription] = useState(
    todo?.description ?? "",
  );
  const [completed, setCompleted] = useState(
    todo?.completed ?? false,
  );
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    setIsLoading(true);

    try {
      const url =
        mode === "create"
          ? "/api/todos"
          : `/api/todos/${todo?._id}`;

      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          completed,
        }),
      });

      const result = await response.json();

      console.log(result);

      if (response.ok) {
        if (mode === "create") {
          setTitle("");
          setDescription("");
          setCompleted(false);

          await fetchTodos?.();
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-lg p-6 shadow">
      <h2 className="mb-4 text-2xl font-semibold">
        {mode === "create" ? "Add Todo" : "Edit Todo"}
      </h2>

      <form
        className="space-y-4"
        onSubmit={handleSubmit}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Title"
          className="w-full rounded border p-3"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full rounded border p-3"
          rows={4}
        />

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

        <button
          type="submit"
          disabled={isLoading}
          className="cursor-pointer rounded bg-blue-600 px-5 py-2"
        >
          {isLoading
            ? mode === "create"
              ? "Adding..."
              : "Updating..."
            : mode === "create"
              ? "Add Todo"
              : "Update Todo"}
        </button>
      </form>
    </div>
  );
}