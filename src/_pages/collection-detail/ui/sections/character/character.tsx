import clsx from "clsx";

import { Container } from "@shared/ui/container";
import { MediaImage } from "@shared/ui/media-image";
import type {
  CollectionCategories,
  CollectionCharacteristics,
  CollectionCover,
} from "@/_pages/collection-detail/model";

import s from "./character.module.scss";

export type CharacterSectionProps = {
  className?: string;
  cover: CollectionCover;
  characteristics?: CollectionCharacteristics;
  categories?: CollectionCategories;
};

const CATEGORY_ORDER: Array<{
  key: keyof CollectionCategories;
  label: string;
}> = [
  { key: "genres", label: "Genres" },
  { key: "themes", label: "Themes" },
  { key: "atmosphere", label: "Atmosphere" },
  { key: "mood", label: "Mood" },
  { key: "tags", label: "Tags" },
];

export const CharacterSection = (props: CharacterSectionProps) => {
  const { className, cover, characteristics, categories } = props;

  const traitWords = [
    ...(characteristics?.oddity ?? []),
    ...(characteristics?.meme ?? []),
  ];
  const categoryRows = CATEGORY_ORDER.flatMap(({ key, label }) => {
    const values = categories?.[key];
    if (!values?.length) return [];
    return [{ label, values }];
  });

  if (!cover.url && traitWords.length === 0 && categoryRows.length === 0) {
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

        <div className={s.layout}>
          <figure className={s.coverPanel}>
            <MediaImage
              className={s.cover}
              src={cover.url}
              alt={cover.alt}
              aspectRatio="1 / 1"
              sizes="40vw"
            />
          </figure>

          <div className={s.copy}>
            {traitWords.length > 0 && (
              <ul className={s.traits}>
                {traitWords.map((tag) => (
                  <li key={tag} className={s.trait}>
                    {tag}
                  </li>
                ))}
              </ul>
            )}

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
          </div>
        </div>
      </Container>
    </section>
  );
};

CharacterSection.displayName = "CharacterSection";
