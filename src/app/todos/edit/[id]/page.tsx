import { notFound } from "next/navigation";
import TodoForm from "@/components/TodoForm";
import { getTodoById } from "@/lib/services/todoService";
import { InvalidTodoIdError, TodoNotFoundError } from "@/lib/errors/TodoErrors";
import { getCurrentUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditTodoPage({ params }: PageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }
  const { id } = await params;

  try {
    const todo = await getTodoById(id,user._id);

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
  } catch (error) {
    if (
      error instanceof InvalidTodoIdError ||
      error instanceof TodoNotFoundError
    ) {
      notFound();
    }
  }
}
