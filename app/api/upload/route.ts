import { NextRequest, NextResponse } from "next/server";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import { checkRateLimit } from "@/lib/utils/rateLimit";
import { isAllowedOrigin } from "@/lib/utils/cors";
import { verifySession } from "@/lib/auth/verify";
import { uploadFile, deleteFile } from "@/lib/imagekit/client";
import { deleteFileSchema } from "@/lib/utils/validators";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "video/mp4",
  "application/pdf",
];

const MAX_SIZES: Record<string, number> = {
  image: 10 * 1024 * 1024,
  video: 100 * 1024 * 1024,
  application: 5 * 1024 * 1024,
};

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9.\-]/g, "-").replace(/-+/g, "-");
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const rateLimitResult = await checkRateLimit(request, "public");
    if (!rateLimitResult.success) return errorResponse("Too many requests", 429);
    if (!isAllowedOrigin(request)) return errorResponse("Forbidden", 403);

    const session = await verifySession(request);
    if (!session.valid) return errorResponse("Unauthorized", 401);

    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder");

    if (!(file instanceof File) || typeof folder !== "string" || folder.length === 0) {
      return errorResponse("Validation failed: file and folder are required", 400);
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return errorResponse("Validation failed: unsupported file type", 400);
    }

    const category = file.type.split("/")[0];
    const maxSize = MAX_SIZES[category] ?? MAX_SIZES.application;
    if (file.size > maxSize) {
      return errorResponse("Validation failed: file exceeds maximum size", 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const safeName = sanitizeFilename(file.name);

    const result = await uploadFile(buffer, safeName, folder);
    return successResponse(result);
  } catch (error) {
    console.error("[POST /api/upload]", error);
    return errorResponse("Upload failed. Please try again.", 500);
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const rateLimitResult = await checkRateLimit(request, "public");
    if (!rateLimitResult.success) return errorResponse("Too many requests", 429);
    if (!isAllowedOrigin(request)) return errorResponse("Forbidden", 403);

    const session = await verifySession(request);
    if (!session.valid) return errorResponse("Unauthorized", 401);

    const body: unknown = await request.json();
    const result = deleteFileSchema.safeParse(body);
    if (!result.success) {
      return errorResponse(`Validation failed: ${result.error.errors[0].message}`, 400);
    }

    await deleteFile(result.data.fileId);
    return successResponse({ success: true });
  } catch (error) {
    console.error("[DELETE /api/upload]", error);
    return errorResponse("Delete failed. Please try again.", 500);
  }
}
