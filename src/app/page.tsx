import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";
import dbConnect from "@/lib/dbConnect";
import Todo from "@/models/Todo";

export default async function Home() {
  await dbConnect();

  const todos = await Todo.find()
    .select("title description completed createdAt")
    .sort({ createdAt: -1 })
    .lean();

  const formattedTodos = todos.map((todo) => ({
    _id: todo._id.toString(),
    title: todo.title,
    description: todo.description,
    completed: todo.completed,
  }));

  return (
    <main className="min-h-screen p-10">
      <div className="mx-auto max-w-2xl space-y-8">
        <h1 className="text-center text-4xl font-bold">
          Todo App
        </h1>

        <TodoForm mode="create" />

        <TodoList todos={formattedTodos} />
      </div>
    </main>
  );
}