import connectToDatabase from "@/lib/db/connectDB";
import { fetchYearlyDataEvery5Minutes } from "@/utils/tasks";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    await fetchYearlyDataEvery5Minutes();

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
