import { delayPromise } from "@shared/utils/delay";

// Типы колбэков для удобства переиспользования
type ImageLoadedCallback = (image: HTMLImageElement) => void;

type PerItemCallbackOptions = {
  loaded: number;
  length: number;
  texture: HTMLImageElement | null;
  index: number;
};

export const loaderImage = (
  src: string,
  callback: ImageLoadedCallback,
): void => {
  if (callback) {
    const image = new Image();
    image.crossOrigin = "anonymous";

    const prevLoad: ((this: GlobalEventHandlers, ev: Event) => any) | null =
      image.onload;

    image.onload = function (this: GlobalEventHandlers, ev: Event) {
      callback(image);
      if (prevLoad) {
        // Корректный вызов предыдущего обработчика с нужным контекстом и событием
        prevLoad.call(this, ev);
      }
      // Восстанавливаем обработчик и чистим объект
      image.onload = prevLoad;
      image.remove();
    };

    image.src = src;
  }
};

export const promiseImageLoader = (
  src: string,
  cb?: ImageLoadedCallback,
): Promise<HTMLImageElement> =>
  new Promise<HTMLImageElement>((resolve) => {
    loaderImage(src, (image) => {
      if (cb) cb(image);
      resolve(image);
    });
  });

export const loaderAllImages = (
  images: string[],
  delay: number = 0,
  callbackFinish: (textures: (HTMLImageElement | null)[]) => void,
  callbackPerItem?: (options: PerItemCallbackOptions) => void,
): Promise<HTMLImageElement[]> => {
  let loaded = 0;

  const allPromise = Promise.all(
    images.map((el, index) =>
      delayPromise(delay * index).then(() =>
        promiseImageLoader(el, (image) => {
          loaded += 1;
          if (callbackPerItem) {
            callbackPerItem({
              loaded,
              length: images.length,
              texture: image,
              index,
            });
          }
        }),
      ),
    ),
  );

  allPromise.then((textures) => {
    callbackFinish(textures);
  });

  return allPromise;
};
