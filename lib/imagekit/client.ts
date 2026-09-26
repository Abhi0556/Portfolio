// lib/imagekit/client.ts
// Server-side only — reads IMAGEKIT_PRIVATE_KEY (never expose to the browser).
// Called from /api/upload/route.ts in Phase 2; not called from anywhere yet.

import ImageKit, { toFile } from "@imagekit/nodejs";

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
});

// Resolved from the installed SDK's own return type rather than re-declared
// here, so this file cannot drift from @imagekit/nodejs if the SDK changes.
type UploadApiResponse = Awaited<ReturnType<typeof imagekit.files.upload>>;

export interface UploadResult {
  url: string;
  fileId: string;
  name: string;
}

export async function uploadFile(
  file: Buffer,
  fileName: string,
  folder: string
): Promise<UploadResult> {
  let result: UploadApiResponse;

  try {
    // FileUploadParams.file accepts Uploadable | string, and Uploadable does
    // not include Buffer — toFile() converts it, and accepts ArrayBufferView.
    const uploadable = await toFile(file, fileName);
    result = await imagekit.files.upload({
      file: uploadable,
      fileName,
      folder,
    });
  } catch (error) {
    console.error("[ImageKit uploadFile]", error);
    throw new Error("Failed to upload file to ImageKit");
  }

  // Every field on the SDK's FileUploadResponse is optional, so a response
  // missing these would silently produce undefined fields for callers.
  const { url, fileId, name } = result;
  if (!url || !fileId || !name) {
    console.error("[ImageKit uploadFile] Response missing url, fileId or name");
    throw new Error("ImageKit upload response was incomplete");
  }

  return { url, fileId, name };
}

export async function deleteFile(fileId: string): Promise<void> {
  try {
    await imagekit.files.delete(fileId);
  } catch (error) {
    console.error("[ImageKit deleteFile]", error);
    throw new Error("Failed to delete file from ImageKit");
  }
}

