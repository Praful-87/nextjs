import { successResponse, errorResponse } from "@/lib/apiResponse/apiResponse";
import { requireAuth } from "@/lib/auth/requireAuth";

import { createTodoSchema } from "@/lib/validations/todo";

import { getTodos, createTodo } from "@/lib/services/todoService";

import { handleApiError } from "@/lib/utils/handleApiError";

export async function GET() {
  try {
    const user = await requireAuth();

    const todos = await getTodos(user.userId);

    return successResponse(todos);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();

    let body;

    try {
      body = await request.json();
    } catch {
      return errorResponse("Invalid JSON body", 400);
    }

    const result = createTodoSchema.safeParse(body);

    if (!result.success) {
      return errorResponse(
        "Invalid todo data",
        400,
        result.error.flatten().fieldErrors,
      );
    }

    const todo = await createTodo(user.userId, result.data);

    return successResponse(todo, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
