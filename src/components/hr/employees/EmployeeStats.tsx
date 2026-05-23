"use client";

import { Users, UserCheck, Shield, FileMinus } from "lucide-react";
import DashboardStatCard from "@/components/dashboard/shared/DashboardStatCard";

interface EmployeeStatsProps {
  totalCount: number;
  activeCount: number;
  probationCount: number;
  departedCount: number;
}

export default function EmployeeStats({
  totalCount,
  activeCount,
  probationCount,
  departedCount,
}: EmployeeStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <DashboardStatCard
        label="Total Strength"
        value={totalCount}
        icon={<Users className="w-6 h-6 text-[var(--brand-green)]" />}
        footerText="Registered in directory"
      />

      <DashboardStatCard
        label="Active Staff"
        value={activeCount}
        icon={<UserCheck className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Perm"
        footerText="Regular operations"
      />

      <DashboardStatCard
        label="On Probation"
        value={probationCount}
        icon={<Shield className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Review"
        footerText="Performance tracking"
      />

      <DashboardStatCard
        label="Exit Records"
        value={departedCount}
        icon={<FileMinus className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Inactive"
        footerText="Resigned & Terminated"
      />
    </div>
  );
}

