"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/api/auth";

type UserMenuProps = {
  name: string;
  email: string;
};

export default function UserMenu({ name, email }: UserMenuProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);

    try {
      await logoutUser();

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  return (
    <div className="mb-6 flex items-center justify-between rounded-lg border p-4">
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-gray-500">{email}</p>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoading}
        className="rounded bg-red-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {isLoading ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}
