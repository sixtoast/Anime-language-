import { describe, expect, it } from "vitest";
import { compareIsoTimes, isIsoTime } from "./resourceTime";

describe("v1.9 shared resource timestamp primitives", () => {
  it("[RES19-TIME-002] validates Gregorian calendar and clock fields", () => {
    for (const timestamp of [
      "2000-02-29T00:00:00Z",
      "2024-02-29T23:59:59Z",
      "2026-03-01T00:00:00Z"
    ]) {
      expect(isIsoTime(timestamp), timestamp).toBe(true);
    }

    for (const timestamp of [
      "0000-01-01T00:00:00Z",
      "1900-02-29T00:00:00Z",
      "2026-02-29T00:00:00Z",
      "2100-02-29T00:00:00Z",
      "2026-04-31T00:00:00Z",
      "2026-13-01T00:00:00Z",
      "2026-00-01T00:00:00Z",
      "2026-01-01T24:00:00Z",
      "2026-01-01T00:60:00Z",
      "2026-01-01T00:00:60Z"
    ]) {
      expect(isIsoTime(timestamp), timestamp).toBe(false);
    }
  });

  it("[RES19-TIME-003] enforces the supported explicit-offset and fractional syntax", () => {
    for (const timestamp of [
      "2026-01-01T00:00:00Z",
      "2026-01-01T00:00:00.1Z",
      "2026-01-01T00:00:00.123456789Z",
      "2026-01-01T00:00:00+02:00",
      "2026-01-01T00:00:00-05:30"
    ]) {
      expect(isIsoTime(timestamp), timestamp).toBe(true);
    }

    for (const timestamp of [
      "2026-01-01T00:00:00",
      "2026-01-01t00:00:00Z",
      "2026-01-01T00:00:00z",
      "2026-01-01T00:00:00.1234567890Z",
      "2026-01-01T00:00:00+24:00",
      "2026-01-01T00:00:00+00:60",
      "2026-01-01T00:00:00+0200"
    ]) {
      expect(isIsoTime(timestamp), timestamp).toBe(false);
    }
  });

  it("[RES19-TIME-004] compares offset-equivalent instants across UTC date rollovers", () => {
    expect(compareIsoTimes(
      "2026-01-01T00:30:00.123456789+02:00",
      "2025-12-31T22:30:00.123456789Z"
    )).toBe(0);

    expect(compareIsoTimes(
      "2025-12-31T23:59:59.999999999Z",
      "2026-01-01T00:00:00.000000000Z"
    )).toBe(-1);

    expect(compareIsoTimes(
      "2026-01-01T00:00:00.000000001Z",
      "2026-01-01T00:00:00.000000002Z"
    )).toBe(-1);
    expect(compareIsoTimes(
      "2026-01-01T00:00:00.000000002Z",
      "2026-01-01T00:00:00.000000001Z"
    )).toBe(1);
    expect(() => compareIsoTimes("not-a-time", "2026-01-01T00:00:00Z"))
      .toThrow("ISO timestamps must be validated before comparison.");
  });
});
