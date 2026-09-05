import { redis } from "@/lib/redis";

export async function GET() {
  await redis.set("test", "Hello Redis");

  const value = await redis.get<string>("test");

  return Response.json({
    value,
  });
}
