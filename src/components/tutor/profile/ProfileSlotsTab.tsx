"use client";

import { Clock, Calendar, Activity, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ISlotEntry, IAttendanceLog } from "@/types/tutor/profile";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const AVAILABILITY_PERIODS = ["Morning", "Afternoon", "Evening"];

interface Props {
  availability: string[];
  setAvailability: React.Dispatch<React.SetStateAction<string[]>>;
  slots: ISlotEntry[];
  toggleSlotFilled: (i: number) => void;
  removeSlot: (i: number) => void;
  newSlotDay: string;
  setNewSlotDay: (v: string) => void;
  newSlotStart: string;
  setNewSlotStart: (v: string) => void;
  newSlotEnd: string;
  setNewSlotEnd: (v: string) => void;
  addSlot: () => void;
  attendanceLogs: IAttendanceLog[];
  formatDate: (d: string) => string;
  statusColor: (s: string) => string;
}

export default function ProfileSlotsTab({
  availability,
  setAvailability,
  slots,
  toggleSlotFilled,
  removeSlot,
  newSlotDay,
  setNewSlotDay,
  newSlotStart,
  setNewSlotStart,
  newSlotEnd,
  setNewSlotEnd,
  addSlot,
  attendanceLogs,
  formatDate,
  statusColor,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Availability + Attendance */}
      <Card className="bg-white border-slate-200 shadow-sm md:col-span-1">
        <CardHeader className="p-6 pb-3 border-b border-slate-100">
          <CardTitle className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--brand-green)]" /> Availability
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Availability Periods</Label>
            <div className="flex flex-wrap gap-2 pt-1">
              {AVAILABILITY_PERIODS.map((opt) => {
                const isSelected = availability.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() =>
                      setAvailability((prev) =>
                        prev.includes(opt) ? prev.filter((item) => item !== opt) : [...prev, opt]
                      )
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      isSelected
                        ? "bg-[var(--brand-green)] text-white border-[var(--brand-green)]"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
         
          </div>

          {attendanceLogs.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <Label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1 mb-3">
                <Activity className="w-3 h-3" /> Attendance Logs
              </Label>
              <div className="space-y-2">
                {attendanceLogs.map((log) => (
                  <div key={log.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-800">{formatDate(log.date)}</span>
                      <Badge variant="outline" className={`text-[9px] font-bold capitalize ${statusColor(log.status)}`}>
                        {log.status.replace(/_/g, " ")}
                      </Badge>
                    </div>
                    <div className="flex gap-3 text-[10px] text-slate-600 font-medium">
                      <span>{log.workHours}h worked</span>
                      <span>·</span>
                      <span>{log.sessionCount} session{log.sessionCount !== 1 ? "s" : ""}</span>
                      <span>·</span>
                      <span>{log.totalMinutes} min</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schedule Slots */}
      <Card className="bg-white border-slate-200 shadow-sm md:col-span-2">
        <CardHeader className="p-6 pb-3 border-b border-slate-100">
          <CardTitle className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[var(--brand-green)]" /> Schedule Slots
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-3">
            <Label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Draft Slots</Label>
            {slots.length === 0 ? (
              <p className="text-xs text-slate-600 py-4 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                No slot schedule set. Create one below!
              </p>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-xl bg-slate-50/30">
                <Table className="min-w-full divide-y divide-slate-100">
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      {["Day", "Timings", "Status", "Actions"].map((h, i) => (
                        <TableHead
                          key={h}
                          className={`px-4 py-2.5 text-[9px] font-bold text-slate-600 uppercase tracking-wider ${
                            i === 2 ? "text-center" : i === 3 ? "text-right" : "text-left"
                          }`}
                        >
                          {h}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-slate-100 bg-white">
                    {slots.map((slot, index) => (
                      <TableRow key={index} className="hover:bg-slate-50/35 transition-colors">
                        <TableCell className="px-4 py-3 whitespace-nowrap text-xs font-bold text-slate-800">{slot.day}</TableCell>
                        <TableCell className="px-4 py-3 whitespace-nowrap text-xs text-slate-600 font-medium">
                          <span className="font-bold text-[var(--brand-green)]">{slot.startTime}</span>
                          {" – "}
                          <span className="font-bold text-[var(--brand-green)]">{slot.endTime}</span>
                        </TableCell>
                        <TableCell className="px-4 py-3 whitespace-nowrap text-center">
                          <Badge
                            onClick={() => toggleSlotFilled(index)}
                            variant="outline"
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full border cursor-pointer capitalize select-none ${
                              slot.filled
                                ? "bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200"
                                : "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20 hover:bg-[var(--brand-light-green)]/30"
                            }`}
                          >
                            {slot.filled ? "Filled / Booked" : "Available"}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 whitespace-nowrap text-right">
                          <button
                            type="button"
                            onClick={() => removeSlot(index)}
                            className="text-slate-600 hover:text-red-500 hover:bg-red-50 p-1 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-slate-100 space-y-4">
            <Label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Add Slot Time</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <div className="space-y-1.5">
                <Label htmlFor="slotDay" className="text-xs font-semibold text-slate-600">Day</Label>
                <Select value={newSlotDay} onValueChange={setNewSlotDay}>
                  <SelectTrigger className="bg-white border-slate-200">
                    <SelectValue placeholder="Select Day" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-slate-150 rounded-xl shadow-lg">
                    {DAYS_OF_WEEK.map((day) => (
                      <SelectItem key={day} value={day}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="startTime" className="text-xs font-semibold text-slate-600">Start Time</Label>
                <Input id="startTime" type="time" value={newSlotStart} onChange={(e) => setNewSlotStart(e.target.value)} className="bg-white border-slate-200" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="endTime" className="text-xs font-semibold text-slate-600">End Time</Label>
                <Input id="endTime" type="time" value={newSlotEnd} onChange={(e) => setNewSlotEnd(e.target.value)} className="bg-white border-slate-200" />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={addSlot}
                className="flex items-center gap-1.5 bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Slot to Schedule
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
