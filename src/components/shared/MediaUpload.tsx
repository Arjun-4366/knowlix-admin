"use client";

import { useRef, useState, useEffect } from "react";
import { Upload, X, FileVideo, ImageIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Ratio = "square" | "video" | "4/3" | "portrait";

interface Props {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  ratio?: Ratio;
  className?: string;
  accept?: "image/*" | "video/*" | "image/*,video/*";
}

const ratioStyle: Record<Ratio, string> = {
  square: "aspect-square",
  video: "aspect-video",
  "4/3": "aspect-[4/3]",
  portrait: "aspect-[3/4]",
};

export default function MediaUpload({
  label,
  value = "",
  onChange,
  ratio = "video",
  className = "",
  accept = "image/*,video/*",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(value);
  const [isVideo, setIsVideo] = useState(false);

  useEffect(() => {
    setPreview(value);
    setIsVideo(value.match(/\.(mp4|webm|ogg)$/i) !== null || value.includes("video"));
  }, [value]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setIsVideo(file.type.startsWith("video/"));
    onChange(url);
  };

  const handleUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPreview(val);
    setIsVideo(val.match(/\.(mp4|webm|ogg)$/i) !== null || val.includes("video"));
    onChange(val);
  };

  const clear = () => {
    setPreview("");
    onChange("");
    setIsVideo(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label>{label}</Label>}

      {/* Preview / drop zone */}
      <div
        className={`relative ${ratioStyle[ratio]} rounded-xl border-2 border-dashed border-gray-200 overflow-hidden bg-gray-50 group`}
        style={{ cursor: preview ? "default" : "pointer" }}
        onClick={() => {
          if (!preview) inputRef.current?.click();
        }}
      >
        {preview ? (
          <>
            {isVideo ? (
              <video src={preview} controls className="w-full h-full object-cover" />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            )}
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none group-hover:pointer-events-auto">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-800 text-xs font-semibold rounded-lg hover:bg-gray-100 transition-colors pointer-events-auto"
              >
                <Upload className="w-3.5 h-3.5" /> Change
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clear();
                }}
                className="p-1.5 bg-white text-red-500 rounded-lg hover:bg-red-50 transition-colors pointer-events-auto"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-gray-600 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              {accept.includes("video") ? <FileVideo className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold">Click to upload</p>
              <p className="text-xs text-gray-400 mt-0.5">Images or Videos — up to 50 MB</p>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input ref={inputRef} type="file" accept={accept} onChange={handleFile} className="hidden" />

      {/* URL input + upload button */}
      <div className="flex gap-2">
        <Input
          value={preview.startsWith("blob:") ? "" : preview}
          onChange={handleUrl}
          placeholder="Or paste media URL…"
          className="text-xs h-8"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 h-8 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
        >
          <Upload className="w-3.5 h-3.5" /> Upload file
        </button>
      </div>
    </div>
  );
}
