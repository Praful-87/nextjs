import { successResponse, errorResponse } from "@/lib/apiResponse/apiResponse";

import { registerSchema } from "@/lib/validations/auth";
import { registerUser } from "@/lib/services/authService";

export async function POST(request: Request) {
  try {
    let body;

    try {
      body = await request.json();
    } catch {
      return errorResponse("Invalid JSON body", 400);
    }

    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return errorResponse(
        "Invalid registration data",
        400,
        result.error.flatten().fieldErrors,
      );
    }

    try {
      const user = await registerUser(result.data);

      return successResponse(user, 201);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Email is already registered"
      ) {
        return errorResponse(error.message, 409);
      }

      throw error;
    }
  } catch (error) {
    console.error(error);

    return errorResponse("Internal server error", 500);
  }
}
