"use client";

import React from "react";
import { AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "warning" | "info";
}

export const ConfirmationDialog = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "danger",
}: ConfirmationDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0d3b2e]/20 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 text-center">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5",
            variant === "danger" && "bg-red-50 text-red-500",
            variant === "warning" && "bg-amber-50 text-amber-500",
            variant === "info" && "bg-green-50 text-green-600"
          )}>
            <AlertCircle className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-bold text-[#0d3b2e] mb-2 tracking-tight">{title}</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6 px-2">
            {message}
          </p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-100 text-sm font-bold text-gray-400 hover:bg-gray-50 transition-all active:scale-95"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={cn(
                "flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm transition-all active:scale-95",
                variant === "danger" && "bg-red-500 hover:bg-red-600",
                variant === "warning" && "bg-amber-500 hover:bg-amber-600",
                variant === "info" && "bg-green-600 hover:bg-green-700"
              )}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
