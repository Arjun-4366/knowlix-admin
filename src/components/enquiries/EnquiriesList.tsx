"use client";

import { useState } from "react";
import { Search, Trash2, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Enquiry = {
  id: number;
  name: string;
  phone: string;
  grade: string;
  message: string;
  date: string;
  status: "new" | "replied" | "closed";
};

const initial: Enquiry[] = [
  { id: 1, name: "Sunita Rao", phone: "+91 98765 43210", grade: "Grade 9", message: "Hi, I'm looking for a math tutor for my daughter who is in Grade 9. Can you help?", date: "2026-05-04", status: "new" },
  { id: 2, name: "Manoj Verma", phone: "+91 87654 32109", grade: "Grade 6", message: "Wanted to know the fee structure for Science and Maths for Grade 6.", date: "2026-05-03", status: "replied" },
  { id: 3, name: "Shalini Krishnan", phone: "+91 76543 21098", grade: "Grade 12", message: "My son is in Grade 12 and needs coaching for JEE Physics and Chemistry.", date: "2026-05-03", status: "new" },
  { id: 4, name: "Rahul Mehta", phone: "+91 65432 10987", grade: "Grade 4", message: "Looking for coding classes for my 9-year-old. Do you have beginner level courses?", date: "2026-05-02", status: "new" },
  { id: 5, name: "Ananya Pillai", phone: "+91 54321 09876", grade: "Grade 8", message: "Can we schedule a free demo class for English? My daughter struggles with comprehension.", date: "2026-05-01", status: "replied" },
  { id: 6, name: "Deepak Kumar", phone: "+91 43210 98765", grade: "Grade 10", message: "Interested in Online School program. Please share more details about the curriculum.", date: "2026-04-30", status: "closed" },
  { id: 7, name: "Rekha Nair", phone: "+91 32109 87654", grade: "KG", message: "Is there a program for kindergarten children? My daughter is 5 years old.", date: "2026-04-29", status: "new" },
  { id: 8, name: "Vijay Sharma", phone: "+91 21098 76543", grade: "Grade 11", message: "Need NEET preparation for Biology. What batches do you have?", date: "2026-04-28", status: "replied" },
  { id: 9, name: "Kavitha Balan", phone: "+91 10987 65432", grade: "Grade 7", message: "How many students are in each batch? Looking for personalized attention for my son.", date: "2026-04-27", status: "closed" },
  { id: 10, name: "Arjun Gopal", phone: "+91 09876 54321", grade: "Grade 5", message: "Does Knowlix offer weekend classes? My child has school on weekdays.", date: "2026-04-26", status: "new" },
  { id: 11, name: "Priya Iyer", phone: "+91 98765 12345", grade: "Grade 3", message: "Looking for English and Maths help for Grade 3. Are there any demo sessions?", date: "2026-04-25", status: "new" },
  { id: 12, name: "Suresh Babu", phone: "+91 87654 23456", grade: "Grade 12", message: "Board exam preparation — need a tutor for Mathematics and Physics urgently.", date: "2026-04-24", status: "new" },
];

const statusColors: Record<Enquiry["status"], { bg: string; text: string }> = {
  new: { bg: "#dbeafe", text: "#1d4ed8" },
  replied: { bg: "#dcfce7", text: "#15803d" },
  closed: { bg: "#f3f4f6", text: "#6b7280" },
};

export default function EnquiriesList() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initial);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | Enquiry["status"]>("all");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = enquiries.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.phone.includes(search) ||
      e.grade.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || e.status === filter;
    return matchSearch && matchFilter;
  });

  const updateStatus = (id: number, status: Enquiry["status"]) =>
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));

  const remove = (id: number) => setEnquiries((prev) => prev.filter((e) => e.id !== id));

  const counts = {
    new: enquiries.filter((e) => e.status === "new").length,
    replied: enquiries.filter((e) => e.status === "replied").length,
    closed: enquiries.filter((e) => e.status === "closed").length,
  };

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {([["new", "New", "#dbeafe", "#1d4ed8"], ["replied", "Replied", "#dcfce7", "#15803d"], ["closed", "Closed", "#f3f4f6", "#6b7280"]] as const).map(([key, label, bg, color]) => (
          <div key={key} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: bg }}>
              <MessageSquare className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <p className="text-2xl font-bold font-heading" style={{ color: "var(--brand-dark)" }}>{counts[key]}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, phone, or grade…" className="pl-9" />
        </div>
        <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All ({enquiries.length})</SelectItem>
            <SelectItem value="new">New ({counts.new})</SelectItem>
            <SelectItem value="replied">Replied ({counts.replied})</SelectItem>
            <SelectItem value="closed">Closed ({counts.closed})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Parent</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Grade</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Message</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((enq) => {
              const sc = statusColors[enq.status];
              return (
                <>
                  <tr
                    key={enq.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setExpanded(expanded === enq.id ? null : enq.id)}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{enq.name}</p>
                      <p className="text-xs text-gray-400">{enq.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{enq.grade}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs max-w-[280px] truncate">{enq.message}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{enq.date}</td>
                    <td className="px-4 py-3">
                      <Select value={enq.status} onValueChange={(v) => updateStatus(enq.id, v as Enquiry["status"])}>
                        <SelectTrigger className="h-7 w-28 text-xs" style={{ background: sc.bg, color: sc.text, border: "none", borderRadius: "9999px", padding: "2px 8px" }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="replied">Replied</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); remove(enq.id); }}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                  {expanded === enq.id && (
                    <tr key={`${enq.id}-expanded`}>
                      <td colSpan={6} className="px-4 py-3 bg-blue-50 border-b border-blue-100">
                        <p className="text-sm text-gray-700 leading-relaxed">{enq.message}</p>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-10">No enquiries found</p>
        )}
      </div>
    </div>
  );
}
