import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  onBack?: () => void;
  backText?: string;
  actions?: ReactNode;
}

export default function DashboardHeader({
  title,
  description,
  onBack,
  backText = "Back to Dashboard",
  actions,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-5">
      <div>
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> {backText}
          </button>
        )}
        <h1 className="text-2xl font-bold font-heading text-slate-850">{title}</h1>
        {description && <p className="text-sm text-slate-600 mt-1">{description}</p>}
      </div>
      {actions && <div className="relative max-w-xs w-full md:w-auto">{actions}</div>}
    </div>
  );
}
