"use client";

import { Save } from "lucide-react";

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
        className="flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 cursor-pointer"
        style={{ background: saving ? "#15803d" : "var(--brand-green)" }}
      >
        <Save className="w-3.5 h-3.5" />
        {saving ? "Saving…" : label}
      </button>
      <button
        type="button"
        className="px-4 py-2 text-sm font-medium text-gray-500 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
      >
        Reset
      </button>
    </div>
  );
}
