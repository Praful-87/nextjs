import { notFound } from "next/navigation";
import TodoForm from "@/components/TodoForm";
import dbConnect from "@/lib/dbConnect";
import Todo from "@/models/Todo";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditTodoPage({
  params,
}: PageProps) {
  const { id } = await params;

  await dbConnect();

  const todo = await Todo.findById(id).lean();

  if (!todo) {
    notFound();
  }

  return (
    <main className="min-h-screen p-10">
      <div className="mx-auto max-w-2xl">
        <TodoForm
          mode="edit"
          todo={{
            _id: todo._id.toString(),
            title: todo.title,
            description: todo.description,
            completed: todo.completed,
          }}
        />
      </div>
    </main>
  );
}