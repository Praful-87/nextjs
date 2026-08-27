import {
  InvalidTodoIdError,
  TodoNotFoundError,
} from "@/lib/errors/TodoErrors";

import {
  successResponse,
  errorResponse,
} from "@/lib/apiResponse";

import {
  getTodoById,
  updateTodo,
  patchTodo,
  deleteTodo,
} from "@/lib/services/todoService";

import {
  todoSchema,
  updateTodoSchema,
} from "@/lib/validations/todo";

function handleError(error: unknown) {
  if (error instanceof InvalidTodoIdError) {
    return errorResponse(error.message, 400);
  }

  if (error instanceof TodoNotFoundError) {
    return errorResponse(error.message, 404);
  }

  console.error(error);

  return errorResponse("Internal server error", 500);
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const todo = await getTodoById(id);

    return successResponse(todo);
  } catch (error) {
    return handleError(error);
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
    return handleError(error);
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
      return errorResponse(
        "At least one field is required",
        400,
      );
    }

    const todo = await patchTodo(id, result.data);

    return successResponse(todo);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const todo = await deleteTodo(id);

    return Response.json(
      {
        success: true,
        message: "Todo deleted successfully",
        data: todo,
      },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error);
  }
}