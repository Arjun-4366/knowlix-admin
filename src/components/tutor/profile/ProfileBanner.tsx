"use client";

import { Mail, Phone, Star, Award, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ITutorProfilePayload } from "@/types/tutor/profile";

interface Props {
  profile: ITutorProfilePayload;
  roleLabel: string;
}

export default function ProfileBanner({ profile, roleLabel }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
      <div className="w-20 h-20 rounded-full bg-[var(--brand-light-green)]/15 border-2 border-[var(--brand-green)]/20 flex items-center justify-center font-black text-[var(--brand-green)] text-3xl flex-shrink-0">
        {profile.name.charAt(0).toUpperCase()}
      </div>

      <div className="flex-1 text-center md:text-left space-y-1.5">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
          <h1 className="text-xl font-bold text-slate-900">{profile.name}</h1>
          <Badge className="bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20 font-bold capitalize text-[10px] py-0.5 px-2 rounded-full">
            {profile.status}
          </Badge>
        </div>
        <p className="text-xs text-slate-600 font-semibold flex items-center justify-center md:justify-start gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--brand-green)]" />
          {roleLabel}
        </p>
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-600 font-medium pt-1">
          <span className="flex items-center gap-1">
            <Mail className="w-3.5 h-3.5 text-slate-600" /> {profile.email}
          </span>
          <span className="flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-slate-600" /> {profile.phone}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-4 rounded-xl self-stretch justify-around md:self-auto flex-shrink-0 min-w-[200px]">
        <div className="text-center">
          <div className="flex items-center justify-center gap-0.5 mb-0.5">
            <Star className="w-4 h-4 fill-[var(--brand-green)] text-[var(--brand-green)]" />
            <span className="text-lg font-extrabold text-slate-900">{profile.growthPoints}</span>
          </div>
          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-wider">Growth Points</p>
        </div>
     

      </div>
    </div>
  );
}
