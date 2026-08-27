// Convert a 24h "HH:mm" (from <input type="time">) to "hh:mm AM/PM" (API format)
export function to12Hour(time24: string): string {
  if (!time24) return "";
  const [hStr, mStr] = time24.split(":");
  let h = parseInt(hStr, 10);
  const period = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${String(h).padStart(2, "0")}:${mStr} ${period}`;
}

// Convert "hh:mm AM/PM" (API format) back to 24h "HH:mm" (for <input type="time">)
export function to24Hour(time12: string): string {
  if (!time12) return "";
  const match = time12.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return "";
  let [, hStr, mStr, period] = match;
  let h = parseInt(hStr, 10);
  if (period.toUpperCase() === "PM" && h !== 12) h += 12;
  if (period.toUpperCase() === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${mStr}`;
}
