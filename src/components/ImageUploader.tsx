"use client";

import React, { useRef, useState } from "react";

interface ImageUploaderProps {
  onImageUpload: (base64: string, file: File) => void;
  label?: string;
}

export function ImageUploader({ onImageUpload, label = "Upload a photo" }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        onImageUpload(base64String, file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div 
      className="file-uploader" 
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg, image/png, image/jpg"
        style={{ display: "none" }}
      />
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img 
          src={preview} 
          alt="Preview" 
          style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "12px", objectFit: "contain" }} 
        />
      ) : (
        <>
          <div className="file-uploader-icon">📸</div>
          <p style={{ fontWeight: 600 }}>{label}</p>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Drag & drop or click to browse</p>
        </>
      )}
    </div>
  );
}
