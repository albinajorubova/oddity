import type { AnimationType } from "../animations";

export type GetAnimationTypeParams = {
  prevRoute: string | null;
  nextRoute: string;
  slug?: string;
};

export function getAnimationType({
  prevRoute,
  nextRoute,
  slug,
}: GetAnimationTypeParams): AnimationType {
  const fromHome = prevRoute === "/";
  const toHome = nextRoute === "/";
  const fromArchive = prevRoute === "/archive/[slug]";
  const toArchive = nextRoute === "/archive/[slug]";

  if (fromHome && toArchive && slug) {
    const card = document.querySelector(
      `[data-flip-id="${slug}"][data-flip-role="card"]`,
    );
    const hero = document.querySelector(
      `[data-flip-id="${slug}"][data-flip-role="hero"]`,
    );
    if (card && hero) return "home-to-archive";
  }

  if (fromArchive && toHome && slug) {
    const card = document.querySelector(
      `[data-flip-id="${slug}"][data-flip-role="card"]`,
    );
    const hero = document.querySelector(
      `[data-flip-id="${slug}"][data-flip-role="hero"]`,
    );
    if (card && hero) return "archive-to-home";
  }

  return "fade";
}
