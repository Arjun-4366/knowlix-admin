import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";

// Dummy Tutors Data
const dummyTutors = [
  { id: "TUT-001", name: "Dr. Ramesh Prasad", subject: "Advanced Physics", experience: "8 years", activeStudents: 14, email: "ramesh.prasad@knowlix.com", status: "Active" },
  { id: "TUT-002", name: "Sarah Jenkins", subject: "English Literature", experience: "5 years", activeStudents: 18, email: "sarah.j@knowlix.com", status: "Active" },
  { id: "TUT-003", name: "Amit Shah", subject: "Mathematics (JEE)", experience: "12 years", activeStudents: 25, email: "amit.shah@knowlix.com", status: "Active" },
  { id: "TUT-004", name: "Priya Nair", subject: "Organic Chemistry", experience: "6 years", activeStudents: 12, email: "priya.nair@knowlix.com", status: "Out of Office" },
  { id: "TUT-005", name: "David Miller", subject: "Computer Science (Python)", experience: "4 years", activeStudents: 15, email: "david.m@knowlix.com", status: "Active" },
  { id: "TUT-006", name: "Ananya Roy", subject: "Biology", experience: "7 years", activeStudents: 9, email: "ananya.roy@knowlix.com", status: "Active" },
];

interface AdminTutorDirectoryProps {
  onBack: () => void;
}

export default function AdminTutorDirectory({ onBack }: AdminTutorDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTutors = dummyTutors.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const searchAction = (
    <div className="relative w-full">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type="text"
        placeholder="Search tutors, subjects..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl outline-none transition-all"
      />
    </div>
  );

  return (
    <div className="space-y-6 max-w-6xl">
      <DashboardHeader
        title="Complete Tutor Directory"
        description="Manage active tutors, subjects, workloads, and contact emails."
        onBack={onBack}
        actions={searchAction}
      />

      <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tutor ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Subject Expertise</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Experience</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Active Students</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTutors.length > 0 ? (
                filteredTutors.map((tutor) => (
                  <tr key={tutor.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-550">{tutor.id}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-808">{tutor.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{tutor.subject}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{tutor.experience}</td>
                    <td className="px-6 py-4 text-sm text-slate-700 text-center font-medium">{tutor.activeStudents}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{tutor.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border",
                        tutor.status === "Active"
                          ? "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", tutor.status === "Active" ? "bg-[var(--brand-green)]" : "bg-amber-500")} />
                        {tutor.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400 text-sm">
                    No tutors found matching your query.
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
