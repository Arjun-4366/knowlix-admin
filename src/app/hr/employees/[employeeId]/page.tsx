"use client";

import { useParams } from "next/navigation";
import EmployeeDetailsPage from "@/components/hr/employees/EmployeeDetailsPage";

export default function HREmployeeDetailRoute() {
  const params = useParams();
  const employeeIdParam = params.employeeId;
  const employeeId = Array.isArray(employeeIdParam)
    ? employeeIdParam[0]
    : employeeIdParam;

  return <EmployeeDetailsPage employeeId={employeeId ? decodeURIComponent(employeeId) : ""} />;
}
