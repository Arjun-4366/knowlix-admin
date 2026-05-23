import { format, parseISO } from "date-fns";

export function formatDateLabel(value: string) {
  return format(parseISO(value), "dd MMM yyyy");
}

export function formatScore(value: number) {
  return `${value.toFixed(1)}/5`;
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
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
