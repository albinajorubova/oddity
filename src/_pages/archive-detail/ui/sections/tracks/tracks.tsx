import clsx from "clsx";

import { Container } from "@shared/ui/container";
import type { ArchiveTrack } from "@/_pages/archive-detail/model";

import s from "./tracks.module.scss";

export type TracksSectionProps = {
  className?: string;
  tracks: ArchiveTrack[];
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
        <p className={s.eyebrow}>Tracks</p>
        <ol className={s.list}>
          {tracks.map((track, index) => (
            <li key={track.id} className={s.row}>
              <span className={s.index}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className={s.title}>{track.title}</span>
              {track.duration && (
                <span className={s.duration}>{track.duration}</span>
              )}
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
};

TracksSection.displayName = "TracksSection";
