"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  current?: string;
}

export function ImageUpload({ onUpload, current }: ImageUploadProps) {
  const t = useTranslations("submit");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(current ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError("");
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      setError("Only PNG, JPG, JPEG allowed");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Max file size is 10MB");
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setPreview(data.url);
      onUpload(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">{t("upload_label")}</label>

      {preview ? (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
          <Image src={preview} alt="Evidence" fill className="object-contain" />
          <button
            type="button"
            onClick={() => { setPreview(""); onUpload(""); }}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <svg className="animate-spin h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-sm text-gray-500">Uploading...</span>
            </div>
          ) : (
            <>
              <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm text-gray-500">{t("upload_click")}</p>
              <p className="text-xs text-gray-400 mt-1">{t("upload_hint")}</p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
