"use client";

import { useLayoutEffect, useState } from "react";
import clsx from "clsx";
import { gsap } from "gsap";

import { Animate, SplitTextAnimate } from "@shared/ui/animate";
import { Link } from "@shared/ui/link";
import { TRANSITION_DURATION } from "@widgets/transition-layout/constants";
import { useTransitionLayout } from "@widgets/transition-layout/hooks/use-transition-layout";
import type { ArchiveDetail } from "@/_pages/archive-detail/model";

import s from "./hero-info.module.scss";

export type HeroInfoProps = {
  className?: string;
  item: ArchiveDetail;
};

export const HeroInfo = (props: HeroInfoProps) => {
  const { className, item } = props;
  const { isVisible: pageReady, transitionStarted } = useTransitionLayout();
  const paragraphs = Array.isArray(item.shortDescription)
    ? item.shortDescription
    : [item.shortDescription];

  const [visible, setVisible] = useState(false);
  /** Снимаем opacity обёртки на кадр позже — SplitText успевает взять начальный y */
  const [revealed, setRevealed] = useState(false);

  useLayoutEffect(() => {
    // Прямой заход / переход уже закончен — сразу
    if (!transitionStarted || pageReady) {
      setVisible(true);
      return;
    }

    // Во время morph — чуть раньше полного конца (~CONTENT_IN)
    const delay = gsap.delayedCall(TRANSITION_DURATION.CONTENT_IN, () => {
      setVisible(true);
    });

    return () => {
      delay.kill();
    };
  }, [transitionStarted, pageReady]);

  useLayoutEffect(() => {
    if (!visible) {
      setRevealed(false);
      return;
    }
    const id = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(id);
  }, [visible]);

  return (
    <div
      className={clsx(s.root, className, !revealed && s.isPending)}
      data-archive-hero-info
      aria-hidden={!revealed}
    >
      <Animate isVisible={visible} data="fadeTop" delay={0} duration={0.4}>
        <p className={s.kicker}>
          ALBUM
          <span className={s.sep}> / </span>
          {item.year}
          <span className={s.sep}> / </span>
          {item.country.toUpperCase()}
        </p>
      </Animate>

      <SplitTextAnimate
        as="h1"
        className={s.title}
        type="word"
        isVisible={visible}
        stagger={0.08}
        duration={0.55}
        delay={0.05}
      >
        {item.title}
      </SplitTextAnimate>

      <Animate
        isVisible={visible}
        data="fadeTop"
        delay={0.28}
        duration={0.45}
      >
        <p className={s.artist}>{item.artist}</p>
      </Animate>

      <Animate
        isVisible={visible}
        data="fadeTop"
        delay={0.4}
        duration={0.5}
      >
        <div className={s.description}>
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Animate>

      {item.editorNote && (
        <Animate
          isVisible={visible}
          data="fadeTop"
          delay={0.5}
          duration={0.45}
        >
          <p className={s.editorNote}>{item.editorNote}</p>
        </Animate>
      )}

      <Animate
        isVisible={visible}
        data="fadeTop"
        delay={0.58}
        duration={0.45}
      >
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
      </Animate>

      {item.availability.length > 0 && (
        <Animate
          isVisible={visible}
          data="fadeTop"
          delay={0.68}
          duration={0.45}
        >
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
        </Animate>
      )}
    </div>
  );
};

HeroInfo.displayName = "HeroInfo";
