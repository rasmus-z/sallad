import { motion } from "framer-motion";
import { Download, HardDrive } from "lucide-react";

import { typography, radius, interactive, shadows, cn } from "../../../design-tokens";
import { useI18n } from "../../../../core/i18n/context";

export interface DynamicMemoryEmbeddingPromptProps {
  onDownload: () => void;
  onContinueWithout: () => void;
}

export function DynamicMemoryEmbeddingPrompt({
  onDownload,
  onContinueWithout,
}: DynamicMemoryEmbeddingPromptProps) {
  const { t } = useI18n();

  return (
    <motion.div
      className="absolute inset-0 z-10 flex items-end justify-center bg-black/60"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={(e) => e.stopPropagation()}
    >
      <motion.div
        className={cn(
          "w-full max-w-lg border border-white/10 bg-[#0b0b0d] p-6",
          "rounded-t-3xl",
          shadows.xl,
        )}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 350 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className={cn(typography.h2.size, typography.h2.weight, "text-white mb-4")}>
          {t("onboarding.welcome.restoreBackup.embeddingTitle")}
        </h3>

        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3">
            <HardDrive className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-medium text-amber-200">
                {t("onboarding.welcome.restoreBackup.dynamicMemoryDetected")}
              </p>
              <p className="mt-1 text-[13px] text-amber-200/70">
                {t("onboarding.welcome.restoreBackup.dynamicMemoryMessage")}
              </p>
            </div>
          </div>

          <p className="text-[15px] text-white/60">
            {t("onboarding.welcome.restoreBackup.embeddingOptions")}
          </p>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={onDownload}
              className={cn(
                "flex items-center justify-center gap-2 px-6 py-3",
                radius.md,
                "border border-blue-400/40 bg-blue-400/20 text-blue-100",
                typography.body.size,
                typography.h3.weight,
                interactive.transition.fast,
                "hover:border-blue-400/60 hover:bg-blue-400/30",
              )}
            >
              <Download className="h-4 w-4" />
              {t("onboarding.welcome.restoreBackup.downloadModel")}
            </button>
            <button
              onClick={onContinueWithout}
              className={cn(
                "px-6 py-3",
                radius.md,
                "border border-white/10 bg-white/5 text-white/60",
                typography.body.size,
                interactive.transition.fast,
                "hover:border-white/20 hover:bg-white/10 hover:text-white",
              )}
            >
              {t("onboarding.welcome.restoreBackup.continueWithoutDynamic")}
            </button>
          </div>

          <p className="text-[13px] text-white/40 text-center">
            {t("onboarding.welcome.restoreBackup.embeddingNote")}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
