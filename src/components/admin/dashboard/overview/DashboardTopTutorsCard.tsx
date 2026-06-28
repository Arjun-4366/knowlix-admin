import Image from "next/image";
import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ITopTutor } from "@/types/admin/dashboard";

interface DashboardTopTutorsCardProps {
  tutors: ITopTutor[];
  onTutorSelect: (tutor: ITopTutor) => void;
}

const formatTutorRole = (role: string) =>
  role
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const getTutorStatus = (tutor: ITopTutor) => {
  if (tutor.growthPoints >= 40 || tutor.performanceScore >= 80) {
    return {
      label: "Outstanding",
      className: "border-green-200 bg-green-50 text-green-700",
    };
  }

  if (tutor.growthPoints >= 10 || tutor.performanceScore >= 40) {
    return {
      label: "Active",
      className: "border-blue-200 bg-blue-50 text-blue-700",
    };
  }

  return {
    label: "Needs Attention",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  };
};

export default function DashboardTopTutorsCard({
  tutors,
  onTutorSelect,
}: DashboardTopTutorsCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-50 bg-slate-50/20 px-6 py-5">
        <div>
          <h2 className="text-md font-bold text-slate-800">Top Tutors</h2>
          <p className="mt-0.5 text-xs text-slate-600">
            Ranked using growth points and performance score
          </p>
        </div>
        <Badge
          variant="outline"
          className="rounded-full border-green-200 bg-green-50 px-2 py-0.5 text-[10px] font-bold uppercase text-green-700"
        >
          Leaderboard
        </Badge>
      </div>

      {tutors.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-100 bg-slate-50/50">
                <TableHead className="w-16 px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600">
                  Rank
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-600">
                  Tutor
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-600">
                  Role
                </TableHead>
                <TableHead className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600">
                  Growth Points
                </TableHead>
                <TableHead className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600">
                  Performance Score
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-600">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {tutors.map((tutor) => {
                const status = getTutorStatus(tutor);

                return (
                  <TableRow
                    key={tutor.id}
                    onClick={() => onTutorSelect(tutor)}
                    className="cursor-pointer transition-colors hover:bg-slate-50/60"
                  >
                    <TableCell className="px-6 py-4 text-center text-sm font-bold text-slate-600">
                      <span
                        className={cn(
                          "inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold",
                          tutor.rank === 1 && "border-amber-200 bg-amber-50 text-amber-800",
                          tutor.rank === 2 && "border-slate-200 bg-slate-100 text-slate-800",
                          tutor.rank === 3 && "border-orange-200 bg-orange-50 text-orange-800",
                          tutor.rank > 3 && "text-slate-600"
                        )}
                      >
                        {tutor.rank}
                      </span>
                    </TableCell>

                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {tutor.profileImage ? (
                          <Image
                            src={tutor.profileImage}
                            alt={tutor.name}
                            width={36}
                            height={36}
                            className="h-9 w-9 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-light-green)] text-sm font-bold text-[var(--brand-green)]">
                            {tutor.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {tutor.name}
                          </p>
                          <p className="text-xs text-slate-600">{tutor.id}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-4 text-sm text-slate-600">
                      {formatTutorRole(tutor.role)}
                    </TableCell>

                    <TableCell className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                      {tutor.growthPoints}
                    </TableCell>

                    <TableCell className="px-6 py-4 text-center text-sm font-semibold text-[var(--brand-green)]">
                      {tutor.performanceScore}
                    </TableCell>

                    <TableCell className="px-6 py-4 text-sm">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                          status.className
                        )}
                      >
                        {status.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">
              No tutor ranking data available
            </p>
            <p className="mt-1 text-xs text-slate-600">
              This section will populate once tutor performance data is returned by the dashboard API.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
