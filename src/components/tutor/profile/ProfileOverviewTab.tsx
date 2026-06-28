"use client";

import { User, Sparkles, ThumbsUp, ThumbsDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ITutorProfilePayload, IAssignedStudent, IAttendanceLog } from "@/types/tutor/profile";

interface Props {
  profile: ITutorProfilePayload;
  roleLabel: string;
  availability: string[];
  assignedStudents: IAssignedStudent[];
  attendanceLogs: IAttendanceLog[];
  formatDate: (d: string) => string;
  statusColor: (s: string) => string;
}

export default function ProfileOverviewTab({
  profile,
  roleLabel,
  availability,
  assignedStudents,
  attendanceLogs,
  formatDate,
  statusColor,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Personal Info */}
      <Card className="bg-white border-slate-200 shadow-sm md:col-span-2">
        <CardHeader className="p-6 pb-3 border-b border-slate-100">
          <CardTitle className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-[var(--brand-green)]" /> Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Full Name", value: profile.name },
              { label: "Email Address", value: profile.email },
              { label: "Phone Number", value: profile.phone || "N/A" },
              { label: "Teaching Experience", value: profile.experience || "N/A" },
            ].map(({ label, value }) => (
              <div key={label}>
                <Label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">{label}</Label>
                <p className="text-sm font-semibold text-slate-800 mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200">{value}</p>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Availability Periods</Label>
            <div className="flex flex-wrap gap-2 mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200 min-h-[44px] items-center">
              {availability.length > 0 ? (
                availability.map((av) => (
                  <Badge key={av} variant="secondary" className="bg-white border-slate-200 text-slate-700 font-semibold">{av}</Badge>
                ))
              ) : (
                <span className="text-sm font-semibold text-slate-600">No availability configured yet.</span>
              )}
            </div>
          </div>

          {((profile.positiveRemarks && profile.positiveRemarks.length > 0) ||
            (profile.negativeRemarks && profile.negativeRemarks.length > 0)) && (
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.positiveRemarks && profile.positiveRemarks.length > 0 && (
                <div>
                  <Label className="text-[10px] font-bold text-green-700 uppercase tracking-wider flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" /> Positive Remarks
                  </Label>
                  <ul className="mt-1 space-y-1.5">
                    {profile.positiveRemarks.map((r, i) => (
                      <li key={i} className="text-xs text-green-800 bg-green-50 border border-green-100 rounded-lg p-2.5 space-y-0.5">
                        <p>{r.text}</p>
                        <p className="text-[10px] text-green-600 font-semibold">
                          {new Date(r.addedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {profile.negativeRemarks && profile.negativeRemarks.length > 0 && (
                <div>
                  <Label className="text-[10px] font-bold text-red-600 uppercase tracking-wider flex items-center gap-1">
                    <ThumbsDown className="w-3 h-3" /> Areas to Improve
                  </Label>
                  <ul className="mt-1 space-y-1.5">
                    {profile.negativeRemarks.map((r, i) => (
                      <li key={i} className="text-xs text-red-800 bg-red-50 border border-red-100 rounded-lg p-2.5 space-y-0.5">
                        <p>{r.text}</p>
                        <p className="text-[10px] text-red-500 font-semibold">
                          {new Date(r.addedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Status */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader className="p-6 pb-3 border-b border-slate-100">
          <CardTitle className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--brand-green)]" /> System Status
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Account Role</Label>
            <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-green)]" />
              {roleLabel}
            </div>
          </div>
          <div>
            <Label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Assigned Students</Label>
            <p className="text-xs font-bold text-slate-800 mt-0.5">{assignedStudents.length} Students</p>
          </div>
          <div>
            <Label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Attendance Records</Label>
            <p className="text-xs font-bold text-slate-800 mt-0.5">
              {attendanceLogs.length} Session{attendanceLogs.length !== 1 ? "s" : ""} logged
            </p>
          </div>
          <div>
            <Label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Member Since</Label>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">
              {new Date(profile.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>

          {profile.permissions && (
            <div className="pt-2 border-t border-slate-100">
              <Label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2 block">Assigned Permissions</Label>
              <div className="space-y-1.5">
                {[
                  { label: "Upload Study Notes", value: profile.permissions.canUploadNotes },
                  { label: "Edit Notes & Resources", value: profile.permissions.canEditNotes },
                  { label: "Share Material", value: profile.permissions.canShareMaterial },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-medium">{label}</span>
                    <Badge variant="outline" className={value ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-50 text-slate-600 border-slate-200"}>
                      {value ? "Yes" : "No"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {attendanceLogs.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <Label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2 block">Recent Attendance</Label>
              <div className="space-y-1">
                {attendanceLogs.slice(0, 3).map((log) => (
                  <div key={log.id} className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-medium">{formatDate(log.date)}</span>
                    <Badge variant="outline" className={`text-[9px] font-bold ${statusColor(log.status)}`}>
                      {log.status.replace(/_/g, " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
