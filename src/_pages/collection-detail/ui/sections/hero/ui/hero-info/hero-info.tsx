"use client";

import { useLayoutEffect, useState } from "react";
import { TRANSITION_DURATION } from "@widgets/transition-layout/constants";
import { useTransitionLayout } from "@widgets/transition-layout/hooks/use-transition-layout";
import clsx from "clsx";
import { gsap } from "gsap";

import { Animate, SplitTextAnimate } from "@shared/ui/animate";
import { Button } from "@shared/ui/button";
import type { CollectionDetail } from "@/_pages/collection-detail/model";

import s from "./hero-info.module.scss";

export type HeroInfoProps = {
  className?: string;
  item: CollectionDetail;
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
      data-collection-hero-info
      aria-hidden={!revealed}
    >
      <Animate isVisible={visible} data="fadeTop" delay={0} duration={0.4}>
        <p className={clsx(s.kicker, "typo-micro")}>
          ALBUM
          <span className={s.sep}> / </span>
          {item.year}
          <span className={s.sep}> / </span>
          {item.country.toUpperCase()}
        </p>
      </Animate>

      <SplitTextAnimate
        as="h1"
        className={clsx(s.title, "typo-h1")}
        type="word"
        isVisible={visible}
        stagger={0.08}
        duration={0.55}
        delay={0.05}
      >
        {item.title}
      </SplitTextAnimate>

      <Animate isVisible={visible} data="fadeTop" delay={0.28} duration={0.45}>
        <p className={clsx(s.artist, "typo-p1")}>{item.artist}</p>
      </Animate>

      <Animate isVisible={visible} data="fadeTop" delay={0.4} duration={0.5}>
        <div className={clsx(s.description, "typo-p2")}>
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Animate>

      {item.editorNote && (
        <Animate isVisible={visible} data="fadeTop" delay={0.5} duration={0.45}>
          <p className={clsx(s.editorNote, "typo-p2")}>{item.editorNote}</p>
        </Animate>
      )}

      <Animate isVisible={visible} data="fadeTop" delay={0.58} duration={0.45}>
        <dl className={s.facts}>
          {item.label && (
            <div className={s.fact}>
              <dt className={clsx(s.factLabel, "typo-micro")}>Label</dt>
              <dd className="typo-p2">{item.label}</dd>
            </div>
          )}
          {item.duration && (
            <div className={s.fact}>
              <dt className={clsx(s.factLabel, "typo-micro")}>Duration</dt>
              <dd className="typo-p2">{item.duration}</dd>
            </div>
          )}
          <div className={s.fact}>
            <dt className={clsx(s.factLabel, "typo-micro")}>Status</dt>
            <dd className="typo-p2">{item.status}</dd>
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
            <p className={clsx(s.availabilityLabel, "typo-micro")}>
              Available on
            </p>
            <ul className={s.availabilityList}>
              {item.availability.map((link) => (
                <li key={link.label}>
                  <Button
                    href={link.href}
                    className={clsx(s.availabilityLink, "typo-p2")}
                  >
                    {link.label} ↗
                  </Button>
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
