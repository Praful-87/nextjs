import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";
import { getTodos } from "@/lib/services/todoService";
import { getCurrentUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
export default async function Home() {
  const user = await getCurrentUser();

  // console.log(user);

  if (!user) {
    redirect("/login");
  }
  const todos = await getTodos(user.userId);

  const formattedTodos = todos.map((todo) => ({
    _id: todo._id.toString(),
    title: todo.title,
    description: todo.description,
    completed: todo.completed,
  }));

  return (
    <main className="min-h-screen p-10">
      <div className="mx-auto max-w-2xl space-y-8">
        <h1 className="text-center text-4xl font-bold">Todo App</h1>

        <TodoForm mode="create" />

        <TodoList todos={formattedTodos} />
      </div>
    </main>
  );
}
