import { successResponse, errorResponse } from "@/lib/apiResponse/apiResponse";

import {
  getTodoById,
  updateTodo,
  patchTodo,
  deleteTodo,
} from "@/lib/services/todoService";

import { todoSchema, updateTodoSchema } from "@/lib/validations/todo";

import { handleApiError } from "@/lib/utils/handleApiError";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const todo = await getTodoById(id);

    return successResponse(todo);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
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

    const result = todoSchema.safeParse(body);

    if (!result.success) {
      return errorResponse(
        "Invalid todo data",
        400,
        result.error.flatten().fieldErrors,
      );
    }

    const todo = await updateTodo(id, result.data);

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

    const todo = await patchTodo(id, result.data);

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
    const todo = await deleteTodo(id);
    return successResponse(todo, 200);
  } catch (error) {
    return handleApiError(error);
  }
}
