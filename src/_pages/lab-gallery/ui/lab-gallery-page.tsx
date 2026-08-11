"use client";

import clsx from "clsx";

import { Container } from "@shared/ui/container";

import { LAB_GALLERY_ITEMS } from "../model";

import { useLabFlip } from "./use-lab-flip";

import s from "./lab-gallery-page.module.scss";

export type LabGalleryPageProps = {
  className?: string;
};

/**
 * Lab / этапы 2–3 — open Flip + close reverse.
 *
 * Open:  card → hero
 * Close: кнопка «Закрыть» или повторный клик по активной карточке → hero → card
 */
export const LabGalleryPage = (props: LabGalleryPageProps) => {
  const { className } = props;
  const { activeSlug, isOpen, open, close, heroCopyRef } = useLabFlip();
  const activeItem =
    LAB_GALLERY_ITEMS.find((item) => item.slug === activeSlug) ?? null;

  return (
    <main className={clsx(s.root, className, isOpen && s.isOpen)}>
      <Container className={s.inner}>
        <header className={s.header}>
          <p className={s.eyebrow}>Lab / Stage 3</p>
          <h1 className={s.title}>GSAP Gallery</h1>
          <p className={s.note}>
            Open и close оба летают через <strong>карточку в сетке</strong> (не
            через hero внизу) — иначе overflow обрезает путь. Close: кнопка или
            повторный клик по активной.
          </p>
          {isOpen && (
            <button type="button" className={s.reset} onClick={close}>
              Закрыть (reverse Flip)
            </button>
          )}
        </header>

        <section className={s.gallery} aria-label="Album covers">
          <ul className={s.grid}>
            {LAB_GALLERY_ITEMS.map((item) => {
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
                      <p className={s.artist}>{item.artist}</p>
                      <p className={s.cardTitle}>{item.title}</p>
                      <p className={s.year}>{item.year}</p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className={s.hero} aria-label="Hero slot">
          <p className={s.heroLabel}>Hero slot</p>
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
              <p className={s.heroPlaceholder}>сюда прилетит cover</p>
            )}
          </div>

          {activeItem ? (
            <div ref={heroCopyRef} className={s.heroCopy}>
              <p className={s.artist}>{activeItem.artist}</p>
              <p className={s.heroTitle}>{activeItem.title}</p>
              <p className={s.year}>{activeItem.year}</p>
            </div>
          ) : (
            <p className={s.heroHint}>
              Open → close: зеркало FLIP (hero → card).
            </p>
          )}
        </section>
      </Container>
    </main>
  );
};

LabGalleryPage.displayName = "LabGalleryPage";
