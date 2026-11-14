import { describe, expect, it } from "vitest";
import { assessReservationExpiry, type ReservationExpiryInput } from "./reservationExpiry";

const input = (overrides: Partial<ReservationExpiryInput> = {}): ReservationExpiryInput => ({
  reservationId: "reservation-1",
  expiryUnixMs: 2_000,
  evaluationTimeUnixMs: 2_001,
  ...overrides
});

describe("Arcane Incantations v1.9 reservation expiry assessment", () => {
  it("[RES19-EXPIRY-001] does not classify a reservation as expired before its declared expiry", () => {
    expect(assessReservationExpiry(input({ evaluationTimeUnixMs: 1_999 }))).toMatchObject({
      outcome: "NOT-REACHED",
      ledgerEffect: "UNCHANGED"
    });
    expect(assessReservationExpiry(input({
      evaluationTimeUnixMs: 1_999,
      evidence: { basis: "CONTRACTUALLY-GUARANTEED", contractRef: "expiry-contract:v1" }
    }))).toMatchObject({
      outcome: "NOT-REACHED",
      ledgerEffect: "UNCHANGED"
    });
  });

  it("[RES19-EXPIRY-002] leaves the exact expiry boundary unresolved", () => {
    expect(assessReservationExpiry(input({
      evaluationTimeUnixMs: 2_000,
      evidence: { basis: "CONTRACTUALLY-GUARANTEED", contractRef: "expiry-contract:v1" }
    }))).toMatchObject({
      outcome: "RESOURCE-OUTCOME-UNKNOWN",
      diagnostic: { code: "RESERVATION-EXPIRY-BOUNDARY-UNSPECIFIED" },
      ledgerEffect: "UNCHANGED"
    });
  });

  it("[RES19-EXPIRY-003] does not infer expiry from elapsed time alone", () => {
    expect(assessReservationExpiry(input({ evaluationTimeUnixMs: 2_001 }))).toMatchObject({
      outcome: "RESOURCE-OUTCOME-UNKNOWN",
      diagnostic: { code: "RESERVATION-EXPIRY-EVIDENCE-UNAVAILABLE" },
      ledgerEffect: "UNCHANGED"
    });
  });

  it("[RES19-EXPIRY-004] accepts an observed expiry reference after the declared expiry", () => {
    expect(assessReservationExpiry(input({
      evaluationTimeUnixMs: 2_001,
      evidence: { basis: "OBSERVED", evidenceRef: "expiry-observation:42" }
    }))).toEqual({
      outcome: "RESERVATION-EXPIRED",
      reservationId: "reservation-1",
      evidenceBasis: "OBSERVED",
      evidenceReference: "expiry-observation:42",
      ledgerEffect: "UNCHANGED"
    });
  });

  it("[RES19-EXPIRY-005] accepts a contractual guarantee reference after the declared expiry", () => {
    expect(assessReservationExpiry(input({
      evaluationTimeUnixMs: 2_001,
      evidence: { basis: "CONTRACTUALLY-GUARANTEED", contractRef: "reservation-contract:v2" }
    }))).toMatchObject({
      outcome: "RESERVATION-EXPIRED",
      evidenceBasis: "CONTRACTUALLY-GUARANTEED",
      evidenceReference: "reservation-contract:v2",
      ledgerEffect: "UNCHANGED"
    });
  });

  it("[RES19-EXPIRY-006] rejects contradictory and malformed expiry evidence", () => {
    expect(assessReservationExpiry(input({
      evaluationTimeUnixMs: 1_999,
      evidence: { basis: "OBSERVED", evidenceRef: "expired-observation:before-deadline" }
    }))).toMatchObject({
      outcome: "RESOURCE-OUTCOME-UNKNOWN",
      diagnostic: { code: "RESERVATION-EXPIRY-EVIDENCE-CONFLICT" }
    });
    expect(assessReservationExpiry(input({ expiryUnixMs: 2_000.5 }))).toMatchObject({
      outcome: "RESOURCE-OUTCOME-UNKNOWN",
      diagnostic: { code: "RESERVATION-EXPIRY-INPUT-MALFORMED" }
    });
    expect(assessReservationExpiry(input({
      evidence: { basis: "OBSERVED", evidenceRef: " " }
    }))).toMatchObject({
      outcome: "RESOURCE-OUTCOME-UNKNOWN",
      diagnostic: { code: "RESERVATION-EXPIRY-INPUT-MALFORMED" }
    });
    expect(assessReservationExpiry(input({ reservationId: " " }))).toMatchObject({
      outcome: "RESOURCE-OUTCOME-UNKNOWN",
      diagnostic: { code: "RESERVATION-EXPIRY-INPUT-MALFORMED" }
    });
  });
});
