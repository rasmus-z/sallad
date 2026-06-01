import { useEffect, useMemo, useState } from "react";
import { Clock } from "lucide-react";
import type { TimeNode } from "../../../../../core/storage/chatWidgetSchemas";
import type { CompanionTimeOverride } from "../../../../../core/storage/schemas";
import { cn, interactive } from "../../../../design-tokens";
import { useWidgetContext } from "./WidgetContext";
import { useWidgetEdit } from "./WidgetEditContext";
import { widgetCardClass } from "./widgetSurface";
import {
  effectiveOverrideMs,
  toLocalInputValue,
} from "../../utils/companionTimeOverride";

type OverrideMode = CompanionTimeOverride["mode"];

const MODE_OPTIONS: { mode: OverrideMode; label: string }[] = [
  { mode: "off", label: "Live" },
  { mode: "frozen", label: "Frozen" },
  { mode: "ticking", label: "Ticking" },
];

export function WidgetTime({ node }: { node: TimeNode }) {
  const { hasBackground, character, session, onUpdateCompanionTimeOverride } =
    useWidgetContext();
  const { editing: areaEditing } = useWidgetEdit();

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

  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: node.showSeconds ? "2-digit" : undefined,
        hour12: node.hourFormat === "12h",
      }),
    [node.showSeconds, node.hourFormat],
  );
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [],
  );

  const canEdit = !areaEditing && !!session;
  const isCompanion = character?.mode === "companion";
  const awarenessOff = !session?.companionState?.preferences?.timeAwarenessEnabled;

  const selectMode = (mode: OverrideMode) => {
    if (!canEdit) return;
    setSelectedMode(mode);
    if (mode === "off") {
      void onUpdateCompanionTimeOverride(null);
      return;
    }
    setDraft(toLocalInputValue(shownMs));
  };

  const apply = () => {
    if (!canEdit || selectedMode === "off") return;
    const anchorMs = new Date(draft).getTime();
    if (Number.isNaN(anchorMs)) return;
    void onUpdateCompanionTimeOverride({
      mode: selectedMode,
      anchorMs,
      setAtMs: Date.now(),
    });
  };

  const showEditor = canEdit && selectedMode !== "off";

  return (
    <section
      className={cn(
        "flex flex-col gap-2.5 rounded-xl px-3 py-3",
        widgetCardClass(hasBackground, node.design),
      )}
    >
      <header className="flex items-center gap-2">
        <Clock size={14} className="text-fg/50" />
        <h3 className="text-sm font-semibold text-fg/75">{node.title || "Time"}</h3>
        <span
          className={cn(
            "ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
            isOverridden ? "bg-accent/15 text-accent/80" : "text-fg/35",
          )}
        >
          {isOverridden ? (activeMode === "frozen" ? "Frozen" : "Custom") : "Live"}
        </span>
      </header>

      <div className="flex flex-col items-center gap-0.5 py-1">
        <span className="text-3xl font-semibold leading-none tabular-nums text-fg/90">
          {timeFormatter.format(shownMs)}
        </span>
        {node.showDate !== false && (
          <span className="text-[12px] text-fg/50">{dateFormatter.format(shownMs)}</span>
        )}
        {isOverridden && (
          <span className="mt-1 text-[10px] text-fg/35">
            Real time {timeFormatter.format(nowMs)}
          </span>
        )}
      </div>

      {canEdit && (
        <div className="flex gap-1">
          {MODE_OPTIONS.map((opt) => (
            <button
              key={opt.mode}
              type="button"
              onClick={() => selectMode(opt.mode)}
              className={cn(
                "flex-1 rounded-md border px-2 py-1 text-[11px] font-medium",
                interactive.transition.fast,
                selectedMode === opt.mode
                  ? "border-accent/40 bg-accent/15 text-accent/90"
                  : "border-fg/12 bg-fg/5 text-fg/60 hover:border-fg/25 hover:bg-fg/10 hover:text-fg/80",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {showEditor && (
        <div className="flex flex-col gap-2">
          <input
            type="datetime-local"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full rounded-md border border-fg/12 bg-fg/5 px-2 py-1.5 text-[12px] text-fg/85 focus:border-accent/40 focus:outline-none"
          />
          <button
            type="button"
            onClick={apply}
            className={cn(
              "rounded-md bg-accent px-2 py-1.5 text-[12px] font-semibold text-black shadow-sm",
              interactive.transition.fast,
              interactive.active.scale,
              "hover:brightness-110",
            )}
          >
            {selectedMode === "frozen" ? "Freeze at this time" : "Set and keep ticking"}
          </button>
        </div>
      )}

      {canEdit && isCompanion && awarenessOff && (
        <p className="text-[10px] italic leading-snug text-fg/35">
          Turn on time awareness in chat settings for this to reach the companion.
        </p>
      )}
    </section>
  );
}
