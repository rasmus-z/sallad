import { useEffect, useMemo, useState } from "react";
import { History } from "lucide-react";
import type { CompanionTimeOverride, Session } from "../../../../core/storage/schemas";
import { cn, interactive, radius } from "../../../design-tokens";
import {
  effectiveOverrideMs,
  toLocalInputValue,
} from "../utils/companionTimeOverride";

type OverrideMode = CompanionTimeOverride["mode"];

const MODE_OPTIONS: { mode: OverrideMode; label: string }[] = [
  { mode: "off", label: "Live" },
  { mode: "frozen", label: "Frozen" },
  { mode: "ticking", label: "Ticking" },
];

interface CompanionTimeOverrideCardProps {
  session: Session | null;
  onApply: (override: CompanionTimeOverride | null) => void | Promise<void>;
  disabled?: boolean;
}

export function CompanionTimeOverrideCard({
  session,
  onApply,
  disabled,
}: CompanionTimeOverrideCardProps) {
  const override = session?.companionState?.preferences?.timeOverride;
  const activeMode: OverrideMode = override?.mode ?? "off";

  const [nowMs, setNowMs] = useState(() => Date.now());
  const [selectedMode, setSelectedMode] = useState<OverrideMode>(activeMode);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    setSelectedMode(activeMode);
  }, [activeMode]);

  const shownMs = effectiveOverrideMs(override, nowMs);
  const isOverridden = activeMode !== "off";
  const canEdit = !disabled && !!session;

  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [],
  );

  const selectMode = (mode: OverrideMode) => {
    if (!canEdit) return;
    setSelectedMode(mode);
    if (mode === "off") {
      void onApply(null);
      return;
    }
    setDraft(toLocalInputValue(shownMs));
  };

  const apply = () => {
    if (!canEdit || selectedMode === "off") return;
    const anchorMs = new Date(draft).getTime();
    if (Number.isNaN(anchorMs)) return;
    void onApply({ mode: selectedMode, anchorMs, setAtMs: Date.now() });
  };

  const showEditor = canEdit && selectedMode !== "off";

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border px-4 py-3",
        !session
          ? "border-white/5 bg-[#0c0d13]/50 opacity-50"
          : "border-white/10 bg-[#0c0d13]/85",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border border-fg/15 bg-fg/10 text-fg/75",
            radius.full,
          )}
        >
          <History className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-white">Time Override</p>
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                isOverridden ? "bg-accent/15 text-accent" : "text-white/35",
              )}
            >
              {isOverridden ? (activeMode === "frozen" ? "Frozen" : "Custom") : "Live"}
            </span>
          </div>
          <p className="mt-1 text-xs text-white/50">
            Set the date and time the companion sees. Live uses the real clock, Frozen
            holds a fixed moment, Ticking keeps advancing from the time you set.
          </p>
          <p className="mt-1.5 text-xs tabular-nums text-white/70">
            {formatter.format(shownMs)}
            {isOverridden && (
              <span className="text-white/35"> (real {formatter.format(nowMs)})</span>
            )}
          </p>
        </div>
      </div>

      <div className="flex gap-1.5">
        {MODE_OPTIONS.map((opt) => (
          <button
            key={opt.mode}
            type="button"
            disabled={!canEdit}
            onClick={() => selectMode(opt.mode)}
            className={cn(
              "flex-1 border px-2 py-1.5 text-xs font-medium",
              radius.md,
              interactive.transition.default,
              selectedMode === opt.mode
                ? "border-accent/40 bg-accent/15 text-accent"
                : "border-white/10 bg-[#0c0d13]/85 text-white/60 hover:border-white/20 hover:text-white/80",
              !canEdit && "cursor-not-allowed opacity-50",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {showEditor && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="datetime-local"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className={cn(
              "flex-1 border border-white/10 bg-[#0c0d13]/85 px-3 py-2 text-sm text-white focus:border-accent/40 focus:outline-none",
              radius.lg,
            )}
          />
          <button
            type="button"
            onClick={apply}
            className={cn(
              "bg-accent px-3 py-2 text-sm font-semibold text-black",
              radius.lg,
              interactive.transition.default,
              interactive.active.scale,
              "hover:brightness-110",
            )}
          >
            {selectedMode === "frozen" ? "Freeze" : "Set"}
          </button>
        </div>
      )}
    </div>
  );
}
