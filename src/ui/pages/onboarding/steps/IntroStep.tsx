import { Sparkles, GraduationCap, ArrowRight, KeyRound } from "lucide-react";
import { cn, typography } from "../../../design-tokens";
import { useI18n } from "../../../../core/i18n/context";

interface IntroStepProps {
  onFirstTime: () => void;
  onExperienced: () => void;
}

export function IntroStep({ onFirstTime, onExperienced }: IntroStepProps) {
  const { t } = useI18n();

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col pb-10">
      <div className="mb-7 space-y-3 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white/75">
          <KeyRound size={26} strokeWidth={2} />
        </div>
        <h1 className={cn(typography.h1.size, typography.h1.weight, "text-white")}>
          {t("onboarding.intro.title")}
        </h1>
        <p className="text-[15px] leading-relaxed text-white/65">
          {t("onboarding.intro.body")}
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={onFirstTime}
          className={cn(
            "group relative w-full overflow-hidden rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-left",
            "transition hover:border-emerald-400/60 hover:bg-emerald-500/15 active:scale-[0.99]",
          )}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/20 text-emerald-400">
              <GraduationCap size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-[16px] font-semibold text-white">
                {t("onboarding.intro.firstTimeTitle")}
              </h3>
              <p className="mt-0.5 text-[13px] leading-relaxed text-white/55">
                {t("onboarding.intro.firstTimeDesc")}
              </p>
            </div>
            <ArrowRight size={18} className="shrink-0 text-emerald-300/70" />
          </div>
        </button>

        <button
          onClick={onExperienced}
          className={cn(
            "group w-full rounded-2xl border border-white/10 bg-white/5 p-5 text-left",
            "transition hover:border-white/20 hover:bg-white/10 active:scale-[0.99]",
          )}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white/70">
              <Sparkles size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-[16px] font-semibold text-white">
                {t("onboarding.intro.experiencedTitle")}
              </h3>
              <p className="mt-0.5 text-[13px] leading-relaxed text-white/55">
                {t("onboarding.intro.experiencedDesc")}
              </p>
            </div>
            <ArrowRight size={18} className="shrink-0 text-white/40" />
          </div>
        </button>
      </div>
    </div>
  );
}
