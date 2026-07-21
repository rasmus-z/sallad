import type { VoicePlaybackRule } from "../storage/schemas";

export type VoicePlaybackTextSegment = {
  text: string;
  start: number;
  end: number;
};

export type VoicePlaybackOutputMap = {
  outputStart: number;
  outputEnd: number;
  sourceStart: number;
  sourceEnd: number;
};

export type VoicePlaybackTransform = {
  text: string;
  segments: VoicePlaybackTextSegment[];
  map: VoicePlaybackOutputMap[];
};

type BuiltinRuleDefinition = Omit<VoicePlaybackRule, "enabled"> & { enabled: boolean };

export const BUILTIN_VOICE_PLAYBACK_RULES: BuiltinRuleDefinition[] = [
  {
    id: "builtin:excludeBracketedNotes",
    builtin: true,
    builtinId: "excludeBracketedNotes",
    enabled: false,
    name: "Exclude bracketed notes",
    pattern: String.raw`\[[^\]\n]*\]`,
    rule: "exclude",
  },
  {
    id: "builtin:excludeStageDirections",
    builtin: true,
    builtinId: "excludeStageDirections",
    enabled: false,
    name: "Exclude stage directions",
    pattern: String.raw`\*[^*\n]+\*`,
    rule: "exclude",
  },
  {
    id: "builtin:excludeParentheticals",
    builtin: true,
    builtinId: "excludeParentheticals",
    enabled: false,
    name: "Exclude parenthetical asides",
    pattern: String.raw`\([^()\n]*\)`,
    rule: "exclude",
  },
  {
    id: "builtin:excludeMarkdownImages",
    builtin: true,
    builtinId: "excludeMarkdownImages",
    enabled: false,
    name: "Exclude Markdown images",
    pattern: String.raw`!\[[^\]\n]*\]\([^\n)]*\)`,
    rule: "exclude",
  },
  {
    id: "builtin:excludeMarkdownLinks",
    builtin: true,
    builtinId: "excludeMarkdownLinks",
    enabled: false,
    name: "Exclude Markdown links",
    pattern: String.raw`(?<!!)\[[^\]\n]+\]\([^\n)]*\)`,
    rule: "exclude",
  },
  {
    id: "builtin:excludeReferenceLinks",
    builtin: true,
    builtinId: "excludeReferenceLinks",
    enabled: false,
    name: "Exclude reference-style links and images",
    pattern: String.raw`!?\[[^\]\n]*\]\[[^\]\n]*\]`,
    rule: "exclude",
  },
  {
    id: "builtin:excludeLinkDefinitions",
    builtin: true,
    builtinId: "excludeLinkDefinitions",
    enabled: false,
    name: "Exclude link reference definitions",
    pattern: String.raw`^\s{0,3}\[[^\]\n]+\]:\s+\S.*$`,
    rule: "exclude",
  },
  {
    id: "builtin:excludeAutolinks",
    builtin: true,
    builtinId: "excludeAutolinks",
    enabled: false,
    name: "Exclude automatic links and bare URLs",
    pattern: String.raw`<https?:\/\/[^>\s]+>|https?:\/\/\S+`,
    rule: "exclude",
  },
  {
    id: "builtin:excludeInlineCode",
    builtin: true,
    builtinId: "excludeInlineCode",
    enabled: false,
    name: "Exclude inline code",
    pattern: "`[^`\\n]+`",
    rule: "exclude",
  },
  {
    id: "builtin:excludeFencedCodeBlocks",
    builtin: true,
    builtinId: "excludeFencedCodeBlocks",
    enabled: false,
    name: "Exclude fenced code blocks",
    pattern: String.raw`^\s{0,3}(?:\x60{3,}|~{3,})[\s\S]*?^\s{0,3}(?:\x60{3,}|~{3,})\s*$`,
    rule: "exclude",
  },
  {
    id: "builtin:excludeHeadings",
    builtin: true,
    builtinId: "excludeHeadings",
    enabled: false,
    name: "Exclude headings",
    pattern: String.raw`^\s{0,3}#{1,6}\s+.+$`,
    rule: "exclude",
  },
  {
    id: "builtin:excludeBlockquotes",
    builtin: true,
    builtinId: "excludeBlockquotes",
    enabled: false,
    name: "Exclude blockquotes",
    pattern: String.raw`^\s{0,3}>\s?.+$`,
    rule: "exclude",
  },
  {
    id: "builtin:excludeTaskListItems",
    builtin: true,
    builtinId: "excludeTaskListItems",
    enabled: false,
    name: "Exclude task list items",
    pattern: String.raw`^\s{0,3}[-+*]\s+\[[ xX]\]\s+.+$`,
    rule: "exclude",
  },
  {
    id: "builtin:excludeUnorderedListItems",
    builtin: true,
    builtinId: "excludeUnorderedListItems",
    enabled: false,
    name: "Exclude unordered list items",
    pattern: String.raw`^\s{0,3}[-+*]\s+(?!\[[ xX]\]\s).+$`,
    rule: "exclude",
  },
  {
    id: "builtin:excludeOrderedListItems",
    builtin: true,
    builtinId: "excludeOrderedListItems",
    enabled: false,
    name: "Exclude ordered list items",
    pattern: String.raw`^\s{0,3}\d{1,9}[.)]\s+.+$`,
    rule: "exclude",
  },
  {
    id: "builtin:excludeDefinitionListItems",
    builtin: true,
    builtinId: "excludeDefinitionListItems",
    enabled: false,
    name: "Exclude definition list items",
    pattern: String.raw`^\s{0,3}:\s+.+$`,
    rule: "exclude",
  },
  {
    id: "builtin:excludeMarkdownTables",
    builtin: true,
    builtinId: "excludeMarkdownTables",
    enabled: false,
    name: "Exclude Markdown table rows",
    pattern: String.raw`^\s*\|.+\|\s*$|^\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)+$`,
    rule: "exclude",
  },
  {
    id: "builtin:includeQuotedDialogue",
    builtin: true,
    builtinId: "includeQuotedDialogue",
    enabled: false,
    name: "Include quoted dialogue only",
    pattern: String.raw`["“][^"”\n]+["”]`,
    rule: "include",
  },
];

