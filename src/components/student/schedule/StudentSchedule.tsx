"use client";

import { useState } from "react";
import { Calendar, Clock, Video, User, BookOpen, AlertCircle, CheckCircle2, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "react-hot-toast";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";

interface ClassSession {
  id: string;
  subject: string;
  topic: string;
  tutor: string;
  date: string;
  time: string;
  status: "Active" | "Scheduled" | "Completed";
  meetingLink?: string;
}

interface MentorMeeting {
  id: string;
  mentor: string;
  date: string;
  time: string;
  agenda: string;
  status: "Scheduled" | "Requested" | "Completed";
}

interface ExamSchedule {
  id: string;
  subject: string;
  examType: string;
  date: string;
  time: string;
  syllabus: string;
}

const mockClasses: ClassSession[] = [
  { id: "CLS-401", subject: "Mathematics", topic: "Integration & Calculus Core", tutor: "Dr. Ramesh Prasad", date: "Today", time: "16:00 - 17:00", status: "Active", meetingLink: "https://zoom.us/mock/math-integration" },
  { id: "CLS-402", subject: "Physics", topic: "Thermodynamics Theory", tutor: "Dr. Ramesh Prasad", date: "Tomorrow", time: "17:30 - 18:30", status: "Scheduled" },
  { id: "CLS-403", subject: "Chemistry", topic: "Chemical Equilibrium Intro", tutor: "Vikram Malhotra", date: "2026-05-25", time: "15:00 - 16:00", status: "Scheduled" },
  { id: "CLS-404", subject: "Computer Science", topic: "Object Oriented Design", tutor: "David Miller", date: "2026-05-26", time: "18:00 - 19:30", status: "Scheduled" },
  { id: "CLS-400", subject: "Mathematics", topic: "Differentiation Rules Practice", tutor: "Dr. Ramesh Prasad", date: "Yesterday", time: "16:00 - 17:00", status: "Completed" }
];

const mockMeetings: MentorMeeting[] = [
  { id: "MTG-01", mentor: "Sarah Jenkins", date: "2026-05-26", time: "14:00 - 14:30", agenda: "Academic Performance Check-in", status: "Scheduled" },
  { id: "MTG-02", mentor: "Sarah Jenkins", date: "2026-05-12", time: "11:00 - 11:30", agenda: "Career Path & Subject Selections", status: "Completed" }
];

const mockExams: ExamSchedule[] = [
  { id: "EXM-101", subject: "Mathematics", examType: "Mid-Term Assessment", date: "2026-05-28", time: "10:00 AM - 11:30 AM", syllabus: "Calculus (Limits, Differentiation) & Coordinate Geometry" },
  { id: "EXM-102", subject: "Physics", examType: "Monthly Quiz 3", date: "2026-06-03", time: "02:00 PM - 02:45 PM", syllabus: "Kinematics & Laws of Motion" }
];

export default function StudentSchedule() {
  const [classes, setClasses] = useState(mockClasses);
  const [meetings, setMeetings] = useState(mockMeetings);
  const [exams, setExams] = useState(mockExams);

  const handleJoinClass = (cls: ClassSession) => {
    if (cls.status === "Active") {
      toast.success(`Joining live class: ${cls.subject} (${cls.topic})`);
      window.open(cls.meetingLink, "_blank");
    } else {
      toast.error("This class is not live yet.");
    }
  };

  const handleRequestMeeting = () => {
    const newMtg: MentorMeeting = {
      id: `MTG-${Date.now()}`,
      mentor: "Sarah Jenkins",
      date: "2026-05-29",
      time: "15:00 - 15:30 (Requested)",
      agenda: "Syllabus Catch-up & General Doubts",
      status: "Requested"
    };

    setMeetings([newMtg, ...meetings]);
    toast.success("Mentor meeting requested successfully!");
  };

  return (
    <div className="space-y-6 w-full pb-10">
      <DashboardHeader
        title="My Schedule"
        description="View your live classes, upcoming sessions, tutor meetings, and exam schedules."
      />

      <Tabs defaultValue="classes">
        <div className="flex justify-between items-center mb-6">
          <TabsList className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit">
            <TabsTrigger
              value="classes"
              className="rounded-lg text-xs px-4 py-2 font-bold data-[state=active]:shadow-none data-[state=active]:text-white cursor-pointer"
            >
              Classes & Sessions
            </TabsTrigger>
            <TabsTrigger
              value="meetings"
              className="rounded-lg text-xs px-4 py-2 font-bold data-[state=active]:shadow-none data-[state=active]:text-white cursor-pointer"
            >
              Mentor Meetings
            </TabsTrigger>
            <TabsTrigger
              value="exams"
              className="rounded-lg text-xs px-4 py-2 font-bold data-[state=active]:shadow-none data-[state=active]:text-white cursor-pointer"
            >
              Exam Timetable
            </TabsTrigger>
          </TabsList>

          <Button
            onClick={handleRequestMeeting}
            className="bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Book Mentor Session
          </Button>
        </div>

        {/* Classes Tab */}
        <TabsContent value="classes" className="mt-0 outline-none space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classes.map((cls) => {
              const isActive = cls.status === "Active";
              const isCompleted = cls.status === "Completed";
              
              let statusBadge = "bg-amber-50 text-amber-700 border-amber-100";
              if (isActive) statusBadge = "bg-emerald-50 text-emerald-700 border-emerald-100 border-2 animate-pulse";
              if (isCompleted) statusBadge = "bg-slate-100 text-slate-500 border-slate-200";

              return (
                <Card
                  key={cls.id}
                  className={`bg-white border rounded-2xl shadow-sm transition-all hover:shadow-md flex flex-col justify-between overflow-hidden ${
                    isActive ? "border-[var(--brand-green)] ring-1 ring-[var(--brand-green)]/15" : "border-slate-150"
                  }`}
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${statusBadge}`}>
                        {cls.status}
                      </Badge>
                      <span className="text-[10px] text-slate-400 font-bold">{cls.id}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider block">{cls.subject}</span>
                      <h3 className="text-sm font-bold text-slate-800 leading-tight mt-0.5">{cls.topic}</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{cls.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{cls.time}</span>
                      </div>
                    </div>
                  </CardContent>

                  <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-550">
                      <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{cls.tutor}</span>
                    </div>

                    {isCompleted ? (
                      <Badge className="bg-slate-100 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-none border border-slate-200/50">
                        Class Attended
                      </Badge>
                    ) : (
                      <Button
                        onClick={() => handleJoinClass(cls)}
                        className={`h-8 text-[10px] px-3 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all ${
                          isActive
                            ? "bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white shadow-sm"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-650"
                        }`}
                      >
                        <Video className="w-3.5 h-3.5" /> Join Room
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Mentor Meetings Tab */}
        <TabsContent value="meetings" className="mt-0 outline-none space-y-4">
          <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-150">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mentor</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Agenda / Focus</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Scheduled Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Time Slot</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {meetings.map((mtg) => (
                    <tr key={mtg.id} className="hover:bg-slate-50/40 transition-colors text-xs font-semibold text-slate-650">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[var(--brand-green)] text-white text-[9px] font-bold flex items-center justify-center">
                            {mtg.mentor.substring(0, 1)}
                          </div>
                          <span className="font-bold text-slate-800">{mtg.mentor}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{mtg.agenda}</td>
                      <td className="px-6 py-4">
                        {new Date(mtg.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </td>
                      <td className="px-6 py-4">{mtg.time}</td>
                      <td className="px-6 py-4 text-right">
                        <Badge
                          variant="outline"
                          className={`text-[9px] font-bold py-0.5 px-2 border rounded-full ${
                            mtg.status === "Scheduled"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : mtg.status === "Requested"
                              ? "bg-amber-50 text-amber-700 border-amber-100"
                              : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}
                        >
                          {mtg.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Exams Tab */}
        <TabsContent value="exams" className="mt-0 outline-none space-y-4">
          <div className="grid grid-cols-1 gap-6">
            {exams.map((exm) => (
              <Card key={exm.id} className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row">
                {/* Visual Left accent */}
                <div className="md:w-48 bg-slate-50/50 p-6 border-b md:border-b-0 md:border-r border-slate-150 flex flex-col justify-center items-center text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{exm.id}</span>
                  <div className="w-12 h-12 rounded-2xl bg-[var(--brand-light-green)] flex items-center justify-center mt-2 border border-[var(--brand-light)]/20">
                    <BookOpen className="w-6 h-6 text-[var(--brand-green)]" />
                  </div>
                  <span className="text-sm font-black text-slate-800 mt-2 block">{exm.subject}</span>
                </div>

                {/* Main Details */}
                <div className="flex-1 p-6 space-y-4">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">{exm.examType}</h3>
                    <div className="flex flex-wrap gap-3 text-xs font-semibold text-slate-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>
                          {new Date(exm.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>{exm.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                    <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block">Exam Syllabus</span>
                    <p className="text-xs text-slate-650 mt-1 font-semibold leading-relaxed">
                      {exm.syllabus}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
