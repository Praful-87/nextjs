"use client";

import { useState } from "react";

export default function TodoForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  console.log({ title, description });
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      const result = await response.json();
      console.log(result);
      if (response.ok) {
        setTitle("");
        setDescription("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="rounded-lg p-6 shadow">
      <h2 className="mb-4 text-2xl font-semibold">Add Todo</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
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

        <button disabled={isLoading} className="rounded bg-blue-600 px-5 py-2 ">
          {isLoading ? "Adding..." : "Add Todo"}
        </button>
      </form>
    </div>
  );
}
