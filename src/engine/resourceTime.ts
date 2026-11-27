const ISO_TIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,9}))?(Z|([+-])(\d{2}):(\d{2}))$/;

interface ParsedIsoTime {
  /** UTC instant at the start of the represented second, in integer milliseconds. */
  epochSecondMilliseconds: number;
  /** Fractional second retained independently, at the accepted nanosecond precision. */
  fractionNanoseconds: number;
}

function parseIsoTime(value: unknown): ParsedIsoTime | undefined {
  if (typeof value !== "string") return undefined;
  const match = value.match(ISO_TIME_PATTERN);
  if (!match) return undefined;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = Number(match[6]);
  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const monthDays = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > monthDays[month - 1] ||
      hour > 23 || minute > 59 || second > 59) return undefined;
  if (match[8] !== "Z") {
    const offsetHour = Number(match[10]);
    const offsetMinute = Number(match[11]);
    if (offsetHour > 23 || offsetMinute > 59) return undefined;
  }

  // Date.parse resolves the calendar date and explicit UTC offset, but discards
  // fractional precision below milliseconds. Parse only the whole second and
  // retain the original fractional second separately for exact comparisons.
  const wholeSecondTimestamp = value.replace(/\.\d{1,9}(?=Z|[+-]\d{2}:\d{2}$)/, "");
  const epochSecondMilliseconds = Date.parse(wholeSecondTimestamp);
  if (!Number.isSafeInteger(epochSecondMilliseconds)) return undefined;

  return {
    epochSecondMilliseconds,
    fractionNanoseconds: Number((match[7] ?? "").padEnd(9, "0"))
  };
}

export function isIsoTime(value: unknown): value is string {
  return parseIsoTime(value) !== undefined;
}

export function compareIsoTimes(left: string, right: string): number {
  const leftInstant = parseIsoTime(left);
  const rightInstant = parseIsoTime(right);
  if (!leftInstant || !rightInstant) {
    throw new Error("ISO timestamps must be validated before comparison.");
  }
  if (leftInstant.epochSecondMilliseconds !== rightInstant.epochSecondMilliseconds) {
    return leftInstant.epochSecondMilliseconds < rightInstant.epochSecondMilliseconds ? -1 : 1;
  }
  if (leftInstant.fractionNanoseconds === rightInstant.fractionNanoseconds) return 0;
  return leftInstant.fractionNanoseconds < rightInstant.fractionNanoseconds ? -1 : 1;
}
