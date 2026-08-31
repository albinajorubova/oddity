"use client";

import clsx from "clsx";

import type { CollectionItem } from "@entities/collection-card";

import { Container } from "@shared/ui/container";

import { useLabFlip } from "./use-lab-flip";

import s from "./lab-gallery-page.module.scss";

export type LabGalleryPageProps = {
  className?: string;
  items: CollectionItem[];
};

export const LabGalleryPage = (props: LabGalleryPageProps) => {
  const { className, items } = props;
  const { activeSlug, isOpen, open, close, heroCopyRef } = useLabFlip();
  const activeItem = items.find((item) => item.slug === activeSlug) ?? null;

  return (
    <main className={clsx(s.root, className, isOpen && s.isOpen)}>
      <Container className={s.inner}>
        <header className={s.header}>
          <p className={clsx(s.eyebrow, "typo-micro")}>Lab / Stage 3</p>
          <h1 className={clsx(s.title, "typo-h1")}>GSAP Gallery</h1>
          <p className={clsx(s.note, "typo-p2")}>
            Open и close оба летают через <strong>карточку в сетке</strong> (не
            через hero внизу) — иначе overflow обрезает путь. Close: кнопка или
            повторный клик по активной.
          </p>
          {isOpen && (
            <button
              type="button"
              className={clsx(s.reset, "typo-caption")}
              onClick={close}
            >
              Закрыть (reverse Flip)
            </button>
          )}
        </header>

        <section className={s.gallery} aria-label="Album covers">
          {items.length === 0 ? (
            <p className={clsx(s.note, "typo-p2")}>
              Nothing in the archive yet.
            </p>
          ) : (
            <ul className={s.grid}>
              {items.map((item) => {
                const isActive = item.slug === activeSlug;

                return (
                  <li
                    key={item.id}
                    className={s.card}
                    data-lab-card
                    data-slug={item.slug}
                  >
                    <button
                      type="button"
                      className={s.cardButton}
                      aria-label={`${item.artist} — ${item.title}`}
                      aria-pressed={isActive}
                      onClick={() => open(item.slug)}
                    >
                      <div
                        className={s.slot}
                        data-flip-id={item.slug}
                        data-flip-role="card"
                        hidden={isActive}
                      >
                        <img
                          className={s.image}
                          src={item.imageUrl}
                          alt={`${item.artist} — ${item.title}`}
                          draggable={false}
                        />
                      </div>

                      {isActive && (
                        <div
                          className={clsx(s.slot, s.slotEmpty)}
                          data-slot-empty
                          aria-hidden
                        />
                      )}

                      <div className={s.meta}>
                        <p className={clsx(s.artist, "typo-micro")}>
                          {item.artist}
                        </p>
                        <p className="typo-p2">{item.title}</p>
                        <p className={clsx(s.year, "typo-p2")}>{item.year}</p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className={s.hero} aria-label="Hero slot">
          <p className={clsx(s.heroLabel, "typo-micro")}>Hero slot</p>
          <div className={clsx(s.heroSlot, activeItem && s.heroSlotActive)}>
            {activeItem ? (
              <div
                className={s.heroMedia}
                data-flip-id={activeItem.slug}
                data-flip-role="hero"
              >
                <img
                  className={s.image}
                  src={activeItem.imageUrl}
                  alt={`${activeItem.artist} — ${activeItem.title}`}
                  draggable={false}
                />
              </div>
            ) : (
              <p className={clsx(s.heroPlaceholder, "typo-p2")}>
                сюда прилетит cover
              </p>
            )}
          </div>

          {activeItem ? (
            <div ref={heroCopyRef} className={s.heroCopy}>
              <p className={clsx(s.artist, "typo-micro")}>
                {activeItem.artist}
              </p>
              <p className={clsx(s.heroTitle, "typo-h3")}>{activeItem.title}</p>
              <p className={clsx(s.year, "typo-p2")}>{activeItem.year}</p>
            </div>
          ) : (
            <p className={clsx(s.heroHint, "typo-p2")}>
              Open → close: зеркало FLIP (hero → card).
            </p>
          )}
        </section>
      </Container>
    </main>
  );
};

LabGalleryPage.displayName = "LabGalleryPage";
