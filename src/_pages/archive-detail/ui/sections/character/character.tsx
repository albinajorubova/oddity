import clsx from "clsx";

import { Container } from "@shared/ui/container";
import { MediaImage } from "@shared/ui/media-image";
import type {
  ArchiveCategories,
  ArchiveCharacteristics,
  ArchiveGallerySlide,
} from "@/_pages/archive-detail/model";

import s from "./character.module.scss";

export type CharacterSectionProps = {
  className?: string;
  title: string;
  gallery: ArchiveGallerySlide[];
  characteristics?: ArchiveCharacteristics;
  categories?: ArchiveCategories;
};

const CATEGORY_ORDER: Array<{
  key: keyof ArchiveCategories;
  label: string;
}> = [
  { key: "genres", label: "Genres" },
  { key: "themes", label: "Themes" },
  { key: "atmosphere", label: "Atmosphere" },
  { key: "mood", label: "Mood" },
  { key: "tags", label: "Tags" },
];

export const CharacterSection = (props: CharacterSectionProps) => {
  const { className, title, gallery, characteristics, categories } = props;

  const primary = gallery[0];
  const secondary = gallery[1] ?? gallery[0];
  const traitWords = [
    ...(characteristics?.oddity ?? []),
    ...(characteristics?.meme ?? []),
  ];
  const categoryRows = CATEGORY_ORDER.flatMap(({ key, label }) => {
    const values = categories?.[key];
    if (!values?.length) return [];
    return [{ label, values }];
  });

  if (!primary && traitWords.length === 0 && categoryRows.length === 0) {
    return null;
  }

  return (
    <section
      id="dna"
      className={clsx(s.root, className)}
      aria-label="Album DNA"
      data-anchor-scroll="top"
    >
      <Container className={s.inner}>
        <p className={s.eyebrow}>DNA</p>

        <div className={s.diptych}>
          <figure className={s.panel}>
            {primary && (
              <MediaImage
                className={s.cover}
                src={primary.url}
                alt={primary.alt || `${title} cover`}
                aspectRatio="1 / 1"
                sizes="42vw"
              />
            )}
          </figure>

          <figure className={clsx(s.panel, s.panelSecondary)}>
            {secondary && (
              <MediaImage
                className={s.cover}
                src={secondary.url}
                alt={secondary.alt || `${title} artwork`}
                aspectRatio="1 / 1"
                sizes="36vw"
              />
            )}
            {traitWords.length > 0 && (
              <ul className={s.traits}>
                {traitWords.map((tag) => (
                  <li key={tag} className={s.trait}>
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </figure>
        </div>

        {categoryRows.length > 0 && (
          <ul className={s.folio}>
            {categoryRows.map((row) => (
              <li key={row.label} className={s.folioItem}>
                <span className={s.folioLabel}>{row.label}</span>
                <span className={s.folioValues}>
                  {row.values.join(" · ")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
};

CharacterSection.displayName = "CharacterSection";
