"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser, loginUser, AuthApiError } from "@/lib/api/auth";

type AuthFormProps = {
  mode: "login" | "register";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isRegister = mode === "register";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      if (isRegister) {
        await registerUser({
          name,
          email,
          password,
        });
      } else {
        await loginUser({
          email,
          password,
        });
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      if (error instanceof AuthApiError) {
        setError(error.message);
      } else {
        setError(
          error instanceof Error ? error.message : "Something went wrong",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-lg border p-6"
    >
      <h1 className="text-2xl font-bold">
        {isRegister ? "Create account" : "Welcome back"}
      </h1>

      {error && <p className="rounded bg-red-100 p-3 text-red-600">{error}</p>}

      {isRegister && (
        <div className="flex flex-col gap-1">
          <label htmlFor="name">Name</label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="rounded border p-2"
          />
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="email">Email</label>

        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded border p-2"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password">Password</label>

        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded border p-2"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="rounded bg-blue-600 p-2 text-white disabled:opacity-50"
      >
        {isLoading ? "Please wait..." : isRegister ? "Create account" : "Login"}
      </button>
    </form>
  );
}
