import clsx from "clsx";

import { Container } from "@shared/ui/container";
import type { CollectionTrack } from "@/_pages/collection-detail/model";

import s from "./tracks.module.scss";

export type TracksSectionProps = {
  className?: string;
  tracks: CollectionTrack[];
};

export const TracksSection = (props: TracksSectionProps) => {
  const { className, tracks } = props;

  if (!tracks.length) return null;

  return (
    <section
      id="tracks"
      className={clsx(s.root, className)}
      aria-label="Tracklist"
      data-anchor-scroll="top"
    >
      <Container className={s.inner}>
        <p className={clsx(s.eyebrow, "typo-micro")}>Tracks</p>
        <ol className={s.list}>
          {tracks.map((track, index) => (
            <li key={track.id} className={s.row}>
              <span className={clsx(s.index, "typo-caption")}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="typo-p1">{track.title}</span>
              {track.duration && (
                <span className={clsx(s.duration, "typo-caption")}>
                  {track.duration}
                </span>
              )}
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
};

TracksSection.displayName = "TracksSection";
