import { successResponse, errorResponse } from "@/lib/apiResponse/apiResponse";
import { requireAuth } from "@/lib/auth/requireAuth";

import {
  getTodoById,
  updateTodo,
  deleteTodo,
} from "@/lib/services/todoService";

import { updateTodoSchema } from "@/lib/validations/todo";

import { handleApiError } from "@/lib/utils/handleApiError";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const user = await requireAuth();

    const todo = await getTodoById(id, user._id);

    return successResponse(todo);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    let body;

    try {
      body = await request.json();
    } catch {
      return errorResponse("Invalid JSON body", 400);
    }

    const result = updateTodoSchema.safeParse(body);

    if (!result.success) {
      return errorResponse(
        "Invalid todo data",
        400,
        result.error.flatten().fieldErrors,
      );
    }

    if (Object.keys(result.data).length === 0) {
      return errorResponse("At least one field is required", 400);
    }

    const user = await requireAuth();
    const todo = await updateTodo(id, user._id, result.data);

    return successResponse(todo);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const user = await requireAuth();

    const todo = await deleteTodo(id, user._id);

    return successResponse(todo);
  } catch (error) {
    return handleApiError(error);
  }
}
