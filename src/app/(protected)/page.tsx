import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";
import { getTodos } from "@/lib/services/todoService";
import { getCurrentUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import UserMenu from "@/components/UserMenu";

type PageProps = {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
};

export default async function Home({ searchParams }: PageProps) {
  const user = await getCurrentUser();

  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit: number = Number(params.limit) || 10;

  // console.log(user);

  if (!user) {
    redirect("/login");
  }
  const result = await getTodos(user._id, page, limit);

  // console.log(result);

  const formattedTodos = result.todos.map((todo) => ({
    _id: todo._id.toString(),
    title: todo.title,
    description: todo.description,
    completed: todo.completed,
  }));

  return (
    <main className="min-h-screen p-10">
      <UserMenu name={user.name} email={user.email} />
      <div className="mx-auto max-w-2xl space-y-8">
        {/* <h1 className="text-center text-4xl font-bold">Todo App</h1> */}

        <TodoForm mode="create" />

        <TodoList
          todos={formattedTodos}
          currentPage={result.page}
          totalPages={result.totalPages}
          total={result.total}
          active={result.active}
          completed={result.completed}
        />
      </div>
    </main>
  );
}
