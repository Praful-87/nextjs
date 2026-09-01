import { successResponse } from "@/lib/apiResponse/apiResponse";

export async function POST() {
  const response = successResponse({
    message: "Logged out successfully",
  });

  response.headers.set(
    "Set-Cookie",
    "session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0",
  );

  return response;
}
