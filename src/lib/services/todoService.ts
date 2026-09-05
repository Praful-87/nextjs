import dbConnect from "@/lib/dbConnect";
import Todo from "@/models/Todo";
import mongoose from "mongoose";
import {
  InvalidTodoIdError,
  TodoNotFoundError,
  InvalidPaginationError,
} from "@/lib/errors/TodoErrors";

function validateTodoId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new InvalidTodoIdError();
  }
}

export async function getTodos(
  userId: string,
  page: number = 1,
  limit: number = 10,
  search: string = "",
  status: "all" | "active" | "completed" = "all",
  sort: "newest" | "oldest" = "newest",
) {
  await dbConnect();

  if (!Number.isInteger(page) || page < 1) {
    throw new InvalidPaginationError("Invalid page");
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new InvalidPaginationError("Invalid limit");
  }

  const skip = (page - 1) * limit;

  const filter: {
    userId: string;
    completed?: boolean;
    $or?: Array<
      | {
          title: { $regex: string; $options: string };
        }
      | {
          description: { $regex: string; $options: string };
        }
    >;
  } = {
    userId,
  };

  if (status === "active") {
    filter.completed = false;
  }

  if (status === "completed") {
    filter.completed = true;
  }

  if (search.trim()) {
    const searchRegex = search.trim();

    filter.$or = [
      { title: { $regex: searchRegex, $options: "i" } },
      { description: { $regex: searchRegex, $options: "i" } },
    ];
  }

  const [todos, total, active, completed] = await Promise.all([
    Todo.find(filter)
      .select("title description completed createdAt")
      .sort({ createdAt: sort === "newest" ? -1 : 1 })
      .skip(skip)
      .limit(limit),

    Todo.countDocuments(filter),

    Todo.countDocuments({
      userId,
      completed: false,
    }),

    Todo.countDocuments({
      userId,
      completed: true,
    }),
  ]);

  return {
    todos,
    total,
    active,
    completed,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function createTodo(
  userId: string,
  data: {
    title: string;
    description: string;
  },
) {
  await dbConnect();

  return Todo.create({
    ...data,
    userId,
  });
}

export async function getTodoById(id: string, userId: string) {
  validateTodoId(id);

  await dbConnect();

  const todo = await Todo.findOne({
    _id: id,
    userId,
  });

  if (!todo) {
    throw new TodoNotFoundError();
  }

  return todo;
}

export async function updateTodo(
  id: string,
  userId: string,
  data: {
    title?: string;
    description?: string;
    completed?: boolean;
  },
) {
  validateTodoId(id);

  await dbConnect();

  const todo = await Todo.findOneAndUpdate(
    {
      _id: id,
      userId,
    },
    data,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!todo) {
    throw new TodoNotFoundError();
  }

  return todo;
}

export async function deleteTodo(id: string, userId: string) {
  validateTodoId(id);

  await dbConnect();

  const todo = await Todo.findOneAndDelete({
    _id: id,
    userId,
  });

  if (!todo) {
    throw new TodoNotFoundError();
  }

  return todo;
}
