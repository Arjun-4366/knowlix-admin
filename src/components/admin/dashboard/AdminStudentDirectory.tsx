import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";

// Dummy Students Data
const dummyStudents = [
  { id: "STU-101", name: "Rahul Sharma", grade: "Grade 10", course: "Mathematics & Physics", dateJoined: "12 Jan 2026", attendance: "96%", status: "Active" },
  { id: "STU-102", name: "Sneha Reddy", grade: "Grade 12", course: "Chemistry & Biology", dateJoined: "05 Feb 2026", attendance: "92%", status: "Active" },
  { id: "STU-103", name: "Kabir Malhotra", grade: "Grade 8", course: "General Science", dateJoined: "22 Feb 2026", attendance: "88%", status: "Active" },
  { id: "STU-104", name: "Aria Fernandes", grade: "Grade 11", course: "English Literature", dateJoined: "10 Mar 2026", attendance: "95%", status: "Active" },
  { id: "STU-105", name: "Vikram Sen", grade: "Grade 9", course: "Python Programming", dateJoined: "18 Mar 2026", attendance: "78%", status: "Inactive" },
  { id: "STU-106", name: "Meera Joshi", grade: "Grade 10", course: "Mathematics", dateJoined: "01 Apr 2026", attendance: "100%", status: "Active" },
];

interface AdminStudentDirectoryProps {
  onBack: () => void;
}

export default function AdminStudentDirectory({ onBack }: AdminStudentDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = dummyStudents.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const searchAction = (
    <div className="relative w-full">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type="text"
        placeholder="Search students, grades..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-2 text-sm bg-slate-55 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl outline-none transition-all"
      />
    </div>
  );

  return (
    <div className="space-y-6 max-w-6xl">
      <DashboardHeader
        title="Complete Student Directory"
        description="Monitor student enrollments, attendance records, and active courses."
        onBack={onBack}
        actions={searchAction}
      />

      <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Course Enrolled</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date Joined</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Attendance</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-550">{student.id}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-800">{student.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{student.grade}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{student.course}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{student.dateJoined}</td>
                    <td className="px-6 py-4 text-sm text-center font-medium text-slate-700">{student.attendance}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border",
                        student.status === "Active"
                          ? "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20"
                          : "bg-red-50 text-red-700 border-red-200"
                      )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", student.status === "Active" ? "bg-[var(--brand-green)]" : "bg-red-500")} />
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400 text-sm">
                    No students found matching your query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
