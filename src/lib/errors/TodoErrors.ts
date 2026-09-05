export class InvalidTodoIdError extends Error {
  constructor() {
    super("Invalid Todo ID");
    this.name = "InvalidTodoIdError";
  }
}

export class TodoNotFoundError extends Error {
  constructor() {
    super("Todo not found");
    this.name = "TodoNotFoundError";
  }
}

export class InvalidPaginationError extends Error {
  constructor(message = "Invalid pagination parameter") {
    super(message);
    this.name = "InvalidPaginationError";
  }
}
