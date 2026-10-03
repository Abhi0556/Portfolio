// components/admin/ImageUploader.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageUploaderProps {
  currentUrl: string;
  folder: string;
  accept: string;
  onUploaded: (url: string) => void;
}

export function ImageUploader({
  currentUrl, folder, accept, onUploaded,
}: ImageUploaderProps): React.ReactElement {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPdf = accept.includes("pdf");

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/upload", { method: "POST", body: formData });
      const json = (await response.json()) as { data: { url: string } | null; error: string | null };

      if (json.error || !json.data) {
        setError(json.error ?? "Upload failed.");
        return;
      }
      onUploaded(json.data.url);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {currentUrl &&
        (isPdf ? (
          <a href={currentUrl} target="_blank" rel="noreferrer" className="text-body-sm text-accent-primary">
            View current file
          </a>
        ) : (
          <Image
            src={currentUrl}
            alt="Current upload"
            width={80}
            height={80}
            className="h-20 w-20 rounded-md object-cover"
          />
        ))}
      <input
        type="file"
        accept={accept}
        onChange={(e) => void handleFileChange(e)}
        disabled={isUploading}
        className="text-body-sm text-text-secondary"
      />
      {isUploading && <p className="text-body-xs text-text-tertiary">Uploading...</p>}
      {error && <p className="text-body-xs text-error">{error}</p>}
    </div>
  );
}
