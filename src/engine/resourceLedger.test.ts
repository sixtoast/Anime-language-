import { describe, expect, it } from "vitest";
import { projectResourceLedger, type LedgerAccount, type LedgerEvent } from "./resourceLedger";

const accounts = (): LedgerAccount[] => [
  { accountId: "a", resourceKind: "mana-token", unit: "unit", unitContractId: "mana-unit-v1", openingBalanceTicks: 100 },
  { accountId: "b", resourceKind: "mana-token", unit: "unit", unitContractId: "mana-unit-v1", openingBalanceTicks: 10 }
];
const event = (overrides: Partial<LedgerEvent> = {}): LedgerEvent => ({
  eventId: "event-1", invocationId: "invoke-1", resourceKind: "mana-token",
  eventKind: "CONSUME", fromAccount: "a", amountTicks: 10,
  unit: "unit", unitContractId: "mana-unit-v1", status: "CONFIRMED",
  evidence: "PASS", idempotencyKey: "idem-1", ...overrides
});

describe("Arcane Incantations v1.9 resource ledger projection", () => {
  it("[RES19-LEDGER-001] applies a confirmed, evidenced consumption", () => {
    expect(projectResourceLedger(accounts(), [event()])).toMatchObject({
      outcome: "LEDGER-PROJECTED", balances: { a: 90, b: 10 }, available: { a: 90, b: 10 }
    });
  });
  it("[RES19-LEDGER-002] transfers atomically between compatible accounts", () => {
    const transfer = event({ eventKind: "TRANSFER", fromAccount: "a", toAccount: "b", amountTicks: 25 });
    expect(projectResourceLedger(accounts(), [transfer]).balances).toEqual({ a: 75, b: 35 });
  });
  it("[RES19-LEDGER-003] does not apply an unconfirmed or unresolved event", () => {
    const result = projectResourceLedger(accounts(), [event({ evidence: "UNKNOWN" })]);
    expect(result.balances.a).toBe(100);
    expect(result.outcome).toBe("LEDGER-UNRESOLVED");
  });
  it("[RES19-LEDGER-004] rejects overdraw and preserves the original balance", () => {
    const result = projectResourceLedger(accounts(), [event({ amountTicks: 101 })]);
    expect(result.balances.a).toBe(100);
    expect(result.issues[0]?.code).toBe("INSUFFICIENT-AVAILABLE");
  });
  it("[RES19-LEDGER-005] deduplicates repeated idempotency keys without double debit", () => {
    const first = event();
    const retry = event({ eventId: "event-2" });
    const result = projectResourceLedger(accounts(), [first, retry]);
    expect(result.balances.a).toBe(90);
    expect(result.events[1]).toMatchObject({ applied: false, duplicate: true });
  });
  it("[RES19-LEDGER-006] rejects idempotency-key reuse for different event content", () => {
    const result = projectResourceLedger(accounts(), [event(), event({ eventId: "event-2", amountTicks: 11 })]);
    expect(result.balances.a).toBe(90);
    expect(result.issues.some(item => item.code === "IDEMPOTENCY-COLLISION")).toBe(true);
  });
  it("[RES19-LEDGER-007] reserves stock without consuming it", () => {
    const reserve = event({ eventKind: "RESERVE", fromAccount: "a", amountTicks: 40, reservationId: "r-1" });
    const result = projectResourceLedger(accounts(), [reserve]);
    expect(result).toMatchObject({ balances: { a: 100 }, reserved: { a: 40 }, available: { a: 60 } });
  });
  it("[RES19-LEDGER-008] settles reserved consumption and releases the hold", () => {
    const reserve = event({ eventId: "reserve", eventKind: "RESERVE", amountTicks: 40, reservationId: "r-1", idempotencyKey: "reserve-key" });
    const consume = event({ eventId: "consume", eventKind: "CONSUME", amountTicks: 40, reservationId: "r-1", idempotencyKey: "consume-key" });
    const result = projectResourceLedger(accounts(), [reserve, consume]);
    expect(result).toMatchObject({ balances: { a: 60 }, reserved: { a: 0 }, available: { a: 60 } });
    expect(result.reservations[0]).toMatchObject({ status: "SETTLED", amountTicks: 0 });
  });
  it("[RES19-LEDGER-009] requires an explicit permitted loss contract", () => {
    const result = projectResourceLedger(accounts(), [event({ eventKind: "LOSS" })]);
    expect(result.balances.a).toBe(100);
    expect(result.issues[0]?.code).toBe("EVENT-KIND-UNSUPPORTED");
  });
  it("[RES19-LEDGER-010] refuses implicit unit conversion and unsupported transformations", () => {
    const wrongUnit = event({ unit: "milliunit" });
    const transform = event({ eventKind: "TRANSFORMATION-INPUT" });
    expect(projectResourceLedger(accounts(), [wrongUnit]).balances.a).toBe(100);
    expect(projectResourceLedger(accounts(), [transform]).issues[0]?.code).toBe("EVENT-KIND-UNSUPPORTED");
  });
  it("[RES19-LEDGER-011] requires unique account and event identities", () => {
    expect(projectResourceLedger([...accounts(), accounts()[0]!], []).outcome).toBe("LEDGER-MALFORMED");
    expect(projectResourceLedger(accounts(), [event(), event()]).outcome).toBe("LEDGER-MALFORMED");
  });
  it("[RES19-LEDGER-012] preserves the non-execution boundary", () => {
    expect(projectResourceLedger(accounts(), []).limitations.join(" ")).toContain("not a physical measurement");
  });

  it("[RES19-LEDGER-013] validates reservation release against the reservation account contract", () => {
    const reserve = event({ eventId: "reserve", eventKind: "RESERVE", amountTicks: 40, reservationId: "r-1", idempotencyKey: "reserve-key" });
    const release = event({ eventId: "release", eventKind: "RESERVATION-RELEASE", reservationId: "r-1", amountTicks: 10, unit: "milliunit", idempotencyKey: "release-key" });
    const result = projectResourceLedger(accounts(), [reserve, release]);
    expect(result.reserved.a).toBe(40);
    expect(result.events[1]?.applied).toBe(false);
    expect(result.issues.some(item => item.code === "UNIT-CONTRACT-MISMATCH")).toBe(true);
  });

  it("[RES19-LEDGER-014] does not poison idempotency keys when an event cannot be applied", () => {
    const first = event({ amountTicks: 101 });
    const retry = event({ eventId: "event-retry", amountTicks: 50 });
    const result = projectResourceLedger(accounts(), [first, retry]);
    expect(result.balances.a).toBe(50);
    expect(result.events[1]).toMatchObject({ eventId: "event-retry", applied: true, duplicate: false });
  });

  it("[RES19-LEDGER-015] emits a failed event result when an account lookup fails", () => {
    const result = projectResourceLedger(accounts(), [event({ fromAccount: "missing" })]);
    expect(result.events).toHaveLength(1);
    expect(result.events[0]).toMatchObject({ applied: false, duplicate: false });
    expect(result.issues[0]?.code).toBe("ACCOUNT-NOT-FOUND");
  });
});
