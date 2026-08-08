"use client";

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

  async function deleteTodo(id: string) {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (todos.length === 0) {
    return <p>No Todos yet.</p>;
  }

  return (
    <div className="space-y-4 p-6 overflow-y-auto h-50">
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
              onClick={() => deleteTodo(todo._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
