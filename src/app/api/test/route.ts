import dbConnect from "@/lib/dbConnect";

export async function GET() {
  await dbConnect();

  return Response.json({
    message: "Database Connected Successfully",
  });
}
