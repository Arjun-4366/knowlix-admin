"use client";

import { useState } from "react";
import { Check, Search, X } from "lucide-react";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetStudents } from "@/querys/admin/studentQuery";
import { cn } from "@/lib/utils";

interface StudentMultiSearchSelectProps {
  value: string[];
  labels?: string[];
  onChange: (ids: string[], names: string[]) => void;
  placeholder?: string;
}

export default function StudentMultiSearchSelect({
  value,
  labels,
  onChange,
  placeholder = "Search students by name...",
}: StudentMultiSearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedLabels, setSelectedLabels] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    value.forEach((id, i) => {
      if (labels?.[i]) map[id] = labels[i];
    });
    return map;
  });
  const debouncedQuery = useDebounce(query, 400);

  const { data, isLoading } = useGetStudents({ search: debouncedQuery || undefined, limit: 20 });
  const students = data?.data ?? [];

  const toggle = (id: string, name: string) => {
    const exists = value.includes(id);
    const nextIds = exists ? value.filter((v) => v !== id) : [...value, id];
    const nextLabels = { ...selectedLabels, [id]: name };
    setSelectedLabels(nextLabels);
    onChange(nextIds, nextIds.map((i) => nextLabels[i] ?? i));
    setQuery("");
  };

  const remove = (id: string) => {
    const nextIds = value.filter((v) => v !== id);
    onChange(nextIds, nextIds.map((i) => selectedLabels[i] ?? i));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className="space-y-1.5">
          {value.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {value.map((id) => (
                <span
                  key={id}
                  className="flex items-center gap-1 rounded-full bg-[var(--brand-light-green)] px-2.5 py-1 text-xs font-semibold text-[var(--brand-mid)]"
                >
                  {selectedLabels[id] ?? id}
                  <button
                    type="button"
                    onClick={() => remove(id)}
                    className="ml-0.5 rounded-full opacity-60 hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              placeholder={placeholder}
              autoComplete="off"
              className="h-10 pl-9 text-xs"
            />
          </div>
        </div>
      </PopoverAnchor>
      <PopoverContent
        className="w-(--radix-popper-anchor-width) p-1"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="max-h-[220px] overflow-y-auto">
          {isLoading ? (
            <p className="px-3 py-4 text-center text-xs text-slate-600">Loading...</p>
          ) : students.length === 0 ? (
            <p className="px-3 py-4 text-center text-xs text-slate-600">No students found</p>
          ) : (
            students.map((s) => {
              const selected = value.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggle(s.id, s.studentName)}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors hover:bg-slate-100",
                    selected && "bg-[var(--brand-light-green)]/40 text-[var(--brand-mid)]",
                  )}
                >
                  <span className="truncate">{s.studentName}</span>
                  {selected && <Check className="h-3.5 w-3.5 flex-shrink-0" />}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
