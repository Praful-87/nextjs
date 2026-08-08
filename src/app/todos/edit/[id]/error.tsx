"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-semibold">
        Something went wrong!
      </h2>

      <button
        onClick={() => reset()}
        className="cursor-pointer rounded bg-blue-600 px-5 py-2 text-white"
      >
        Try again
      </button>
    </div>
  );
}