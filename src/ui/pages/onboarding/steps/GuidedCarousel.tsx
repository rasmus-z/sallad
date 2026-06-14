import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../../design-tokens";
import { useI18n, type TranslationKey } from "../../../../core/i18n/context";

export type GuidedSlide = { src: string; captionKey: string };

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="fixed right-4 top-[calc(var(--titlebar-h,0px)+env(safe-area-inset-top)+1rem)] z-[310] flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/80 transition hover:bg-white/20 active:scale-95 sm:right-8 sm:top-[calc(var(--titlebar-h,0px)+1.5rem)] sm:h-11 sm:w-11"
      >
        <X size={20} />
      </button>
      <motion.img
        src={src}
        alt=""
        draggable={false}
        className="max-h-[88vh] max-w-[93vw] rounded-xl border border-white/15 object-contain shadow-2xl lg:max-w-[1240px]"
        initial={{ scale: 0.96 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.96 }}
        transition={{ duration: 0.15 }}
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>,
    document.body,
  );
}

export function GuidedCarousel({
  captionBase,
  slides,
  variant = "phone",
}: {
  captionBase: string;
  slides: GuidedSlide[];
  variant?: "phone" | "desktop";
}) {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const slide = slides[index];
  const multiple = slides.length > 1;
  const isDesktop = variant === "desktop";

  return (
    <div className="flex flex-col items-center">
      <div className={cn("relative w-full", isDesktop ? "max-w-none" : "max-w-[250px]")}>
        <button
          type="button"
          onClick={() => setZoomed(true)}
          className={cn(
            "group relative block w-full cursor-zoom-in overflow-hidden border border-white/15 bg-black shadow-2xl",
            isDesktop ? "rounded-xl" : "rounded-[1.75rem] border-2",
          )}
        >
          <img src={slide.src} alt="" className="block h-auto w-full select-none" draggable={false} />
          <span className="pointer-events-none absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white/80 opacity-0 backdrop-blur transition group-hover:opacity-100">
            <ZoomIn size={14} />
          </span>
        </button>

        {multiple && (
          <>
            <button
              type="button"
              onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
              className="absolute left-[-14px] top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white/80 backdrop-blur transition hover:bg-black/90 active:scale-95"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => setIndex((i) => (i + 1) % slides.length)}
              className="absolute right-[-14px] top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white/80 backdrop-blur transition hover:bg-black/90 active:scale-95"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {multiple && (
        <div className="mt-3 flex items-center gap-1.5">
          {slides.map((s, i) => (
            <button
              key={s.captionKey}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-5 bg-emerald-400" : "w-1.5 bg-white/25",
              )}
            />
          ))}
        </div>
      )}

      <p className="mt-3 flex min-h-[2.5rem] max-w-[270px] items-start justify-center gap-1.5 text-center text-[13px] leading-relaxed text-white/80 [text-shadow:0_1px_8px_rgba(0,0,0,0.8)]">
        <span className="mt-px inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[11px] font-semibold text-emerald-300">
          {index + 1}
        </span>
        <span>{t(`${captionBase}.${slide.captionKey}` as TranslationKey)}</span>
      </p>

      <AnimatePresence>
        {zoomed && <Lightbox src={slide.src} onClose={() => setZoomed(false)} />}
      </AnimatePresence>
    </div>
  );
}
