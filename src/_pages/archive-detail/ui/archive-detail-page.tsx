"use client";

import { useMemo } from "react";
import clsx from "clsx";
import Image from "next/image";

import type { ArchiveItem } from "@entities/archive-card";

import { Container } from "@shared/ui/container";
import { mod } from "@shared/utils";

import s from "./archive-detail-page.module.scss";

export type ArchiveDetailPageProps = {
  className?: string;
  item: ArchiveItem;
};

export const ArchiveDetailPage = (props: ArchiveDetailPageProps) => {
  const { className, item } = props;

  const facts = useMemo(
    () => [
      { label: "Artist", value: item.artist },
      { label: "Title", value: item.title },
      { label: "Year", value: String(item.year) },
      { label: "Category", value: item.category },
    ],
    [item],
  );

  const mediaItems = useMemo(
    () => [
      { id: "cover", url: item.imageUrl, aspect: item.aspect },
      ...(item.galleryImages ?? []).map((image, index) => ({
        id: `gallery-${index}`,
        url: image.url,
        aspect: image.aspect,
      })),
    ],
    [item],
  );

  return (
    <main className={clsx(s.root, className)}>
      <Container className={s.inner}>
        <div className={s.layout}>
          <div className={s.copy}>
            <header className={s.heroCopy}>
              <p className={s.kicker}>{item.category}</p>
              <h1 className={s.title}>{item.title}</h1>
              <p className={s.subtitle}>
                {item.artist} <span className={s.dot}>/</span> {item.year}
              </p>
            </header>

            <div className={s.summary}>
              <p className={s.lead}>
                A singular artifact from the ODDITY archive, presented as a
                dedicated detail page with its cover, metadata, and supporting
                context.
              </p>
            </div>

            <dl className={s.meta}>
              {facts.map((fact) => (
                <div key={fact.label} className={s.metaRow}>
                  <dt className={s.metaLabel}>{fact.label}</dt>
                  <dd className={s.metaValue}>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <aside className={s.media}>
            {mediaItems.map((image, index) => (
              <div
                key={image.id}
                className={clsx(s.mediaItem, mod(s, { aspect: image.aspect }))}
              >
                <Image
                  className={s.mediaImage}
                  src={image.url}
                  alt={`${item.title} — image ${index + 1}`}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 42vw"
                />
              </div>
            ))}
          </aside>
        </div>
      </Container>
    </main>
  );
};

ArchiveDetailPage.displayName = "ArchiveDetailPage";
