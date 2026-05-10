"use client";

import { Save } from "lucide-react";
import { ButtonLoader } from "./Loader";

interface Props {
  onSave?: () => void;
  saving?: boolean;
  label?: string;
}

export default function FormActions({ onSave, saving, label = "Save Changes" }: Props) {
  return (
    <div className="flex items-center gap-3 pt-5 mt-5 border-t border-gray-100">
      <button
        onClick={onSave}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-2.5 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-60 cursor-pointer active:scale-95 shadow-sm hover:shadow-md"
        style={{ background: saving ? "#15803d" : "var(--brand-green)" }}
      >
        {saving ? <ButtonLoader /> : <Save className="w-4 h-4" />}
        {saving ? "Saving…" : label}
      </button>
    </div>
  );
}
