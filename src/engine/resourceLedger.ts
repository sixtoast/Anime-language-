/**
 * Pure, append-only v1.9 ledger projection.
 *
 * Uses integer accounting ticks under one explicitly declared unit contract.
 * This module is deliberately not a physical resource runtime: caller-supplied
 * evidence is not authenticated, and transformations/conservation laws are
 * not inferred.
 */
export type LedgerEventKind =
  | "SOURCE-ENTRY" | "TRANSFER" | "RESERVE" | "RESERVATION-RELEASE"
  | "CONSUME" | "MEASURED-RETURN" | "LOSS" | "CORRECTION"
  | "TRANSFORMATION-INPUT" | "TRANSFORMATION-OUTPUT" | "EXTERNAL-EXCHANGE"
  | "RECONCILIATION" | "OPENING";

export type LedgerEvidence = "PASS" | "FAIL" | "UNKNOWN" | "UNAVAILABLE";

export interface LedgerAccount {
  accountId: string;
  resourceKind: string;
  unit: string;
  unitContractId: string;
  openingBalanceTicks: number;
}

export interface LedgerEvent {
  eventId: string;
  invocationId: string;
  resourceKind: string;
  eventKind: LedgerEventKind;
  fromAccount?: string;
  toAccount?: string;
  amountTicks: number;
  unit: string;
  unitContractId: string;
  status: "REPORTED" | "CONFIRMED" | "REJECTED";
  evidence: LedgerEvidence;
  sourceOrConversionRef?: string;
  idempotencyKey: string;
  reservationId?: string;
  permittedLoss?: boolean;
  correctionReason?: string;
}

export interface LedgerReservation {
  reservationId: string;
  accountId: string;
  amountTicks: number;
  status: "HELD" | "PARTIALLY-CONSUMED" | "SETTLED" | "RELEASED";
}

export type LedgerIssueCode =
  | "ACCOUNT-DUPLICATE" | "ACCOUNT-MALFORMED" | "EVENT-MALFORMED"
  | "ACCOUNT-NOT-FOUND" | "RESOURCE-MISMATCH" | "UNIT-CONTRACT-MISMATCH"
  | "EVIDENCE-UNRESOLVED" | "EVIDENCE-FAILED" | "INSUFFICIENT-AVAILABLE"
  | "INSUFFICIENT-BALANCE" | "RESERVATION-INVALID" | "IDEMPOTENCY-COLLISION"
  | "EVENT-KIND-UNSUPPORTED" | "TRANSFER-INVALID" | "CORRECTION-UNSUPPORTED";

export interface LedgerIssue {
  eventId?: string;
  code: LedgerIssueCode;
  message: string;
}

export interface LedgerEventResult {
  eventId: string;
  applied: boolean;
  duplicate: boolean;
  issue?: LedgerIssue;
}

export interface LedgerProjection {
  outcome: "LEDGER-PROJECTED" | "LEDGER-PARTIAL" | "LEDGER-UNRESOLVED" | "LEDGER-MALFORMED";
  balances: Record<string, number>;
  reserved: Record<string, number>;
  available: Record<string, number>;
  reservations: LedgerReservation[];
  events: LedgerEventResult[];
  issues: LedgerIssue[];
  limitations: string[];
}

const LIMITATIONS = [
  "This is a deterministic ledger projection over caller-supplied records, not a trusted or distributed ledger.",
  "Amounts are integer ticks in one exact unit contract; no rounding or unit conversion is performed.",
  "Source evidence is accepted as a caller-supplied state and is not independently authenticated.",
  "Transformation, external exchange and general reconciliation events require dedicated contracts and are not applied here.",
  "A projected balance is not a physical measurement, conservation proof, execution report or verified effect."
];

const safeTicks = (n: number) => Number.isSafeInteger(n) && n >= 0;

