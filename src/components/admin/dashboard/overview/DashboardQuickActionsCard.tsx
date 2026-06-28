import { ArrowRight } from "lucide-react";

interface DashboardQuickActionsCardProps {
  onAddStudent: () => void;
  onAddTutor: () => void;
  onAssignTutor: () => void;
}

const actionItems = [
  { label: "Add New Student", action: "student" as const },
  { label: "Add New Tutor", action: "tutor" as const },
  { label: "Assign Tutor to Student", action: "assign" as const },
];

export default function DashboardQuickActionsCard({
  onAddStudent,
  onAddTutor,
  onAssignTutor,
}: DashboardQuickActionsCardProps) {
  const handleActionClick = (action: (typeof actionItems)[number]["action"]) => {
    if (action === "student") {
      onAddStudent();
      return;
    }

    if (action === "tutor") {
      onAddTutor();
      return;
    }

    onAssignTutor();
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="border-b border-slate-50 bg-slate-50/20 px-6 py-5">
        <h2 className="text-md font-bold text-slate-800">Quick Actions</h2>
        <p className="mt-0.5 text-xs text-slate-600">
          Frequent administrative shortcuts
        </p>
      </div>

      <div className="space-y-3 p-5">
        {actionItems.map((item) => (
          <button
            key={item.label}
            onClick={() => handleActionClick(item.action)}
            className="group flex w-full items-center justify-between rounded-xl border border-slate-150 p-3.5 text-left text-sm font-semibold text-slate-700 transition-all hover:border-[var(--brand-green)]/40 hover:bg-slate-50/30 hover:text-[var(--brand-green)]"
          >
            <span>{item.label}</span>
            <ArrowRight className="h-4 w-4 text-slate-600 transition-all group-hover:translate-x-0.5 group-hover:text-[var(--brand-green)]" />
          </button>
        ))}
      </div>
    </div>
  );
}
