export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Todo Not Found</h1>

      <p className="text-gray-600">
        The todo you are looking for does not exist.
      </p>
    </main>
  );
}
