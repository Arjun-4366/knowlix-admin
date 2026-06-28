import {
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
} from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardStatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  badgeText?: string;
  footerText?: string;
  footerLink?: boolean;
  onClick?: () => void;
}

export default function DashboardStatCard({
  label,
  value,
  icon,
  badgeText,
  footerText,
  footerLink = false,
  onClick,
}: DashboardStatCardProps) {
  const isClickable = !!onClick;
  const Component = isClickable ? "button" : "div";
  const normalizedIcon = isValidElement<{ className?: string }>(icon)
    ? cloneElement(icon as ReactElement<{ className?: string }>, {
        className: cn(icon.props.className, "text-[var(--brand-green)]"),
      })
    : icon;
  const footerToneClass =
    isClickable && footerLink
      ? "text-[var(--brand-green)] font-semibold"
      : "text-slate-600 font-semibold";

  return (
    <Component
      onClick={onClick}
      className={cn(
        "w-full text-left bg-white rounded-2xl border border-slate-100 p-5 flex flex-col justify-between relative overflow-hidden",
        isClickable && "hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
      )}
    >
      {/* Top Accent Gradient Border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--brand-green)] to-[var(--brand-light)]" />
      
      <div className="flex items-center justify-between mb-4">
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center bg-[var(--brand-light-green)] text-[var(--brand-green)] transition-transform duration-300",
            isClickable && "group-hover:scale-110"
          )}
        >
          {normalizedIcon}
        </div>
        {badgeText && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20">
            {badgeText}
          </span>
        )}
      </div>

      <div>
        <p className="text-3xl font-bold font-heading text-slate-800">{value}</p>
        <p className="text-sm font-semibold text-slate-650 mt-1">{label}</p>
        
        {footerText && (
          <p
            className={cn(
              "text-xs mt-3 flex items-center gap-1 transition-transform",
              footerToneClass,
              isClickable && footerLink && "group-hover:translate-x-1"
            )}
          >
            {footerText}
            {isClickable && footerLink && <ChevronRight className="w-3 h-3" />}
          </p>
        )}
      </div>
    </Component>
  );
}
