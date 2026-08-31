import dbConnect from "@/lib/dbConnect";
import Todo from "@/models/Todo";
import mongoose from "mongoose";
import { InvalidTodoIdError, TodoNotFoundError } from "@/lib/errors/TodoErrors";

function validateTodoId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new InvalidTodoIdError();
  }
}

export async function getTodos(userId: string) {
  await dbConnect();

  return Todo.find({ userId })
    .select("title description completed createdAt")
    .sort({ createdAt: -1 });
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
