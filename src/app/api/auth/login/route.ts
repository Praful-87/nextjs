import { successResponse, errorResponse } from "@/lib/apiResponse/apiResponse";

import { loginSchema } from "@/lib/validations/auth";
import { loginUser } from "@/lib/services/authService";
import { createSessionToken } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    let body;

    try {
      body = await request.json();
    } catch {
      return errorResponse("Invalid JSON body", 400);
    }

    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return errorResponse(
        "Invalid login data",
        400,
        result.error.flatten().fieldErrors,
      );
    }

    try {
      const user = await loginUser(result.data);

      const token = await createSessionToken({
        userId: user._id,
        email: user.email,
      });

      const response = successResponse(user);

      response.headers.set(
        "Set-Cookie",
        [
          `session=${token}`,
          "HttpOnly",
          "Path=/",
          "SameSite=Lax",
          process.env.NODE_ENV === "production" ? "Secure" : "",
          "Max-Age=604800",
        ]
          .filter(Boolean)
          .join("; "),
      );

      return response;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Invalid email or password"
      ) {
        return errorResponse(error.message, 401);
      }

      throw error;
    }
  } catch (error) {
    console.error(error);

    return errorResponse("Internal server error", 500);
  }
}
