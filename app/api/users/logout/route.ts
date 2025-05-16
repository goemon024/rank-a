// app/api/users/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  try {
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[LOGOUT_ERROR]", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
