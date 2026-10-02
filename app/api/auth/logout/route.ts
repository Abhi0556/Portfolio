import { NextRequest, NextResponse } from "next/server";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import { verifySession } from "@/lib/auth/verify";
import { getDb } from "@/lib/db/client";
import { updateAdminUserSession } from "@/lib/db/admin-user";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await verifySession(request);
    if (!session.valid) return errorResponse("Unauthorized", 401);

    const db = getDb();
    await updateAdminUserSession(db, 1, { sessionToken: null, sessionExpiresAt: null });

    const response = successResponse({ success: true });
    response.cookies.delete({ name: SESSION_COOKIE_NAME, path: "/" });
    return response;
  } catch (error) {
    console.error("[POST /api/auth/logout]", error);
    return errorResponse("Logout failed. Please try again.", 500);
  }
}