function cloneRule(rule: VoicePlaybackRule): VoicePlaybackRule {
  return { ...rule };
}

export function defaultVoicePlaybackRules(): VoicePlaybackRule[] {
  return BUILTIN_VOICE_PLAYBACK_RULES.map(cloneRule);
}

export function normalizeVoicePlaybackRules(rules?: VoicePlaybackRule[] | null): VoicePlaybackRule[] {
  const saved = Array.isArray(rules) ? rules : [];
  const normalized: VoicePlaybackRule[] = [];

  for (const builtin of BUILTIN_VOICE_PLAYBACK_RULES) {
    const match = saved.find(
      (rule) => rule.builtinId === builtin.builtinId || rule.id === builtin.id,
    );
    normalized.push({
      ...builtin,
      enabled: match?.enabled ?? builtin.enabled,
    });
  }

  for (const rule of saved) {
    if (rule.builtin || rule.builtinId) continue;
    normalized.push({
      id: rule.id || `custom:${Date.now()}:${Math.random().toString(36).slice(2)}`,
      name: rule.name || "Custom playback rule",
      pattern: rule.pattern || "",
      rule: rule.rule === "include" ? "include" : "exclude",
      enabled: rule.enabled !== false,
      builtin: false,
    });
  }

  return normalized;
}

function parseRegexPattern(pattern: string): { source: string; flags: string } {
  const trimmed = pattern.trim();
  const delimited = /^\/(.*)\/([dgimsuvy]*)$/.exec(trimmed);
  if (!delimited) {
    return { source: trimmed, flags: "gmsu" };
  }

  const flags = Array.from(new Set(`${delimited[2]}g`)).join("");
  return { source: delimited[1], flags };
}

export function compileVoicePlaybackRegex(pattern: string): RegExp {
  const { source, flags } = parseRegexPattern(pattern);
  return new RegExp(source, flags);
}

function collectMatches(text: string, regex: RegExp): Array<{ start: number; end: number }> {
  const matches: Array<{ start: number; end: number }> = [];
  regex.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const start = match.index;
    const end = start + match[0].length;
    if (end > start) {
      matches.push({ start, end });
    }
    if (match[0].length === 0) {
      regex.lastIndex += 1;
    }
  }

  return matches;
}

function mergeRanges(ranges: Array<{ start: number; end: number }>): Array<{ start: number; end: number }> {
  const sorted = ranges
    .filter((range) => range.end > range.start)
    .sort((a, b) => a.start - b.start || a.end - b.end);
  const merged: Array<{ start: number; end: number }> = [];

  for (const range of sorted) {
    const previous = merged[merged.length - 1];
    if (!previous || range.start > previous.end) {
      merged.push({ ...range });
    } else {
      previous.end = Math.max(previous.end, range.end);
    }
  }

  return merged;
}

