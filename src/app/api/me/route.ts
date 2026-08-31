import { successResponse, errorResponse } from "@/lib/apiResponse/apiResponse";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return errorResponse("Unauthorized", 401);
  }

  return successResponse(user);
}
