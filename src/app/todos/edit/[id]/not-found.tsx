import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center p-10">
      {" "}
      <div className="max-w-md text-center">
        {" "}
        <h1 className="text-6xl font-bold">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">Todo not found</h2>
        <p className="mt-2 text-gray-600">
          The Todo you are looking for does not exist or may have been deleted.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded bg-blue-600 px-5 py-2 text-white"
        >
          Back to Todos
        </Link>
      </div>
    </main>
  );
}
