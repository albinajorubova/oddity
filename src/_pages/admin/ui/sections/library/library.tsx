"use client";

import { type Ref, useCallback, useMemo, useRef, useState } from "react";
import clsx from "clsx";

import { DelayDelete, SwitchElement } from "@shared/ui/animate-presence";
import { MarkerHighlight } from "@shared/ui/marker";
import {
  ADMIN_FILTERS,
  type AdminCard,
  type AdminFilter,
  countByStatus,
} from "@/_pages/admin/model";

import {
  animateLibraryFilterEnter,
  animateLibraryFilterLeave,
  LIBRARY_FILTER_TRANSITION,
} from "./animate-library-filter";
import { DraftPreview } from "./ui/draft-preview";
import { LibraryCard } from "./ui/library-card";

import s from "./library.module.scss";

export type LibrarySectionProps = {
  className?: string;
  cards: AdminCard[];
};

const FILTER_LABEL: Record<AdminFilter, string> = {
  all: "ALL",
  draft: "DRAFT",
  public: "PUBLIC",
};

export const LibrarySection = (props: LibrarySectionProps) => {
  const { className, cards } = props;
  const [filter, setFilter] = useState<AdminFilter>("draft");
  const skipFirstEnterRef = useRef(true);
  const counts = useMemo(() => countByStatus(cards), [cards]);

  const filtered = useMemo(() => {
    if (filter === "all") return cards;
    return cards.filter((card) => card.publishStatus === filter);
  }, [cards, filter]);

  const featured =
    filter === "public"
      ? null
      : (filtered.find((card) => card.publishStatus === "draft") ?? null);

  const gridCards = featured
    ? filtered.filter((card) => card.id !== featured.id)
    : filtered;

  const emptyMessage =
    filter === "draft"
      ? "No drafts."
      : filter === "public"
        ? "Nothing published yet."
        : "Paste a link to start the archive.";

  const handleEnter = useCallback((node: HTMLElement | null) => {
    if (skipFirstEnterRef.current) {
      skipFirstEnterRef.current = false;
      return;
    }
    animateLibraryFilterEnter(node);
  }, []);

  const handleLeave = useCallback((node: HTMLElement | null) => {
    animateLibraryFilterLeave(node);
  }, []);

  return (
    <section className={clsx(s.root, className)} aria-label="Your cards">
      <div className={s.toolbar}>
        <div className={s.filters} role="tablist" aria-label="Publish status">
          {ADMIN_FILTERS.map((value) => {
            const isActive = filter === value;

            return (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={clsx(
                  s.filter,
                  "typo-caption",
                  isActive && s.isActive,
                )}
                onClick={() => setFilter(value)}
              >
                <MarkerHighlight
                  variant="underline"
                  color="lime"
                  active={isActive}
                  className={s.filterMarker}
                >
                  {FILTER_LABEL[value]}
                </MarkerHighlight>
              </button>
            );
          })}
        </div>
        <p className={clsx(s.counts, "typo-micro")}>
          {counts.draft} DRAFT · {counts.published} PUBLIC
        </p>
      </div>

      <div className={s.stage}>
        <SwitchElement
          mode="wait"
          transitionKey={filter}
          onEnter={handleEnter}
          onLeave={handleLeave}
        >
          <DelayDelete timeout={LIBRARY_FILTER_TRANSITION}>
            {({ ref }) => (
              <div ref={ref as Ref<HTMLDivElement>} className={s.stageInner}>
                {filtered.length === 0 ? (
                  <p className={clsx(s.empty, "typo-micro")}>{emptyMessage}</p>
                ) : (
                  <div className={clsx(s.content, featured && s.withFeatured)}>
                    {featured && <DraftPreview card={featured} />}

                    {gridCards.length > 0 && (
                      <ul className={s.grid}>
                        {gridCards.map((card) => (
                          <li key={card.id} className={s.gridItem}>
                            <LibraryCard card={card} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            )}
          </DelayDelete>
        </SwitchElement>
      </div>
    </section>
  );
};

LibrarySection.displayName = "LibrarySection";
