import dbConnect from "@/lib/dbConnect";
import Todo from "@/models/Todo";

export async function GET() {
  try {
    await dbConnect();

    const todos = await Todo.find({completed: false,}).sort({ createdAt: -1 }).select("title description completed createdAt");

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
    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
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

    const { title, description } = body;

    if (!title) {
      return Response.json(
        {
          success: false,
          message: "Title is required",
        },
        {
          status: 400,
        },
      );
    }

    const todo = await Todo.create({
      title,
      description,
    });

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
    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
