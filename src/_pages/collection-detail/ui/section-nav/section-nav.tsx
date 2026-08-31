"use client";

import { useEffect, useState } from "react";
import { useScroll } from "@widgets/scroll/hooks/use-scroll";
import clsx from "clsx";

import { MarkerHighlight } from "@shared/ui/marker";
import type {
  CollectionSectionId,
  CollectionSectionNavItem,
} from "@/_pages/collection-detail/model";

import s from "./section-nav.module.scss";

export type SectionNavProps = {
  className?: string;
  items: CollectionSectionNavItem[];
};

const resolveActiveId = (ids: CollectionSectionId[]): CollectionSectionId => {
  const probe = window.innerHeight * 0.35;
  let active: CollectionSectionId = ids[0] ?? "core";
  let best = Number.POSITIVE_INFINITY;

  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el) continue;

    const top = el.getBoundingClientRect().top;
    const distance = Math.abs(top - probe);

    if (top <= probe + 8 && distance < best) {
      best = distance;
      active = id;
    }
  }

  return active;
};

export const SectionNav = (props: SectionNavProps) => {
  const { className, items } = props;
  const ids = items.map((item) => item.id);
  const idsKey = ids.join("|");
  const [activeId, setActiveId] = useState<CollectionSectionId>(
    ids[0] ?? "core",
  );

  useScroll(() => {
    if (!ids.length) return;
    setActiveId(resolveActiveId(ids));
  }, [idsKey]);

  useEffect(() => {
    if (!ids.length) return;
    setActiveId(resolveActiveId(ids));
  }, [idsKey]);

  if (items.length < 2) return null;

  return (
    <nav className={clsx(s.root, className)} aria-label="Page sections">
      <ul className={s.list}>
        {items.map((item) => {
          const isActive = item.id === activeId;

          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={clsx(s.link, isActive && s.active)}
                aria-current={isActive ? "true" : undefined}
              >
                <MarkerHighlight
                  variant="background"
                  active={isActive}
                  className={s.marker}
                >
                  <span className="typo-micro">{item.label}</span>
                </MarkerHighlight>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

SectionNav.displayName = "SectionNav";