export function projectResourceLedger(
  accounts: LedgerAccount[],
  events: LedgerEvent[]
): LedgerProjection {
  const balances: Record<string, number> = {};
  const reserved: Record<string, number> = {};
  const accountById = new Map<string, LedgerAccount>();
  const reservations = new Map<string, LedgerReservation>();
  const eventResults: LedgerEventResult[] = [];
  const issues: LedgerIssue[] = [];
  const seenIds = new Set<string>();
  const idempotency = new Map<string, string>();

  const issue = (eventId: string | undefined, code: LedgerIssueCode, message: string) => {
    const item: LedgerIssue = { ...(eventId ? { eventId } : {}), code, message };
    issues.push(item);
    return item;
  };

  for (const account of accounts) {
    if (!account.accountId?.trim() || !account.resourceKind?.trim() ||
        !account.unit?.trim() || !account.unitContractId?.trim() ||
        !safeTicks(account.openingBalanceTicks)) {
      issue(undefined, "ACCOUNT-MALFORMED", "Account identity, resource, unit contract and non-negative safe-integer opening balance are required.");
      continue;
    }
    if (accountById.has(account.accountId)) {
      issue(undefined, "ACCOUNT-DUPLICATE", "Account identifiers must be unique.");
      continue;
    }
    accountById.set(account.accountId, account);
    balances[account.accountId] = account.openingBalanceTicks;
    reserved[account.accountId] = 0;
  }

  const fingerprint = (event: LedgerEvent) => JSON.stringify({
    invocationId: event.invocationId, resourceKind: event.resourceKind,
    eventKind: event.eventKind, fromAccount: event.fromAccount ?? null,
    toAccount: event.toAccount ?? null, amountTicks: event.amountTicks,
    unit: event.unit, unitContractId: event.unitContractId,
    status: event.status, evidence: event.evidence,
    sourceOrConversionRef: event.sourceOrConversionRef ?? null,
    reservationId: event.reservationId ?? null,
    permittedLoss: event.permittedLoss ?? null,
    correctionReason: event.correctionReason ?? null
  });

  const getAccount = (id: string | undefined, event: LedgerEvent): LedgerAccount | undefined => {
    if (!id) return undefined;
    const account = accountById.get(id);
    if (!account) issue(event.eventId, "ACCOUNT-NOT-FOUND", "Referenced account does not exist: " + id);
    else if (account.resourceKind !== event.resourceKind) issue(event.eventId, "RESOURCE-MISMATCH", "Event resource kind does not match account " + id);
    else if (account.unit !== event.unit || account.unitContractId !== event.unitContractId) issue(event.eventId, "UNIT-CONTRACT-MISMATCH", "Event unit and contract must exactly match account " + id);
    else return account;
    return undefined;
  };

  for (const event of events) {
    const fail = (code: LedgerIssueCode, message: string) => {
      const item = issue(event.eventId, code, message);
      eventResults.push({ eventId: event.eventId || "(missing)", applied: false, duplicate: false, issue: item });
    };
    if (!event.eventId?.trim() || !event.invocationId?.trim() || !event.resourceKind?.trim() ||
        !event.unit?.trim() || !event.unitContractId?.trim() || !event.idempotencyKey?.trim() ||
        !safeTicks(event.amountTicks)) {
      fail("EVENT-MALFORMED", "Event identity, invocation, resource, unit contract, idempotency key and non-negative safe-integer amount are required.");
      continue;
    }
    if (seenIds.has(event.eventId)) {
      fail("EVENT-MALFORMED", "Event identifiers must be unique within the supplied ledger batch.");
      continue;
    }
    seenIds.add(event.eventId);
    const issueCountBeforeEvent = issues.length;
    const resultCountBeforeEvent = eventResults.length;
    const fp = fingerprint(event);
    const previous = idempotency.get(event.idempotencyKey);
    if (previous !== undefined) {
      if (previous === fp) eventResults.push({ eventId: event.eventId, applied: false, duplicate: true });
      else fail("IDEMPOTENCY-COLLISION", "The same idempotency key was reused with different event content.");
      continue;
    }
    if (event.status !== "CONFIRMED" || event.evidence !== "PASS") {
      fail(event.evidence === "FAIL" ? "EVIDENCE-FAILED" : "EVIDENCE-UNRESOLVED",
        "Only confirmed events with passing evidence can alter the projected ledger.");
      continue;
    }
    const apply = () => {
      idempotency.set(event.idempotencyKey, fp);
      eventResults.push({ eventId: event.eventId, applied: true, duplicate: false });
    };
    const debit = (account: LedgerAccount, amount: number) => {
      const available = balances[account.accountId] - reserved[account.accountId];
      if (available < amount) return false;
      balances[account.accountId] -= amount;
      return true;
    };
    const credit = (account: LedgerAccount, amount: number) => {
      const next = balances[account.accountId] + amount;
      if (!Number.isSafeInteger(next)) return false;
      balances[account.accountId] = next;
      return true;
    };

    switch (event.eventKind) {
      case "SOURCE-ENTRY": {
        const to = getAccount(event.toAccount, event);
        if (!to) break;
        if (!event.sourceOrConversionRef?.trim()) { fail("EVENT-MALFORMED", "Source entry requires a source contract reference."); break; }
        if (!credit(to, event.amountTicks)) { fail("EVENT-MALFORMED", "Credit would exceed safe integer accounting range."); break; }
        apply(); break;
      }
      case "TRANSFER": {
        const from = getAccount(event.fromAccount, event);
        const to = getAccount(event.toAccount, event);
        if (!from || !to) break;
        if (from.accountId === to.accountId) { fail("TRANSFER-INVALID", "A transfer must identify distinct source and destination accounts."); break; }
        if (!debit(from, event.amountTicks)) { fail("INSUFFICIENT-AVAILABLE", "Transfer exceeds source account's unreserved balance."); break; }
        if (!credit(to, event.amountTicks)) {
          balances[from.accountId] += event.amountTicks;
          fail("TRANSFER-INVALID", "Destination credit would exceed safe integer accounting range; source debit was not retained.");
          break;
        }
        apply(); break;
      }
      case "RESERVE": {
        const account = getAccount(event.fromAccount ?? event.toAccount, event);
        if (!account) break;
        const id = event.reservationId?.trim() || event.eventId;
        if (reservations.has(id)) { fail("RESERVATION-INVALID", "Reservation identifiers must be unique."); break; }
        const available = balances[account.accountId] - reserved[account.accountId];
        if (available < event.amountTicks) { fail("INSUFFICIENT-AVAILABLE", "Reservation exceeds currently unreserved balance."); break; }
        reserved[account.accountId] += event.amountTicks;
        reservations.set(id, { reservationId: id, accountId: account.accountId, amountTicks: event.amountTicks, status: "HELD" });
        apply(); break;
      }
      case "RESERVATION-RELEASE": {
        const reservation = event.reservationId ? reservations.get(event.reservationId) : undefined;
        if (!reservation || reservation.status === "RELEASED" || reservation.status === "SETTLED" ||
            event.amountTicks > reservation.amountTicks) {
          fail("RESERVATION-INVALID", "Release must reference a held reservation and cannot exceed its remaining amount."); break;
        }
        const reservationAccount = getAccount(reservation.accountId, event);
        if (!reservationAccount) break;
        reservation.amountTicks -= event.amountTicks;
        reserved[reservation.accountId] -= event.amountTicks;
        if (reservation.amountTicks === 0) reservation.status = "RELEASED";
        apply(); break;
      }
      case "CONSUME": {
        const account = getAccount(event.fromAccount, event);
        if (!account) break;
        if (event.reservationId) {
          const reservation = reservations.get(event.reservationId);
          if (!reservation || reservation.accountId !== account.accountId ||
              reservation.status === "RELEASED" || event.amountTicks > reservation.amountTicks) {
            fail("RESERVATION-INVALID", "Consumption must not exceed the referenced reservation's remaining amount."); break;
          }
          if (balances[account.accountId] < event.amountTicks) { fail("INSUFFICIENT-BALANCE", "Account balance is insufficient for reserved consumption."); break; }
          balances[account.accountId] -= event.amountTicks;
          reserved[account.accountId] -= event.amountTicks;
          reservation.amountTicks -= event.amountTicks;
          reservation.status = reservation.amountTicks === 0 ? "SETTLED" : "PARTIALLY-CONSUMED";
        } else if (!debit(account, event.amountTicks)) {
          fail("INSUFFICIENT-AVAILABLE", "Consumption exceeds unreserved account balance."); break;
        }
        apply(); break;
      }
      case "MEASURED-RETURN": {
        const to = getAccount(event.toAccount, event);
        if (!to) break;
        if (!event.sourceOrConversionRef?.trim()) { fail("EVENT-MALFORMED", "Measured return requires evidence reference."); break; }
        if (!credit(to, event.amountTicks)) { fail("EVENT-MALFORMED", "Return would exceed safe integer accounting range."); break; }
        apply(); break;
      }
      case "LOSS": {
        const from = getAccount(event.fromAccount, event);
        if (!from) break;
        if (event.permittedLoss !== true || !event.sourceOrConversionRef?.trim()) {
          fail("EVENT-KIND-UNSUPPORTED", "Loss requires an explicitly permitted loss pathway and supporting contract reference."); break;
        }
        if (!debit(from, event.amountTicks)) { fail("INSUFFICIENT-AVAILABLE", "Loss exceeds unreserved account balance."); break; }
        apply(); break;
      }
      case "CORRECTION": {
        if (!event.correctionReason?.trim() || !event.sourceOrConversionRef?.trim()) {
          fail("CORRECTION-UNSUPPORTED", "Correction requires a reason and traceable evidence reference."); break;
        }
        fail("CORRECTION-UNSUPPORTED", "Corrections require a signed, direction-specific adjustment contract; no balance is changed by this generic event.");
        break;
      }
      default:
        fail("EVENT-KIND-UNSUPPORTED", "This event kind requires a dedicated source, transformation, exchange or reconciliation contract and is not applied by this ledger projection.");
    }
    if (eventResults.length === resultCountBeforeEvent) {
      const eventIssues = issues.slice(issueCountBeforeEvent);
      const lastIssue = eventIssues[eventIssues.length - 1] ??
        issue(event.eventId, "EVENT-MALFORMED", "The event does not identify a valid account for its event kind.");
      eventResults.push({
        eventId: event.eventId,
        applied: false,
        duplicate: false,
        issue: lastIssue
      });
    }
  }

  const available: Record<string, number> = {};
  for (const id of Object.keys(balances)) available[id] = balances[id] - reserved[id];
  const failed = issues.length > 0;
  const unresolved = issues.some(item => item.code === "EVIDENCE-UNRESOLVED");
  const malformed = issues.some(item => item.code === "ACCOUNT-MALFORMED" || item.code === "ACCOUNT-DUPLICATE" || item.code === "EVENT-MALFORMED");
  const outcome = malformed ? "LEDGER-MALFORMED" :
    unresolved ? "LEDGER-UNRESOLVED" : failed ? "LEDGER-PARTIAL" : "LEDGER-PROJECTED";

  return {
    outcome, balances, reserved, available,
    reservations: [...reservations.values()].map(item => ({ ...item })),
    events: eventResults, issues, limitations: [...LIMITATIONS]
  };
}
