/** Datas de calendário são representadas sem UTC nem conversão de dia por fuso horário. */
export function parseDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]); const month = Number(match[2]); const day = Number(match[3]);
  if (year < 1) return null;
  const result = new Date(2000, month - 1, day, 12, 0, 0, 0); result.setFullYear(year);
  return result.getFullYear() === year && result.getMonth() === month - 1 && result.getDate() === day ? result : null;
}
export function formatDate(value: Date): string {
  return `${String(value.getFullYear()).padStart(4, '0')}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
}
export function displayDate(value: string): string { const [y, m, d] = value.split('-'); return `${d}/${m}/${y}`; }
export function isTime(value: string): boolean { return /^([01]\d|2[0-3]):[0-5]\d$/.test(value); }
export function formatTime(value: Date): string { return `${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}`; }
export function timeDate(value: string | null): Date {
  const date = new Date(); const [hours, minutes] = (value ?? '12:00').split(':').map(Number);
  date.setHours(hours, minutes, 0, 0); return date;
}
