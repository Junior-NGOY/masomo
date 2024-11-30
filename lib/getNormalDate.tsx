/* export function getNormalDate(inputDate: Date | string): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    inputDate
  );

  // Add ordinal suffix to the day
  const day = inputDate.getDate();
  const suffix =
    day === 1 || day === 21 || day === 31
      ? "st"
      : day === 2 || day === 22
      ? "nd"
      : day === 3 || day === 23
      ? "rd"
      : "th";
  return formattedDate.replace(/\b(\d{1,2})\b/, `$1${suffix}`);
} */

export function getNormalDate(inputDate: string | Date): string {
  // Convert string to Date if necessary
  const date: Date =
    typeof inputDate === "string" ? new Date(inputDate) : inputDate;

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date input");
  }

  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  // Add ordinal suffix to the day
  const day = date.getDate();
  const suffix =
    day === 1 || day === 21 || day === 31
      ? "st"
      : day === 2 || day === 22
      ? "nd"
      : day === 3 || day === 23
      ? "rd"
      : "th";
  return formattedDate.replace(/\b(\d{1,2})\b/, `$1${suffix}`);
}
