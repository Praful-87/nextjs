"use client";
import { useEffect, useState } from "react";

import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";

type Todo = {
  _id: string;
  title: string;
  description: string;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  async function fetchTodos() {
    const response = await fetch("/api/todos");
    const result = await response.json();
    console.log(result.data);
  }
  useEffect(function () {
    fetchTodos();
  }, []);

  return (
    <main className="min-h-screen p-10">
      <div className="mx-auto max-w-2xl space-y-8">
        <h1 className="text-center text-4xl font-bold">Todo App</h1>
        <TodoForm />
        <TodoList />
      </div>
    </main>
  );
}
