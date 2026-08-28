"use client";

import { deleteTodo } from "@/lib/api/todos";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Todo = {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
};

type TodoListProps = {
  todos: Todo[];
};

export default function TodoList({ todos }: TodoListProps) {
  const router = useRouter();

  async function handleDelete(id: string) {
    try {
      const response = await deleteTodo(id);

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    }
  }

  if (todos.length === 0) {
    return <p>No Todos yet.</p>;
  }

  return (
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
              className="flex h-10 w-18 cursor-pointer items-center justify-center rounded bg-blue-400"
            >
              Edit
            </Link>

            <button
              className="h-10 w-18 cursor-pointer rounded bg-red-600 px-3 py-2 text-white"
              onClick={() => handleDelete(todo._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
