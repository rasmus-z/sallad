import type { CompanionTimeOverride } from "../../../../core/storage/schemas";

export function effectiveOverrideMs(
  override: CompanionTimeOverride | undefined | null,
  nowMs: number,
): number {
  if (!override || override.mode === "off") return nowMs;
  if (override.mode === "frozen") return override.anchorMs;
  return override.anchorMs + (nowMs - override.setAtMs);
}

export function toLocalInputValue(ms: number): string {
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}
