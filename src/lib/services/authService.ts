import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

export async function registerUser(data: RegisterInput) {
  await dbConnect();

  const existingUser = await User.findOne({
    email: data.email,
  });

  if (existingUser) {
    throw new Error("Email is already registered");
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await User.create({
    name: data.name,
    email: data.email,
    passwordHash,
  });

  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
}

export async function loginUser(data: LoginInput) {
  await dbConnect();

  const user = await User.findOne({
    email: data.email,
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.passwordHash,
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
}

export async function getUserById(userId: string) {
  await dbConnect();

  const user = await User.findById(userId).select("_id name email");

  if (!user) {
    return null;
  }

  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
}
