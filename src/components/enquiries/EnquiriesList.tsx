"use client";

import React, { useState } from "react";
import { Search, Trash2, MessageSquare, Phone, User, GraduationCap, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IEnquiry, EnquiryStatus } from "@/types/admin/enquiry";
import { useGetEnquiries, useUpdateEnquiryStatus, useDeleteEnquiry } from "@/querys/admin/enquiryQuery";
import { useConfirmation } from "@/context/ConfirmationContext";
import Loader from "@/components/shared/Loader";
import SectionCard from "@/components/shared/SectionCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusColors: Record<EnquiryStatus, { bg: string; text: string; label: string }> = {
  New: { bg: "#dbeafe", text: "#1d4ed8", label: "New" },
  Contacted: { bg: "#dcfce7", text: "#15803d", label: "Contacted" },
  Closed: { bg: "#f3f4f6", text: "#6b7280", label: "Closed" },
};

export default function EnquiriesList() {
  const { data: enquiryData, isLoading } = useGetEnquiries();
  const { mutateAsync: updateStatus } = useUpdateEnquiryStatus();
  const { mutateAsync: deleteEnq } = useDeleteEnquiry();
  const { confirm } = useConfirmation();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | EnquiryStatus>("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  if (isLoading) return <Loader text="Fetching Enquiries..." />;

  const enquiries = enquiryData?.enquiries || [];

  const filtered = enquiries.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.phoneNumber.includes(search) ||
      e.childGrade.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || e.status === filter;
    return matchSearch && matchFilter;
  });

  const handleDelete = (id: string) => {
    confirm({
      title: "Delete Enquiry",
      message: "Are you sure you want to remove this enquiry? This action cannot be undone.",
      confirmText: "Delete",
      variant: "danger",
      onConfirm: async () => {
        try {
          await deleteEnq(id);
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  const handleStatusChange = async (id: string, status: EnquiryStatus) => {
    try {
      await updateStatus({ id, status });
    } catch (error) {
      console.error(error);
    }
  };

  const counts = {
    New: enquiries.filter((e) => e.status === "New").length,
    Contacted: enquiries.filter((e) => e.status === "Contacted").length,
    Closed: enquiries.filter((e) => e.status === "Closed").length,
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards aligned with Review theme */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(["New", "Contacted", "Closed"] as const).map((key) => {
          const sc = statusColors[key];
          return (
            <div key={key} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: sc.bg }}>
                <MessageSquare className="w-5 h-5" style={{ color: sc.text }} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-800 leading-tight">{counts[key]}</p>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{sc.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <SectionCard>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
            Submission List ({filtered.length})
          </h3>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="pl-9 h-9 text-xs rounded-lg border-gray-200"
              />
            </div>
            <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
              <SelectTrigger className="w-32 h-9 text-xs rounded-lg border-gray-200">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto -mx-6">
          <Table className="w-full text-left border-collapse text-sm">
            <TableHeader>
              <TableRow className="bg-gray-50 border-y border-gray-100">
                <TableHead className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Parent / Student</TableHead>
                <TableHead className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Grade</TableHead>
                <TableHead className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/3">Message</TableHead>
                <TableHead className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</TableHead>
                <TableHead className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100">
              {filtered.map((enq) => {
                const sc = statusColors[enq.status];
                const isExpanded = expanded === enq.id;

                return (
                  <React.Fragment key={enq.id}>
                    <TableRow
                      className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                      onClick={() => setExpanded(isExpanded ? null : enq.id)}
                    >
                      <TableCell className="px-6 py-4">
                        <p className="font-medium text-gray-700">{enq.name}</p>
                        <p className="text-xs text-gray-400 font-medium">{enq.phoneNumber}</p>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                          {enq.childGrade}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <p className="text-gray-500 text-xs line-clamp-1 max-w-xs">{enq.message}</p>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div onClick={(e) => e.stopPropagation()}>
                          <Select
                            value={enq.status}
                            onValueChange={(v: EnquiryStatus) => handleStatusChange(enq.id, v)}
                          >
                            <SelectTrigger
                              className="h-6 w-24 text-[10px] font-bold uppercase tracking-wider border-none rounded-full"
                              style={{ background: sc.bg, color: sc.text }}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="New">New</SelectItem>
                              <SelectItem value="Contacted">Contacted</SelectItem>
                              <SelectItem value="Closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); setExpanded(isExpanded ? null : enq.id); }}
                            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-all"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(enq.id); }}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow key={`${enq.id}-details`}>
                        <TableCell colSpan={5} className="px-8 py-4 bg-gray-50/50 border-b border-gray-100 animate-in fade-in slide-in-from-top-1 duration-200">
                          <div className="flex gap-4">
                            <div className="w-1 rounded-full bg-gray-200 flex-shrink-0" />
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Message</p>
                              <p className="text-xs text-gray-600 leading-relaxed italic">
                                "{enq.message}"
                              </p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="px-6 py-10 text-center text-gray-400 italic">
                    No enquiries found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}
