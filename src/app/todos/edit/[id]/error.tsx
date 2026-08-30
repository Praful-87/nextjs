"use client";

import { useEffect } from "react";

type ErrorPageProps = {
error: Error & { digest?: string };
reset: () => void;
};

export default function ErrorPage({
error,
reset,
}: ErrorPageProps) {
useEffect(() => {
console.error(error);
}, [error]);

return ( <main className="flex min-h-screen items-center justify-center p-10"> <div className="max-w-md text-center"> <h1 className="text-3xl font-bold">
Something went wrong </h1>

    <p className="mt-3 text-gray-600">
      An unexpected error occurred while loading this page.
    </p>

    <button
      onClick={() => reset()}
      className="mt-6 cursor-pointer rounded bg-blue-600 px-5 py-2 text-white"
    >
      Try again
    </button>
  </div>
</main>

);
}
