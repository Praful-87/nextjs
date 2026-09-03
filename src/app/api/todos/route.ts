import { successResponse, errorResponse } from "@/lib/apiResponse/apiResponse";
import { requireAuth } from "@/lib/auth/requireAuth";

import { createTodoSchema } from "@/lib/validations/todo";

import { getTodos, createTodo } from "@/lib/services/todoService";

import { handleApiError } from "@/lib/utils/handleApiError";

export async function GET(request: Request) {
  try {
    const user = await requireAuth();

    const todos = await getTodos(user._id);
    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
    const page = pageParam ? Number(pageParam) : 1;
    const limit = limitParam ? Number(limitParam) : 10;

    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 100
    ) {
      return errorResponse("Invalid pagination parameters", 400);
    }

    const result = await getTodos(user._id, page, limit);

    return successResponse(result);
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

    const todo = await createTodo(user._id, result.data);

    return successResponse(todo, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
