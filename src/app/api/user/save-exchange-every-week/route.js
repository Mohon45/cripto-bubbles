import connectToDatabase from "@/lib/db/connectDB";
import { fetchAndProcessExchangeData } from "@/utils/tasks";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    await fetchAndProcessExchangeData();

    return NextResponse.json({ message: "Data added successfully!" });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      {
        status: 500,
      }
    );
  }
}
