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

    const todo = await Todo.findById(id).select(
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
          message: "Invalid Todo ID",
        },
        {
          status: 400,
        },
      );
    }

    const body = await request.json();

    const { title, description, completed } = body;

    if (
      typeof title !== "string" ||
      title.trim() === ""
    ) {
      return Response.json(
        {
          success: false,
          message: "Title must be a non-empty string",
        },
        {
          status: 400,
        },
      );
    }

    if (typeof description !== "string") {
      return Response.json(
        {
          success: false,
          message: "Description must be a string",
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
          message: "Completed must be a boolean",
        },
        {
          status: 400,
        },
      );
    }

    const updateTodo = await Todo.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        description: description.trim(),
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

export async function PATCH(
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

    const body = await request.json();

    const allowedFields = [
      "title",
      "description",
      "completed",
    ];

    const bodyKeys = Object.keys(body);

    if (bodyKeys.length === 0) {
      return Response.json(
        {
          success: false,
          message: "At least one field is required",
        },
        {
          status: 400,
        },
      );
    }

    const hasInvalidField = bodyKeys.some(
      (key) => !allowedFields.includes(key),
    );

    if (hasInvalidField) {
      return Response.json(
        {
          success: false,
          message: "Invalid field in request",
        },
        {
          status: 400,
        },
      );
    }

    const updateData: {
      title?: string;
      description?: string;
      completed?: boolean;
    } = {};

    if ("title" in body) {
      if (
        typeof body.title !== "string" ||
        body.title.trim() === ""
      ) {
        return Response.json(
          {
            success: false,
            message: "Title must be a non-empty string",
          },
          {
            status: 400,
          },
        );
      }

      updateData.title = body.title.trim();
    }

    if ("description" in body) {
      if (typeof body.description !== "string") {
        return Response.json(
          {
            success: false,
            message: "Description must be a string",
          },
          {
            status: 400,
          },
        );
      }

      updateData.description = body.description.trim();
    }

    if ("completed" in body) {
      if (typeof body.completed !== "boolean") {
        return Response.json(
          {
            success: false,
            message: "Completed must be a boolean",
          },
          {
            status: 400,
          },
        );
      }

      updateData.completed = body.completed;
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedTodo) {
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
        data: updatedTodo,
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

export async function DELETE(
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

    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
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
        message: "Todo deleted successfully",
        data: deletedTodo,
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