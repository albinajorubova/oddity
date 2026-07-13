import type { MediaWithBreakpoints, RebuiltImage } from "@/shared/types";

type ResolveSourceParams = {
  src?: string;
  image?: RebuiltImage;
  source?: MediaWithBreakpoints;
};

/**
 * Приводит один из вариантов входного источника (src / image / source)
 * к единому виду MediaWithBreakpoints.
 */
export const resolveSource = ({
  src,
  image,
  source,
}: ResolveSourceParams): MediaWithBreakpoints | undefined => {
  if (src) {
    return {
      default: {
        url: src,
        originalUrl: src,
        mediaType: "image" as const,
      } as RebuiltImage,
    };
  }

  if (image) {
    return { default: image };
  }

  return source;
};
