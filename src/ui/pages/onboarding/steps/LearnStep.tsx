import { useState } from "react";
import {
  AppWindow,
  Building2,
  KeyRound,
  Cpu,
  Wallet,
  ArrowLeft,
  ArrowRight,
  Lightbulb,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn, typography } from "../../../design-tokens";
import { useI18n, type TranslationKey } from "../../../../core/i18n/context";

interface LearnStepProps {
  onDone: () => void;
  onExitBack: () => void;
}

const CARDS: Array<{ icon: LucideIcon; key: string }> = [
  { icon: AppWindow, key: "app" },
  { icon: Building2, key: "provider" },
  { icon: KeyRound, key: "apiKey" },
  { icon: Cpu, key: "model" },
  { icon: Wallet, key: "cost" },
];

export function LearnStep({ onDone, onExitBack }: LearnStepProps) {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);

  const card = CARDS[index];
  const Icon = card.icon;
  const isFirst = index === 0;
  const isLast = index === CARDS.length - 1;

  const goPrev = () => {
    if (isFirst) onExitBack();
    else setIndex((i) => i - 1);
  };
  const goNext = () => {
    if (isLast) onDone();
    else setIndex((i) => i + 1);
  };

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col pb-10">
      <div className="mb-6 flex items-center justify-center gap-1.5">
        {CARDS.map((c, i) => (
          <span
            key={c.key}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === index ? "w-6 bg-emerald-400" : "w-1.5 bg-white/20",
            )}
          />
        ))}
      </div>

      <div className="flex flex-1 flex-col items-center text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
          <Icon size={30} strokeWidth={1.8} />
        </div>
        <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.25em] text-emerald-300/70">
          {t(`onboarding.learn.${card.key}.tag` as TranslationKey)}
        </p>
        <h1 className={cn(typography.h1.size, typography.h1.weight, "text-white")}>
          {t(`onboarding.learn.${card.key}.title` as TranslationKey)}
        </h1>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/70">
          {t(`onboarding.learn.${card.key}.body` as TranslationKey)}
        </p>

        <div className="mt-6 w-full max-w-md rounded-2xl border border-white/10 bg-black/50 p-4 text-left">
          <div className="mb-1.5 flex items-center gap-1.5 text-emerald-300/80">
            <Lightbulb size={13} strokeWidth={2} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">
              {t("onboarding.learn.plainLabel")}
            </span>
          </div>
          <p className="text-[13px] leading-relaxed text-white/75">
            {t(`onboarding.learn.${card.key}.plain` as TranslationKey)}
          </p>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <button
          onClick={goPrev}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-[14px] font-medium text-white/75 transition hover:border-white/20 hover:bg-white/10 active:scale-[0.98]"
        >
          <ArrowLeft size={16} />
          {t("common.buttons.back")}
        </button>
        <button
          onClick={goNext}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500/20 px-5 py-3 text-[14px] font-semibold text-emerald-100 transition hover:border-emerald-400/60 hover:bg-emerald-500/30 active:scale-[0.98]"
        >
          {isLast ? t("onboarding.learn.done") : t("common.buttons.next")}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
