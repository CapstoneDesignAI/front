export function formatAcquiredDate(date?: string) {
  if (!date) {
    return undefined;
  }

  const dateMatch = date.match(/^(\d{4})[-./](\d{1,2})[-./](\d{1,2})/);

  if (dateMatch) {
    const [, year, month, day] = dateMatch;

    return `${year}.${month.padStart(2, "0")}.${day.padStart(2, "0")}`;
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Asia/Seoul",
    })
    .replace(/\.$/, "")
    .replaceAll(". ", ".");
}
