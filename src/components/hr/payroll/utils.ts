import { format, parse, parseISO } from "date-fns";

const rupeeFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const compactRupeeFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatCurrency(value: number) {
  return rupeeFormatter.format(value);
}

export function formatCompactCurrency(value: number) {
  return compactRupeeFormatter.format(value);
}

export function formatPayrollMonth(month: string) {
  return format(parse(month, "yyyy-MM", new Date()), "MMMM yyyy");
}

export function formatDateLabel(value: string) {
  return format(parseISO(value), "dd MMM yyyy");
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
