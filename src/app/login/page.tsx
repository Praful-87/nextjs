import AuthForm from "@/components/AuthForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="p-6">
      <AuthForm mode="login" />

      <p className="mt-4 text-center">
        Don't have an account?{" "}
        <Link href="/register" className="text-blue-600 underline">
          Create one
        </Link>
      </p>
    </main>
  );
}
