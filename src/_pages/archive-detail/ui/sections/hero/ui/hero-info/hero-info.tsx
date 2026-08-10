import clsx from "clsx";

import { Link } from "@shared/ui/link";
import type { ArchiveDetail } from "@/_pages/archive-detail/model";

import s from "./hero-info.module.scss";

export type HeroInfoProps = {
  className?: string;
  item: ArchiveDetail;
};

export const HeroInfo = (props: HeroInfoProps) => {
  const { className, item } = props;
  const paragraphs = Array.isArray(item.shortDescription)
    ? item.shortDescription
    : [item.shortDescription];

  return (
    <div className={clsx(s.root, className)}>
      <p className={s.kicker}>
        ALBUM
        <span className={s.sep}> / </span>
        {item.year}
        <span className={s.sep}> / </span>
        {item.country.toUpperCase()}
      </p>

      <h1 className={s.title}>{item.title}</h1>

      <p className={s.artist}>{item.artist}</p>

      <div className={s.description}>
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      {item.editorNote && <p className={s.editorNote}>{item.editorNote}</p>}

      <dl className={s.facts}>
        {item.label && (
          <div className={s.fact}>
            <dt className={s.factLabel}>Label</dt>
            <dd className={s.factValue}>{item.label}</dd>
          </div>
        )}
        {item.duration && (
          <div className={s.fact}>
            <dt className={s.factLabel}>Duration</dt>
            <dd className={s.factValue}>{item.duration}</dd>
          </div>
        )}
        <div className={s.fact}>
          <dt className={s.factLabel}>Status</dt>
          <dd className={s.factValue}>{item.status}</dd>
        </div>
      </dl>

      {item.availability.length > 0 && (
        <div className={s.availability}>
          <p className={s.availabilityLabel}>Available on</p>
          <ul className={s.availabilityList}>
            {item.availability.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className={s.availabilityLink}>
                  {link.label} ↗
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

HeroInfo.displayName = "HeroInfo";
