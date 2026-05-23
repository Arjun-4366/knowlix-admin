"use client";

import { Laptop, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LiveClass {
  id: string;
  date: string;
  time: string;
  subject: string;
  topic: string;
  tutor: string;
  status: string;
}

interface StudentClassroomModalProps {
  activeClass: LiveClass;
  onClose: () => void;
}

export default function StudentClassroomModal({
  activeClass,
  onClose,
}: StudentClassroomModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-955/50">
          <div className="flex items-center gap-2">
            <Laptop className="w-4 h-4 text-[var(--brand-green)]" />
            <h3 className="font-bold text-sm tracking-wide">Live Virtual Classroom Room</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Simulated Live Room Interface */}
        <div className="p-6 space-y-6">
          <div className="aspect-video bg-black rounded-xl border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
            {/* Simulated webcam stream */}
            <div className="absolute top-4 right-4 w-28 h-20 bg-slate-850 rounded-lg border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400">
              You (Rahul)
            </div>

            <div className="w-16 h-16 rounded-full bg-[var(--brand-green)]/15 border border-[var(--brand-green)]/35 flex items-center justify-center text-[var(--brand-green)] text-2xl font-black animate-pulse">
              {activeClass.tutor.split(" ").pop()?.charAt(0)}
            </div>
            <p className="text-xs font-bold text-slate-200 mt-4">{activeClass.tutor}</p>
            <p className="text-[10px] text-[var(--brand-green)] font-semibold flex items-center gap-1.5 mt-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--brand-green)] animate-ping"></span>
              Presenting: Screen Share Active
            </p>
          </div>

          <div className="bg-slate-950/60 p-4 border border-slate-850 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-[9px] font-black text-slate-400 uppercase block">Active Course Unit</span>
              <p className="font-bold mt-1 text-slate-100">{activeClass.subject}: {activeClass.topic}</p>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-black text-slate-450 uppercase block">Meeting ID</span>
              <p className="font-mono font-bold mt-1 text-slate-350">{activeClass.id}</p>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button
              onClick={onClose}
              className="bg-red-650 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md border-transparent px-5 cursor-pointer"
            >
              Leave Class
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
