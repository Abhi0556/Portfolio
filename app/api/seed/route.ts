import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import { seedSchema } from "@/lib/utils/validators";
import { getDb } from "@/lib/db/client";
import { getAdminUserByEmail, createAdminUser } from "@/lib/db/admin-user";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    if (process.env.SEED_ENABLED !== "true") {
      return errorResponse("Seed route is disabled", 403);
    }

    const body: unknown = await request.json();
    const result = seedSchema.safeParse(body);
    if (!result.success) {
      return errorResponse(`Validation failed: ${result.error.errors[0].message}`, 400);
    }
    const { seedKey, email, password } = result.data;

    if (seedKey !== process.env.SEED_SECRET_KEY) {
      return errorResponse("Invalid credentials", 401);
    }

    const db = getDb();
    const existing = await getAdminUserByEmail(db, email);
    if (existing) {
      return errorResponse("Admin user already exists", 400);
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await createAdminUser(db, { email, passwordHash });

    return successResponse({ success: true }, 201);
  } catch (error) {
    console.error("[POST /api/seed]", error);
    return errorResponse("Seed failed", 500);
  }
}
