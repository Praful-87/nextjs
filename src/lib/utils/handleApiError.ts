import { InvalidTodoIdError, TodoNotFoundError } from "@/lib/errors/TodoErrors";

import { UnauthorizedError } from "@/lib/auth/requireAuth";

import { errorResponse } from "@/lib/apiResponse/apiResponse";

export function handleApiError(error: unknown) {
  if (error instanceof UnauthorizedError) {
    return errorResponse(error.message, 401);
  }

  if (error instanceof InvalidTodoIdError) {
    return errorResponse(error.message, 400);
  }

  if (error instanceof TodoNotFoundError) {
    return errorResponse(error.message, 404);
  }

  console.error(error);

  return errorResponse("Internal server error", 500);
}
