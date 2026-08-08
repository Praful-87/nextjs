import Link from "next/link";

type Todo = {
  _id: string;
  title: string;
  description: string;
};

type TodoListProps = {
  todos: Todo[];
  fetchTodos: () => Promise<void>;
};

export default function TodoList({ todos, fetchTodos }: TodoListProps) {
  async function deleteTodo(id: string) {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchTodos();
      }
    } catch (error) {
      console.error(error);
    }
  }
  if (todos.length === 0) {
    return <p className="text-center text-gray-500">No todos yet.</p>;
  }
  return (
    <div className="space-y-4 p-6 h-60 overflow-y-auto">
      {todos.map((todo) => (
        <div key={todo._id} className="rounded border p-4 flex justify-between">
          <div>
            <h2 className="font-bold">{todo.title}</h2>

            <p>{todo.description}</p>
          </div>
          <div className="flex gap-2 flex-col">
            <Link href={`/todos/edit/${todo._id}`} className="text-md cursor-pointer bg-blue-400 rounded h-10 w-18 flex justify-center items-center">Edit</Link>
            <button
              className="rounded bg-red-600 px-3 py-2 text-white cursor-pointer h-10 w-18"
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
