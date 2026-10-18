export interface KillSwitchData {
  eventTitle: string;
  suggestedAlertDate: string; // ISO 8601 string
  alertMinutesBefore?: number;
  eventDescription: string;
}

function formatDateToICS(isoString: string): string {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    // Fallback to now + 2 days if parsing fails
    const fallback = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    return fallback.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  }
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export function generateICSContent(data: KillSwitchData): string {
  const dtStart = formatDateToICS(data.suggestedAlertDate);
  // End date 30 minutes after start
  const endDate = new Date(new Date(data.suggestedAlertDate).getTime() + 30 * 60 * 1000);
  const dtEnd = formatDateToICS(endDate.toISOString());
  const dtStamp = formatDateToICS(new Date().toISOString());
  const uid = `canceltrap-${Date.now()}-${Math.random().toString(36).substring(2, 9)}@canceltrap.app`;
  const minutesBefore = data.alertMinutesBefore || 120;

  // Escape special characters per RFC 5545
  const cleanSummary = data.eventTitle.replace(/[,;\\]/g, " ");
  const cleanDescription = data.eventDescription.replace(/\n/g, "\\n").replace(/[,;\\]/g, " ");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CancelTrap//KillSwitch v1.0//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${cleanSummary}`,
    `DESCRIPTION:${cleanDescription}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    `TRIGGER:-PT${minutesBefore}M`,
    "ACTION:DISPLAY",
    `DESCRIPTION:${cleanSummary}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadKillSwitchIcs(data: KillSwitchData, filename = "kill-switch.ics"): void {
  const icsText = generateICSContent(data);
  const blob = new Blob([icsText], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
