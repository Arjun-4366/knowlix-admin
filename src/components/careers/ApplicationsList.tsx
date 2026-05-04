"use client";

import { useState } from "react";
import { Search, Eye, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Application = {
  id: number;
  name: string;
  email: string;
  subject: string;
  experience: string;
  date: string;
  status: "new" | "reviewing" | "shortlisted" | "rejected";
};

const initial: Application[] = [
  { id: 1, name: "Meena Joshi", email: "meena@gmail.com", subject: "Mathematics", experience: "5 years", date: "2026-05-01", status: "new" },
  { id: 2, name: "Karthik Rajan", email: "karthik@gmail.com", subject: "Physics", experience: "3 years", date: "2026-04-28", status: "reviewing" },
  { id: 3, name: "Divya Pillai", email: "divya@gmail.com", subject: "English", experience: "7 years", date: "2026-04-25", status: "shortlisted" },
  { id: 4, name: "Ravi Shankar", email: "ravi@gmail.com", subject: "Coding", experience: "2 years", date: "2026-04-22", status: "new" },
  { id: 5, name: "Lakshmi Nair", email: "lakshmi@gmail.com", subject: "Chemistry", experience: "4 years", date: "2026-04-20", status: "rejected" },
];

const statusColors: Record<Application["status"], { bg: string; text: string }> = {
  new: { bg: "#dbeafe", text: "#1d4ed8" },
  reviewing: { bg: "#fef9c3", text: "#92400e" },
  shortlisted: { bg: "#dcfce7", text: "#15803d" },
  rejected: { bg: "#fee2e2", text: "#b91c1c" },
};

export default function ApplicationsList() {
  const [apps, setApps] = useState<Application[]>(initial);
  const [search, setSearch] = useState("");

  const filtered = apps.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.subject.toLowerCase().includes(search.toLowerCase())
  );

  const updateStatus = (id: number, status: Application["status"]) =>
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));

  const remove = (id: number) => setApps((prev) => prev.filter((a) => a.id !== id));

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or subject…"
          className="pl-9"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Applicant</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Subject</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Experience</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((app) => {
              const sc = statusColors[app.status];
              return (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{app.name}</p>
                    <p className="text-xs text-gray-400">{app.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{app.subject}</td>
                  <td className="px-4 py-3 text-gray-600">{app.experience}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{app.date}</td>
                  <td className="px-4 py-3">
                    <Select value={app.status} onValueChange={(v) => updateStatus(app.id, v as Application["status"])}>
                      <SelectTrigger className="h-7 w-32 text-xs border-0 p-0" style={{ background: sc.bg, color: sc.text, padding: "2px 8px", borderRadius: "9999px" }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="reviewing">Reviewing</SelectItem>
                        <SelectItem value="shortlisted">Shortlisted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => remove(app.id)} className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">No applications found</p>
        )}
      </div>
    </div>
  );
}
