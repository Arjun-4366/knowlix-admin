"use client";

import { useEffect, useState } from "react";
import { Check, Search } from "lucide-react";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetTutors } from "@/querys/admin/tutorQuery";
import { cn } from "@/lib/utils";

interface TutorSearchSelectProps {
  value: string;
  label?: string;
  onChange: (id: string, name: string) => void;
  placeholder?: string;
}

export default function TutorSearchSelect({
  value,
  label,
  onChange,
  placeholder = "Search tutor by name...",
}: TutorSearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(label ?? "");
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    setQuery(label ?? "");
  }, [label]);

  const { data, isLoading } = useGetTutors({ search: debouncedQuery || undefined, limit: 20 });
  const tutors = data?.data ?? [];

  const handleSelect = (id: string, name: string) => {
    onChange(id, name);
    setQuery(name);
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setQuery(next);
    setOpen(true);
    if (value && next !== label) onChange("", "");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={handleInputChange}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            autoComplete="off"
            className="h-10 pl-9 text-xs"
          />
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
          ) : tutors.length === 0 ? (
            <p className="px-3 py-4 text-center text-xs text-slate-600">No tutors found</p>
          ) : (
            tutors.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleSelect(t.id, t.name)}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors hover:bg-slate-100",
                  value === t.id && "bg-[var(--brand-light-green)]/40 text-[var(--brand-mid)]",
                )}
              >
                <span className="truncate">{t.name}</span>
                {value === t.id && <Check className="h-3.5 w-3.5 flex-shrink-0" />}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
