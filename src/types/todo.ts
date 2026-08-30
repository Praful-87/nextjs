export type Todo = {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
};

export type TodoInput = {
  title: string;
  description: string;
  completed?: boolean;
};
