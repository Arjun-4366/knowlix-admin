"use client";

import { Loader2 } from "lucide-react";

interface LoaderProps {
  className?: string;
  size?: number;
  text?: string;
}

export default function Loader({ className = "", size = 24, text }: LoaderProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 w-full min-h-[200px] ${className}`}>
      <Loader2 className="animate-spin text-green-600 mb-2" size={size} />
      {text && <p className="text-sm text-gray-500 font-medium">{text}</p>}
    </div>
  );
}

export function ButtonLoader({ size = 16 }: { size?: number }) {
  return <Loader2 className="animate-spin" size={size} />;
}
