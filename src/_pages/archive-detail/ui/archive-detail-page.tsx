"use client";

import { useMemo } from "react";
import clsx from "clsx";
import Image from "next/image";

import type { ArchiveItem } from "@entities/archive-card";

import { Container } from "@shared/ui/container";

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

  return (
    <main className={clsx(s.root, className)}>
      <Container className={s.inner}>
        <section className={s.hero}>
          <div className={s.heroMedia}>
            <Image
              className={s.heroImage}
              src={item.imageUrl}
              alt={`${item.artist} — ${item.title}`}
              fill
              priority
            />
          </div>

          <div className={s.heroCopy}>
            <p className={s.kicker}>{item.category}</p>
            <h1 className={s.title}>{item.title}</h1>
            <p className={s.subtitle}>
              {item.artist} <span className={s.dot}>/</span> {item.year}
            </p>
          </div>
        </section>

        <section className={s.content}>
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
        </section>
      </Container>
    </main>
  );
};

ArchiveDetailPage.displayName = "ArchiveDetailPage";
