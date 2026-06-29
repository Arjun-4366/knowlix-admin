"use client";

import { Users, UserCheck, Shield, FileMinus } from "lucide-react";
import DashboardStatCard from "@/components/dashboard/shared/DashboardStatCard";

interface EmployeeStatsProps {
  totalCount: number;
  activeCount: number;
  probationCount: number;
  departedCount: number;
  activeFilter: string;
}

export default function EmployeeStats({
  totalCount,
  activeCount,
  probationCount,
  departedCount,
  activeFilter,
}: EmployeeStatsProps) {
  const isFiltered = activeFilter !== "all";

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <DashboardStatCard
        label="Total Strength"
        value={totalCount}
        icon={<Users className="w-6 h-6 text-[var(--brand-green)]" />}
        footerText={isFiltered ? "Apply no filter to see total" : "Registered in directory"}
      />

      <DashboardStatCard
        label="Active Staff"
        value={activeCount}
        icon={<UserCheck className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Perm"
        footerText={activeFilter === "approved" ? "Regular operations" : "Filter by 'Approved' to see count"}
      />

      <DashboardStatCard
        label="On Probation"
        value={probationCount}
        icon={<Shield className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Review"
        footerText={activeFilter === "pending" ? "Performance tracking" : "Filter by 'Pending' to see count"}
      />

      <DashboardStatCard
        label="Exit Records"
        value={departedCount}
        icon={<FileMinus className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Inactive"
        footerText={
          activeFilter === "inactive" || activeFilter === "resigned"
            ? "Resigned & Terminated"
            : "Filter by 'Inactive/Resigned' to see count"
        }
      />
    </div>
  );
}
