"use client";

import { useState } from "react";
import { format } from "date-fns";
import { History, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetGrowthHistory } from "@/querys/admin/tutorQuery";

interface TutorGrowthHistoryProps {
  tutorId: string;
}

export function TutorGrowthHistory({ tutorId }: TutorGrowthHistoryProps) {
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");

  const { data, isLoading } = useGetGrowthHistory({
    tutorId,
    ...(month ? { month } : {}),
    ...(year ? { year: parseInt(year) } : {}),
  });

  const historyData = data?.data || [];

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

  return (
    <Card className="bg-white border-slate-150 shadow-sm mt-6">
      <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[var(--brand-green)]" />
            <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">
              Growth History
            </CardTitle>
          </div>
          <div className="flex items-center gap-3">
            <Select value={month || "all"} onValueChange={(v) => setMonth(v === "all" ? "" : v)}>
              <SelectTrigger className="w-[140px] h-8 text-xs font-semibold bg-white border-slate-200">
                <SelectValue placeholder="All Months" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {months.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={year || "all"} onValueChange={(v) => setYear(v === "all" ? "" : v)}>
              <SelectTrigger className="w-[120px] h-8 text-xs font-semibold bg-white border-slate-200">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map((y) => (
                  <SelectItem key={y} value={y}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--brand-green)]" />
          </div>
        ) : historyData.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow className="border-slate-100 hover:bg-slate-50">
                  <TableHead className="text-xs font-bold text-slate-700 whitespace-nowrap px-6 py-3">Date</TableHead>
                  <TableHead className="text-xs font-bold text-slate-700 whitespace-nowrap text-center">G</TableHead>
                  <TableHead className="text-xs font-bold text-slate-700 whitespace-nowrap text-center">R</TableHead>
                  <TableHead className="text-xs font-bold text-slate-700 whitespace-nowrap text-center">O</TableHead>
                  <TableHead className="text-xs font-bold text-slate-700 whitespace-nowrap text-center">W</TableHead>
                  <TableHead className="text-xs font-bold text-slate-700 whitespace-nowrap text-center">T</TableHead>
                  <TableHead className="text-xs font-bold text-slate-700 whitespace-nowrap text-center">H</TableHead>
                  <TableHead className="text-xs font-bold text-slate-700 whitespace-nowrap text-center">Total</TableHead>
                  <TableHead className="text-xs font-bold text-slate-700 whitespace-nowrap px-6 py-3">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historyData.map((item) => (
                  <TableRow key={item.id} className="border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900">{item.month} {item.year}</span>
                        <span className="text-[10px] text-slate-600">{format(new Date(item.awardedAt), "MMM d, yyyy")}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-sm font-semibold text-slate-900">{item.G}</TableCell>
                    <TableCell className="text-center text-sm font-semibold text-slate-900">{item.R}</TableCell>
                    <TableCell className="text-center text-sm font-semibold text-slate-900">{item.O}</TableCell>
                    <TableCell className="text-center text-sm font-semibold text-slate-900">{item.W}</TableCell>
                    <TableCell className="text-center text-sm font-semibold text-slate-900">{item.T}</TableCell>
                    <TableCell className="text-center text-sm font-semibold text-slate-900">{item.H}</TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-md bg-[var(--brand-light-green)] text-[var(--brand-mid)] border border-[var(--brand-green)]/20">
                        {item.totalPoints}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-slate-800 max-w-[200px] truncate" title={item.description}>
                      {item.description}
                    </TableCell>
                   
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-700">
            <p className="text-sm font-medium">No growth history found for this period.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
