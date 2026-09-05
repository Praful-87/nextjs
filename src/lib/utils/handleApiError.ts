import {
  InvalidTodoIdError,
  TodoNotFoundError,
  InvalidPaginationError,
} from "@/lib/errors/TodoErrors";

import { UnauthorizedError } from "@/lib/auth/requireAuth";

import { errorResponse } from "@/lib/apiResponse/apiResponse";
import {} from "@/lib/errors/TodoErrors";

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

  if (error instanceof InvalidPaginationError) {
    return errorResponse(error.message, 400);
  }

  return errorResponse("Internal server error", 500);
}
