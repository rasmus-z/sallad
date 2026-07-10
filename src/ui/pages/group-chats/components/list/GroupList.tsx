import { useEffect, useRef, useState, memo } from "react";
import { BookOpen, ChevronRight, Loader2, Rocket, Users } from "lucide-react";
import { motion } from "framer-motion";

import { useI18n } from "../../../../../core/i18n/context";
import type { GroupPreview, Character } from "../../../../../core/storage/schemas";
import { typography, radius, spacing, interactive, cn } from "../../../../design-tokens";
import { useAvatar } from "../../../../hooks/useAvatar";
import { useRocketEasterEgg } from "../../../../hooks/useRocketEasterEgg";
import { AvatarImage } from "../../../../components/AvatarImage";
import { formatTimeAgo } from "../../utils/formatTimeAgo";
import { isRenderableImageUrl } from "../../../../../core/utils/image";
import { openDocs } from "../../../../../core/utils/docs";

export function GroupList({
  groups,
  characters,
  openingGroupId,
  onOpenGroup,
  onLongPress,
}: {
  groups: GroupPreview[];
  characters: Character[];
  openingGroupId: string | null;
  onOpenGroup: (group: GroupPreview) => void;
  onLongPress: (group: GroupPreview) => void;
}) {
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    if (visibleCount < groups.length) {
      const timer = setTimeout(() => {
        setVisibleCount((prev) => Math.min(prev + 10, groups.length));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [visibleCount, groups.length]);

  useEffect(() => {
    setVisibleCount(10);
  }, [groups]);

  return (
    <div className="space-y-2 lg:space-y-3 pb-24">
      {groups.slice(0, visibleCount).map((group) => (
        <GroupCard
          key={group.id}
          group={group}
          characters={characters}
          isOpening={openingGroupId === group.id}
          disabled={openingGroupId !== null}
          onOpen={onOpenGroup}
          onLongPress={onLongPress}
        />
      ))}
    </div>
  );
}

export function GroupListSkeleton() {
  return (
    <div className={spacing.item}>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={cn("h-20 animate-pulse p-4", "rounded-2xl", "border border-fg/5 bg-fg/5")}
        >
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-fg/10" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 rounded-full bg-fg/10" />
              <div className="h-3 w-2/3 rounded-full bg-fg/5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState() {
  const { t } = useI18n();
  const rocket = useRocketEasterEgg();
  return (
    <div
      className={cn(
        "relative p-8 text-center overflow-hidden",
        radius.lg,
        "border border-dashed border-fg/10 bg-fg/2",
      )}
      {...rocket.bind}
    >
      {rocket.isLaunched && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rocket-launch">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-fg/10 bg-fg/10">
            <Rocket className="h-4 w-4 text-fg/80" />
          </div>
        </div>
      )}
      <div className={spacing.field}>
        <Users className="mx-auto h-12 w-12 text-fg/30 mb-4" />
        <h3 className={cn(typography.h3.size, typography.h3.weight, "text-fg")}>
          {t("groupChats.list.noGroupChatsYet")}
        </h3>
        <p className={cn(typography.body.size, typography.body.lineHeight, "text-fg/50")}>
          {t("groupChats.list.noGroupChatsDesc")}
        </p>
        <button
          onClick={() => void openDocs("groupChats")}
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-fg/40 transition active:scale-95 hover:text-fg/70"
        >
          <BookOpen className="h-3.5 w-3.5" />
          {t("common.buttons.learnMore")}
        </button>
      </div>
    </div>
  );
}

function isImageLike(s?: string) {
  return isRenderableImageUrl(s);
}

const CharacterMiniAvatar = memo(({ character }: { character: Character }) => {
  const avatarUrl = useAvatar("character", character.id, character.avatarPath, "round");

  if (avatarUrl && isImageLike(avatarUrl)) {
    return (
      <AvatarImage src={avatarUrl} alt={character.name} crop={character.avatarCrop} applyCrop />
    );
  }

  const initials = character.name.slice(0, 2).toUpperCase();
  return (
    <div className="flex h-full w-full items-center justify-center text-xs font-bold text-fg/60">
      {initials}
    </div>
  );
});

CharacterMiniAvatar.displayName = "CharacterMiniAvatar";

const GroupCard = memo(
  ({
    group,
    characters,
    isOpening,
    disabled,
    onOpen,
    onLongPress,
  }: {
    group: GroupPreview;
    characters: Character[];
    isOpening: boolean;
    disabled: boolean;
    onOpen: (group: GroupPreview) => void;
    onLongPress: (group: GroupPreview) => void;
  }) => {
    const { t } = useI18n();
    const longPressTimer = useRef<number | null>(null);
    const isLongPress = useRef(false);

    const hasSession = Boolean(group.latestSessionId);
    const recency = group.latestSessionUpdatedAt ?? group.updatedAt;
    const preview = group.latestSessionMessage?.trim() || null;

    const handlePointerDown = () => {
      isLongPress.current = false;
      longPressTimer.current = window.setTimeout(() => {
        isLongPress.current = true;
        onLongPress(group);
      }, 500);
    };

    const handlePointerUp = () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
    };

    const handlePointerLeave = () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
    };

    const handleClick = () => {
      if (isLongPress.current) {
        isLongPress.current = false;
        return;
      }
      onOpen(group);
    };

    const handleContextMenu = (e: React.MouseEvent) => {
      e.preventDefault();
      onLongPress(group);
    };

    const avatarCharacters = group.characterIds
      .slice(0, 3)
      .map((id) => characters.find((c) => c.id === id))
      .filter(Boolean) as Character[];

    return (
      <motion.button
        layoutId={`group-card-${group.id}`}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        disabled={disabled && !isOpening}
        aria-busy={isOpening}
        className={cn(
          "group relative flex w-full items-center gap-3.5 lg:gap-6 p-3.5 lg:p-6 text-left",
          "rounded-2xl lg:rounded-3xl",
          interactive.transition.default,
          interactive.active.scale,
          "border border-fg/10 bg-fg/5 hover:bg-fg/10",
          disabled && !isOpening && "opacity-60",
        )}
      >
        <div className="flex -space-x-2">
          {avatarCharacters.map((character) => (
            <div
              key={character.id}
              className={cn(
                "flex h-10 w-10 items-center justify-center overflow-hidden rounded-full",
                "border border-fg/10 bg-linear-to-br from-fg/8 to-fg/4",
              )}
            >
              <CharacterMiniAvatar character={character} />
            </div>
          ))}
          {group.characterIds.length > 3 && (
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full",
                "border border-fg/10 bg-fg/10",
                "text-xs font-semibold text-fg/60",
              )}
            >
              +{group.characterIds.length - 3}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className={cn(typography.body.size, typography.h3.weight, "text-fg truncate")}>
              {group.name}
            </h3>
            {hasSession && (
              <span className={cn(typography.caption.size, "shrink-0 text-fg/40")}>
                {formatTimeAgo(recency)}
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center justify-between gap-2">
            {isOpening ? (
              <span className={cn(typography.caption.size, "truncate text-fg/50")}>
                {t("groupChats.list.startingChat")}
              </span>
            ) : preview ? (
              <p className={cn(typography.caption.size, "truncate text-fg/50")}>{preview}</p>
            ) : (
              <p className={cn(typography.caption.size, "truncate italic text-fg/40")}>
                {hasSession
                  ? t("groupChats.list.emptyChatPreview")
                  : t("groupChats.list.noChatsYet")}
              </p>
            )}
            {group.sessionCount > 1 && (
              <span className={cn(typography.caption.size, "shrink-0 text-fg/35")}>
                {t("groupChats.list.sessionCount", { count: String(group.sessionCount) })}
              </span>
            )}
          </div>
        </div>

        {isOpening ? (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-fg/40" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0 text-fg/30" />
        )}
      </motion.button>
    );
  },
);

GroupCard.displayName = "GroupCard";
