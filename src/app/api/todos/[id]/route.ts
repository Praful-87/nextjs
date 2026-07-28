import dbConnect from "@/lib/dbConnect";
import Todo from "@/models/Todo";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        {
          success: false,
          message: "Invalid Todo ID",
        },
        {
          status: 400,
        },
      );
    }
    const todo = await Todo.findById({ _id: id }).select(
      "title description completed createdAt",
    );
    if (!todo) {
      return Response.json(
        {
          success: false,
          message: "Todo not found",
        },
        {
          status: 404,
        },
      );
    }
    return Response.json(
      {
        success: true,
        data: todo,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
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

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        {
          success: false,
          message: "Invalid Todo id",
        },
        {
          status: 400,
        },
      );
    }

    const body = await request.json();

    const { title, description, completed } = body;
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

    if (typeof title !== "string" || title.trim() === "") {
      return Response.json(
        {
          success: false,
          message: "Title must be non empty string",
        },
        {
          status: 400,
        },
      );
    }
    if (typeof description !== "string" || description.trim() === "") {
      return Response.json(
        {
          success: false,
          message: "Description must be non empty string",
        },
        {
          status: 400,
        },
      );
    }
    if (typeof completed !== "boolean") {
      return Response.json(
        {
          success: false,
          message: "completed must be non empty and boolean",
        },
        {
          status: 400,
        },
      );
    }

    const updateTodo = await Todo.findByIdAndUpdate(
      id,
      {
        title,
        description,
        completed,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updateTodo) {
      return Response.json(
        {
          success: false,
          message: "Todo not found",
        },
        {
          status: 404,
        },
      );
    }

    return Response.json(
      {
        success: true,
        data: updateTodo,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Internal server Error",
      },
      {
        status: 500,
      },
    );
  }
}
