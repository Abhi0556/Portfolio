import { NextRequest, NextResponse } from "next/server";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import { verifySession } from "@/lib/auth/verify";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await verifySession(request);
    if (!session.valid) return errorResponse("Unauthorized", 401);
    return successResponse({ authenticated: true });
  } catch (error) {
    console.error("[GET /api/auth/verify]", error);
    return errorResponse("Verification failed", 500);
  }
}
