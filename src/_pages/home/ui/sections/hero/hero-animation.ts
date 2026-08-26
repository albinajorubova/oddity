import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

import { lerp } from "@shared/utils";

import { HERO_ANIM, HERO_PHASES, HERO_PROGRESS } from "./hero-config";

export type HeroAnimationClasses = {
  isFlying: string;
  isExpanding: string;
  isExpanded: string;
  isCopyVisible: string;
};

export type HeroAnimationElements = {
  section: HTMLElement;
  logo: HTMLElement;
  content: HTMLElement;
  copy: HTMLElement;
  headerLogo: HTMLElement;
  headerInner: HTMLElement;
  expandImage: HTMLElement | null;
  flyImages: HTMLElement[];
  classes: HeroAnimationClasses;
  setLogoDisabled: (disabled: boolean) => void;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const phaseProgress = (progress: number, start: number, end: number) => {
  if (end === start) return progress >= end ? 1 : 0;
  return clamp01((progress - start) / (end - start));
};

const centerOf = (el: HTMLElement) => {
  const { left, top, width, height } = el.getBoundingClientRect();
  return { x: left + width / 2, y: top + height / 2 };
};

const fontSizeOf = (el: HTMLElement) =>
  Number.parseFloat(getComputedStyle(el).fontSize) || 0;

const easeExpand = (t: number) => 1 - (1 - t) ** HERO_ANIM.expandEasePower;

type LogoMetrics = {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  scale: number;
};

type ExpandMetrics = {
  dy: number;
  startW: number;
  startH: number;
  contentW: number;
  contentH: number;
  contentLeft: number;
  contentTop: number;
};

export const createHeroAnimation = (els: HeroAnimationElements) => {
  const { classes } = els;

  let progress = 0;
  let refreshing = false;
  let pinProgress = false;
  let pinnedScroll = 0;

  const logoMetrics: LogoMetrics = {
    fromX: 0,
    fromY: 0,
    toX: 0,
    toY: 0,
    scale: 1,
  };
  const flyMetrics = new Map<HTMLElement, { x: number; y: number }>();
  let expandMetrics: ExpandMetrics = {
    dy: 0,
    startW: 0,
    startH: 0,
    contentW: 0,
    contentH: 0,
    contentLeft: 0,
    contentTop: 0,
  };
  let hasCaptured = false;
  let morphing = false;

  const setMorphing = (next: boolean) => {
    if (morphing === next) return;
    morphing = next;
    els.setLogoDisabled(next);
  };

  /** Measure only from layout rest — logo must not be flying. */
  const capture = () => {
    const from = centerOf(els.logo);
    const to = centerOf(els.headerInner);

    logoMetrics.fromX = from.x;
    logoMetrics.fromY = from.y;
    logoMetrics.toX = to.x;
    logoMetrics.toY = to.y;
    logoMetrics.scale = fontSizeOf(els.headerInner) / fontSizeOf(els.logo) || 1;

    flyMetrics.clear();
    els.flyImages.forEach((image) => {
      const c = centerOf(image);
      const dx = c.x - from.x;
      const dy = c.y - from.y;
      const len = Math.hypot(dx, dy) || 1;
      flyMetrics.set(image, { x: dx / len, y: dy / len });
    });

    if (els.expandImage) {
      const contentBox = els.content.getBoundingClientRect();
      const imgBox = els.expandImage.getBoundingClientRect();
      const gallery = els.expandImage.offsetParent as HTMLElement | null;
      const galleryBox = gallery?.getBoundingClientRect() ?? contentBox;

      const startCy = imgBox.top + imgBox.height / 2;
      const endCy = contentBox.top + contentBox.height / 2;

      expandMetrics = {
        dy: endCy - startCy,
        startW: imgBox.width,
        startH: imgBox.height,
        contentW: contentBox.width,
        contentH: contentBox.height,
        contentLeft: contentBox.left - galleryBox.left,
        contentTop: contentBox.top - galleryBox.top,
      };
    }

    hasCaptured = true;
  };

  const resetHero = () => {
    els.logo.classList.remove(classes.isFlying);
    gsap.set(els.logo, {
      clearProps:
        "x,y,xPercent,yPercent,scale,transform,opacity,visibility,pointerEvents",
    });

    els.flyImages.forEach((image) => {
      gsap.set(image, { clearProps: "transform,opacity,visibility" });
    });

    if (els.expandImage) {
      els.expandImage.classList.remove(classes.isExpanding, classes.isExpanded);
      gsap.set(els.expandImage, {
        clearProps:
          "transform,x,y,top,left,right,bottom,width,height,maxHeight,margin,aspectRatio,opacity,visibility,zIndex,borderRadius",
      });
    }

    els.copy.classList.remove(classes.isCopyVisible);
    gsap.set(els.copy, { autoAlpha: 0, y: HERO_ANIM.copyYOffset });
    gsap.set(els.headerLogo, { autoAlpha: 0, pointerEvents: "none" });
    hasCaptured = false;
    setMorphing(false);
  };

  const renderLogo = (morph: number) => {
    const settled = morph >= 1;

    els.logo.classList.add(classes.isFlying);
    gsap.set(els.logo, {
      xPercent: -50,
      yPercent: -50,
      x: lerp(logoMetrics.fromX, logoMetrics.toX, morph),
      y: lerp(logoMetrics.fromY, logoMetrics.toY, morph),
      scale: lerp(1, logoMetrics.scale, morph),
      autoAlpha: settled ? 0 : 1,
      pointerEvents: "none",
      force3D: true,
    });

    gsap.set(els.headerLogo, {
      autoAlpha: settled ? 1 : 0,
      pointerEvents: settled ? "auto" : "none",
    });
  };

  const renderFlyImages = (morph: number) => {
    flyMetrics.forEach((dir, image) => {
      gsap.set(image, {
        x: dir.x * window.innerWidth * HERO_ANIM.flyDistance * morph,
        y: dir.y * window.innerHeight * HERO_ANIM.flyDistance * morph,
        scale: 1 + HERO_ANIM.flyScaleAmount * morph,
        autoAlpha: 1 - morph,
      });
    });
  };

  const renderExpandImage = (expand: number) => {
    if (!els.expandImage) return;

    const done = expand >= 1;
    const lift = phaseProgress(expand, 0, HERO_ANIM.expandLiftRatio);
    const grow = phaseProgress(expand, HERO_ANIM.expandLiftRatio, 1);
    const liftEased = easeExpand(lift);
    const growEased = easeExpand(grow);

    els.expandImage.classList.toggle(
      classes.isExpanding,
      expand > HERO_ANIM.expandActiveThreshold && !done,
    );
    els.expandImage.classList.toggle(classes.isExpanded, done);

    if (done) {
      gsap.set(els.expandImage, {
        clearProps:
          "transform,x,y,top,left,right,bottom,width,height,maxHeight,margin,aspectRatio,borderRadius",
        zIndex: HERO_ANIM.expandZIndex,
        autoAlpha: 1,
      });
      return;
    }

    if (grow <= 0) {
      gsap.set(els.expandImage, {
        clearProps:
          "top,left,right,bottom,width,height,maxHeight,margin,aspectRatio",
        x: 0,
        y: expandMetrics.dy * liftEased,
        borderRadius: HERO_ANIM.expandBorderRadiusFrom,
        zIndex: HERO_ANIM.expandZIndex,
        autoAlpha: 1,
        force3D: true,
      });
      return;
    }

    const { startW, startH, contentW, contentH, contentLeft, contentTop } =
      expandMetrics;
    const w = lerp(startW, contentW, growEased);
    const h = lerp(startH, contentH, growEased);

    gsap.set(els.expandImage, {
      x: 0,
      y: 0,
      top: contentTop + (contentH - h) / 2,
      left: contentLeft + (contentW - w) / 2,
      width: w,
      height: h,
      bottom: "auto",
      right: "auto",
      margin: 0,
      maxHeight: "none",
      aspectRatio: "auto",
      borderRadius: lerp(HERO_ANIM.expandBorderRadiusFrom, 0, growEased),
      zIndex: HERO_ANIM.expandZIndex,
      autoAlpha: 1,
    });
  };

  const renderCopy = (copy: number) => {
    const done = copy >= HERO_PROGRESS.endEpsilon;
    els.copy.classList.toggle(classes.isCopyVisible, done);

    if (done) {
      gsap.set(els.copy, {
        clearProps: "opacity,visibility,transform",
      });
      return;
    }

    gsap.set(els.copy, {
      autoAlpha: copy,
      y: (1 - copy) * HERO_ANIM.copyYOffset,
    });
  };

  const renderHero = (p: number) => {
    if (p <= 0) {
      progress = 0;
      pinProgress = false;
      resetHero();
      return;
    }

    if (!hasCaptured) {
      if (els.logo.classList.contains(classes.isFlying)) {
        els.logo.classList.remove(classes.isFlying);
        gsap.set(els.logo, {
          clearProps:
            "x,y,xPercent,yPercent,scale,transform,opacity,visibility,pointerEvents",
        });
      }
      capture();
    }

    const morph = phaseProgress(p, 0, HERO_PHASES.morphEnd);
    const expand = phaseProgress(p, 0, HERO_PHASES.expandEnd);
    const copy = phaseProgress(p, HERO_PHASES.expandEnd, 1);
    const settled = morph >= 1;

    renderLogo(morph);
    renderFlyImages(morph);
    renderExpandImage(expand);
    renderCopy(copy);
    setMorphing(!settled);
  };

  const restoreScrollToProgress = (self: ScrollTrigger, p: number) => {
    const distance = self.end - self.start;
    if (distance <= 0) return self.scroll();
    const target = self.start + clamp01(p) * distance;
    const lenis = window.__GLOBAL_SCROLL__;
    if (lenis) {
      lenis.scrollTo(target, { immediate: true, force: true });
    } else {
      self.scroll(target);
    }
    return target;
  };

  capture();
  gsap.set(els.headerLogo, { autoAlpha: 0, pointerEvents: "none" });
  gsap.set(els.copy, { autoAlpha: 0, y: HERO_ANIM.copyYOffset });

  const trigger = ScrollTrigger.create({
    trigger: els.section,
    scroller: "#scroll",
    start: "top top",
    end: "bottom bottom",
    invalidateOnRefresh: true,
    onRefreshInit: () => {
      refreshing = true;
    },
    onRefresh: (self) => {
      if (progress >= HERO_PROGRESS.endEpsilon) progress = 1;

      pinnedScroll = restoreScrollToProgress(self, progress);
      pinProgress = true;
      resetHero();
      capture();
      renderHero(progress);

      requestAnimationFrame(() => {
        pinnedScroll = restoreScrollToProgress(self, progress);
        refreshing = false;
      });
    },
    onUpdate: (self) => {
      if (refreshing) return;

      if (pinProgress) {
        const synced = Math.abs(self.progress - progress) <= 0.02;
        const userScrolled = Math.abs(self.scroll() - pinnedScroll) > 40;

        if (synced || userScrolled) {
          pinProgress = false;
          progress = self.progress;
        }

        renderHero(progress);
        return;
      }

      progress = self.progress;
      renderHero(progress);
    },
  });

  const destroy = () => {
    trigger.kill();
    progress = 0;
    pinProgress = false;
    resetHero();
    gsap.set(els.headerLogo, {
      clearProps: "opacity,visibility,pointerEvents",
    });
  };

  return { destroy };
};
