import dbConnect from "@/lib/dbConnect";
import Todo from "@/models/Todo";
import mongoose from "mongoose";
import { InvalidTodoIdError, TodoNotFoundError } from "@/lib/errors/TodoErrors";

function validateTodoId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new InvalidTodoIdError();
  }
}

export async function getTodoById(id: string) {
  validateTodoId(id);

  await dbConnect();

  const todo = await Todo.findById(id).select(
    "title description completed createdAt",
  );

  if (!todo) {
    throw new TodoNotFoundError();
  }

  return todo;
}

export async function updateTodo(
  id: string,
  data: {
    title: string;
    description: string;
    completed: boolean;
  },
) {
  validateTodoId(id);

  await dbConnect();

  const todo = await Todo.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!todo) {
    throw new TodoNotFoundError();
  }

  return todo;
}

export async function patchTodo(
  id: string,
  data: {
    title?: string;
    description?: string;
    completed?: boolean;
  },
) {
  validateTodoId(id);

  await dbConnect();

  const todo = await Todo.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!todo) {
    throw new TodoNotFoundError();
  }

  return todo;
}

export async function deleteTodo(id: string) {
  validateTodoId(id);

  await dbConnect();

  const todo = await Todo.findByIdAndDelete(id);

  if (!todo) {
    throw new TodoNotFoundError();
  }

  return todo;
}
