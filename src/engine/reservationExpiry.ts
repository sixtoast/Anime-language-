/**
 * Bounded v1.9 reservation-expiry assessment.
 *
 * This evaluates only whether the declared expiry has been reached and whether
 * caller-supplied enforcement evidence is present. It does not authenticate
 * references, resolve reservation state, apply a release policy, release a
 * hold, or change ledger availability.
 *
 * Timestamps use integer Unix milliseconds as an implementation encoding;
 * this is not a new canonical time or expiry rule.
 */
export type ReservationExpiryEvidence =
  | { basis: "OBSERVED"; evidenceRef: string }
  | { basis: "CONTRACTUALLY-GUARANTEED"; contractRef: string };

export interface ReservationExpiryInput {
  reservationId: string;
  expiryUnixMs: number;
  evaluationTimeUnixMs: number;
  evidence?: ReservationExpiryEvidence;
}

export type ReservationExpiryDiagnosticCode =
  | "RESERVATION-EXPIRY-INPUT-MALFORMED"
  | "RESERVATION-EXPIRY-BOUNDARY-UNSPECIFIED"
  | "RESERVATION-EXPIRY-EVIDENCE-UNAVAILABLE"
  | "RESERVATION-EXPIRY-EVIDENCE-CONFLICT";

export interface ReservationExpiryDiagnostic {
  code: ReservationExpiryDiagnosticCode;
  message: string;
}

export type ReservationExpiryAssessment =
  | {
      outcome: "NOT-REACHED";
      reservationId: string;
      ledgerEffect: "UNCHANGED";
    }
  | {
      outcome: "RESERVATION-EXPIRED";
      reservationId: string;
      evidenceBasis: ReservationExpiryEvidence["basis"];
      evidenceReference: string;
      ledgerEffect: "UNCHANGED";
    }
  | {
      outcome: "RESOURCE-OUTCOME-UNKNOWN";
      reservationId?: string;
      diagnostic: ReservationExpiryDiagnostic;
      ledgerEffect: "UNCHANGED";
    };

const unknown = (
  reservationId: string | undefined,
  code: ReservationExpiryDiagnosticCode,
  message: string
): ReservationExpiryAssessment => ({
  outcome: "RESOURCE-OUTCOME-UNKNOWN",
  ...(reservationId ? { reservationId } : {}),
  diagnostic: { code, message },
  ledgerEffect: "UNCHANGED"
});

/**
 * Assesses reservation expiry without mutating a reservation or ledger.
 *
 * A timestamp strictly after expiry is not sufficient by itself: the caller
 * must also supply an observed-expiry reference or a contractual-guarantee
 * reference. Equality is unresolved because v1.9 does not define endpoint
 * inclusivity. An observed-expired claim before the declared expiry is
 * contradictory and remains unresolved.
 */
export function assessReservationExpiry(
  input: ReservationExpiryInput
): ReservationExpiryAssessment {
  if (!input || typeof input !== "object") {
    return unknown(undefined, "RESERVATION-EXPIRY-INPUT-MALFORMED",
      "A reservation identity, expiry time and evaluation time are required.");
  }

  const reservationId = typeof input.reservationId === "string"
    ? input.reservationId.trim()
    : "";

  if (!reservationId ||
      !Number.isSafeInteger(input.expiryUnixMs) ||
      !Number.isSafeInteger(input.evaluationTimeUnixMs)) {
    return unknown(reservationId || undefined, "RESERVATION-EXPIRY-INPUT-MALFORMED",
      "A non-empty reservation ID and safe-integer Unix-millisecond expiry and evaluation times are required.");
  }

  let evidence: { basis: ReservationExpiryEvidence["basis"]; reference: string } | undefined;
  const rawEvidence: unknown = input.evidence;
  if (rawEvidence !== undefined) {
    if (!rawEvidence || typeof rawEvidence !== "object" || Array.isArray(rawEvidence)) {
      return unknown(reservationId, "RESERVATION-EXPIRY-INPUT-MALFORMED",
        "Expiry evidence must identify an observed expiry or a contractual guarantee with a non-empty reference.");
    }
    const candidate = rawEvidence as Record<string, unknown>;
    if (candidate.basis === "OBSERVED" &&
        typeof candidate.evidenceRef === "string" &&
        candidate.evidenceRef.trim()) {
      evidence = { basis: "OBSERVED", reference: candidate.evidenceRef.trim() };
    } else if (candidate.basis === "CONTRACTUALLY-GUARANTEED" &&
        typeof candidate.contractRef === "string" &&
        candidate.contractRef.trim()) {
      evidence = { basis: "CONTRACTUALLY-GUARANTEED", reference: candidate.contractRef.trim() };
    } else {
      return unknown(reservationId, "RESERVATION-EXPIRY-INPUT-MALFORMED",
        "Expiry evidence must identify an observed expiry or a contractual guarantee with a non-empty reference.");
    }
  }

  if (input.evaluationTimeUnixMs < input.expiryUnixMs) {
    if (evidence?.basis === "OBSERVED") {
      return unknown(reservationId, "RESERVATION-EXPIRY-EVIDENCE-CONFLICT",
        "Observed-expired evidence conflicts with an evaluation time before the declared expiry.");
    }
    return {
      outcome: "NOT-REACHED",
      reservationId,
      ledgerEffect: "UNCHANGED"
    };
  }

  if (input.evaluationTimeUnixMs === input.expiryUnixMs) {
    return unknown(reservationId, "RESERVATION-EXPIRY-BOUNDARY-UNSPECIFIED",
      "The evaluation time equals the declared expiry; v1.9 does not specify whether the expiry boundary is inclusive.");
  }

  if (!evidence) {
    return unknown(reservationId, "RESERVATION-EXPIRY-EVIDENCE-UNAVAILABLE",
      "Elapsed time alone cannot establish expiry without observed enforcement evidence or a contractual guarantee reference.");
  }

  return {
    outcome: "RESERVATION-EXPIRED",
    reservationId,
    evidenceBasis: evidence.basis,
    evidenceReference: evidence.reference,
    ledgerEffect: "UNCHANGED"
  };
}
