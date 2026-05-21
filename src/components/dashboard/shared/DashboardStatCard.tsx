import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardStatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  badgeText?: string;
  badgeClassName?: string;
  gradientClass: string; // e.g. "from-teal-500 to-emerald-500"
  iconBgClass: string; // e.g. "bg-teal-50 text-teal-600"
  footerText?: string;
  footerLink?: boolean;
  footerClassName?: string;
  onClick?: () => void;
}

export default function DashboardStatCard({
  label,
  value,
  icon,
  badgeText,
  badgeClassName,
  gradientClass,
  iconBgClass,
  footerText,
  footerLink = false,
  footerClassName,
  onClick,
}: DashboardStatCardProps) {
  const isClickable = !!onClick;
  const Component = isClickable ? "button" : "div";

  return (
    <Component
      onClick={onClick}
      className={cn(
        "w-full text-left bg-white rounded-2xl border border-slate-100 p-5 flex flex-col justify-between relative overflow-hidden",
        isClickable && "hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
      )}
    >
      {/* Top Accent Gradient Border */}
      <div className={cn("absolute top-0 left-0 w-full h-1 bg-gradient-to-r", gradientClass)} />
      
      <div className="flex items-center justify-between mb-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300",
          iconBgClass,
          isClickable && "group-hover:scale-110"
        )}>
          {icon}
        </div>
        {badgeText && (
          <span className={cn(
            "text-xs font-semibold px-2.5 py-1 rounded-full border",
            badgeClassName
          )}>
            {badgeText}
          </span>
        )}
      </div>

      <div>
        <p className="text-3xl font-bold font-heading text-slate-800">{value}</p>
        <p className="text-sm font-semibold text-slate-650 mt-1">{label}</p>
        
        {footerText && (
          <p className={cn(
            "text-xs mt-3 flex items-center gap-1 transition-transform",
            footerClassName,
            isClickable && footerLink && "group-hover:translate-x-1"
          )}>
            {footerText}
            {isClickable && footerLink && <ChevronRight className="w-3 h-3" />}
          </p>
        )}
      </div>
    </Component>
  );
}
