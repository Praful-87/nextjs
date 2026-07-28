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
    const todo = await Todo.findById({_id: id,}).select("title description completed createdAt");
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
