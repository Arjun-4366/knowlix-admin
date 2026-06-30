"use client";

import { Users, UserCheck, Shield, FileMinus } from "lucide-react";
import DashboardStatCard from "@/components/dashboard/shared/DashboardStatCard";
import { ITutorSummary } from "@/types/admin/tutor";

interface EmployeeStatsProps {
  summary?: ITutorSummary;
}

export default function EmployeeStats({ summary }: EmployeeStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <DashboardStatCard
        label="Total Strength"
        value={summary?.total ?? 0}
        icon={<Users className="w-6 h-6 text-[var(--brand-green)]" />}
        footerText="Registered in directory"
      />

      <DashboardStatCard
        label="Active Staff"
        value={summary?.approved ?? 0}
        icon={<UserCheck className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Approved"
        footerText="Regular operations"
      />

      <DashboardStatCard
        label="Pending Approval"
        value={summary?.pending ?? 0}
        icon={<Shield className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Pending"
        footerText="Awaiting approval"
      />

      <DashboardStatCard
        label="Exit Records"
        value={(summary?.inactive ?? 0) + (summary?.resigned ?? 0)}
        icon={<FileMinus className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Inactive"
        footerText="Resigned & Terminated"
      />
    </div>
  );
}
