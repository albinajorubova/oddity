import clsx from "clsx";

import type { RebuiltMedia } from "@shared/types";
import { MediaImage } from "@shared/ui/media-image";
import { SwitchTransition } from "@shared/ui/transition";

import s from "./ImageSwitcher.module.scss";

export type ImageSwitcherProps = {
  className: string;
  curImage?: RebuiltMedia | null;
  imagesPreload: RebuiltMedia[];
  timeout?: number;
};

export const ImageSwitcher = (props: ImageSwitcherProps) => {
  const { className, curImage, imagesPreload, timeout = 0 } = props;

  return (
    <div className={clsx(s.root, className)}>
      <SwitchTransition mode="default" state={curImage} timeout={timeout}>
        {(state, _stage) =>
          state && (
            <MediaImage
              height="100%"
              className={s.image}
              alt={state.alt || ""}
              src={state.url}
            />
          )
        }
      </SwitchTransition>

      {imagesPreload && (
        <div className={s.preloadImage}>
          {imagesPreload.map((img) => (
            <MediaImage
              key={img.id || Math.random()}
              alt={img.alt || ""}
              src={img.url}
            />
          ))}
        </div>
      )}
    </div>
  );
};
