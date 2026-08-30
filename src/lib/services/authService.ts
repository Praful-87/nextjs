import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

type RegisterInput = {
  name: string;
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
