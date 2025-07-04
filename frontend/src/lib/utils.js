import { format, isToday, isYesterday } from "date-fns";

/**
 * Returns a human-readable time format:
 * - Today at 3:45 PM
 * - Yesterday at 11:00 AM
 * - 22 Jun 2025, 5:12 PM
 */
export function formatMessageTime(dateString) {
  const date = new Date(dateString);

  if (isToday(date)) {
    return `Today at ${format(date, "h:mm a")}`;
  } else if (isYesterday(date)) {
    return `Yesterday at ${format(date, "h:mm a")}`;
  } else {
    return format(date, "dd MMM yyyy, h:mm a");
  }
}