function segmentsFromRanges(text: string, ranges: Array<{ start: number; end: number }>): VoicePlaybackTextSegment[] {
  return mergeRanges(ranges).map((range) => ({
    text: text.slice(range.start, range.end),
    start: range.start,
    end: range.end,
  }));
}

function excludeFromSegment(
  segment: VoicePlaybackTextSegment,
  regex: RegExp,
): VoicePlaybackTextSegment[] {
  const ranges = mergeRanges(collectMatches(segment.text, regex));
  if (ranges.length === 0) return [segment];

  const next: VoicePlaybackTextSegment[] = [];
  let cursor = 0;

  for (const range of ranges) {
    if (range.start > cursor) {
      next.push({
        text: segment.text.slice(cursor, range.start),
        start: segment.start + cursor,
        end: segment.start + range.start,
      });
    }
    cursor = Math.max(cursor, range.end);
  }

  if (cursor < segment.text.length) {
    next.push({
      text: segment.text.slice(cursor),
      start: segment.start + cursor,
      end: segment.end,
    });
  }

  return next;
}

function trimSegments(segments: VoicePlaybackTextSegment[]): VoicePlaybackTextSegment[] {
  return segments
    .map((segment) => {
      const leading = /^\s*/.exec(segment.text)?.[0].length ?? 0;
      const trailing = /\s*$/.exec(segment.text)?.[0].length ?? 0;
      const endOffset = Math.max(leading, segment.text.length - trailing);
      return {
        text: segment.text.slice(leading, endOffset),
        start: segment.start + leading,
        end: segment.start + endOffset,
      };
    })
    .filter((segment) => segment.text.trim().length > 0 && segment.end > segment.start);
}

export function applyVoicePlaybackRules(
  text: string,
  rules?: VoicePlaybackRule[] | null,
): VoicePlaybackTransform {
  const enabledRules = normalizeVoicePlaybackRules(rules).filter(
    (rule) => rule.enabled && rule.pattern.trim().length > 0,
  );
  if (enabledRules.length === 0) {
    return buildTransform([{ text, start: 0, end: text.length }]);
  }

  const includeRules = enabledRules.filter((rule) => rule.rule === "include");
  const excludeRules = enabledRules.filter((rule) => rule.rule === "exclude");

  let segments: VoicePlaybackTextSegment[];

  if (includeRules.length > 0) {
    const includeRanges: Array<{ start: number; end: number }> = [];
    for (const rule of includeRules) {
      try {
        includeRanges.push(...collectMatches(text, compileVoicePlaybackRegex(rule.pattern)));
      } catch (error) {
        console.warn(`Ignoring invalid voice playback include rule '${rule.name}':`, error);
      }
    }
    segments = segmentsFromRanges(text, includeRanges);
  } else {
    segments = [{ text, start: 0, end: text.length }];
  }

  for (const rule of excludeRules) {
    try {
      const regex = compileVoicePlaybackRegex(rule.pattern);
      segments = segments.flatMap((segment) => excludeFromSegment(segment, regex));
    } catch (error) {
      console.warn(`Ignoring invalid voice playback exclude rule '${rule.name}':`, error);
    }
  }

  return buildTransform(trimSegments(segments));
}

function buildTransform(segments: VoicePlaybackTextSegment[]): VoicePlaybackTransform {
  let text = "";
  const map: VoicePlaybackOutputMap[] = [];
  const keptSegments = trimSegments(segments);

  for (const segment of keptSegments) {
    if (text.length > 0) {
      text += " ";
    }
    const outputStart = text.length;
    text += segment.text;
    map.push({
      outputStart,
      outputEnd: text.length,
      sourceStart: segment.start,
      sourceEnd: segment.end,
    });
  }

  return { text, segments: keptSegments, map };
}

export function sourceRangeForPlaybackRange(
  transform: VoicePlaybackTransform,
  playbackStart: number,
  playbackEnd: number,
): { start: number; end: number } | null {
  const overlaps = transform.map.filter(
    (entry) => playbackStart < entry.outputEnd && playbackEnd > entry.outputStart,
  );
  if (overlaps.length === 0) return null;

  let start = Number.POSITIVE_INFINITY;
  let end = 0;
  for (const entry of overlaps) {
    const localStart = Math.max(playbackStart, entry.outputStart) - entry.outputStart;
    const localEnd = Math.min(playbackEnd, entry.outputEnd) - entry.outputStart;
    start = Math.min(start, entry.sourceStart + localStart);
    end = Math.max(end, entry.sourceStart + localEnd);
  }

  return Number.isFinite(start) && end > start ? { start, end } : null;
}
