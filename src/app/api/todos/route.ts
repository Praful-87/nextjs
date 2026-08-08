import dbConnect from "@/lib/dbConnect";
import Todo from "@/models/Todo";
import { createTodoSchema } from "@/lib/validations/todo";

export async function GET() {
  try {
    await dbConnect();

    const todos = await Todo.find()
      .select("title description completed createdAt")
      .sort({ createdAt: -1 });

    return Response.json(
      {
        success: true,
        data: todos,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();

    const result = createTodoSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: "Invalid todo data",
          errors: result.error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    const todo = await Todo.create(result.data);

    return Response.json(
      {
        success: true,
        data: todo,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}