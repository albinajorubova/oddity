// Расширяем стандартные типы DOM для поддержки webkit и ms методов
interface FullscreenDocument extends Document {
  webkitFullscreenElement?: Element | null;
  msFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
}

interface FullscreenVideoElement extends HTMLVideoElement {
  webkitRequestFullscreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
  webkitEnterFullscreen?: () => void;
  webkitDisplayingFullscreen?: boolean;
  webkitExitFullscreen?: () => void;
}

export const getElement = (): Element | null => {
  const fullscreenDocument = document as FullscreenDocument;

  return (
    fullscreenDocument.fullscreenElement ||
    fullscreenDocument.webkitFullscreenElement ||
    fullscreenDocument.msFullscreenElement ||
    null
  );
};

export const setControls = (el: HTMLVideoElement): Promise<void> =>
  new Promise((resolve) => {
    el.setAttribute("controls", "controls");
    requestAnimationFrame(() => resolve());
  });

export const removeControls = (el: HTMLVideoElement): Promise<void> =>
  new Promise((resolve) => {
    el.removeAttribute("controls");
    requestAnimationFrame(() => resolve());
  });

export const openFullscreen = async (el: FullscreenVideoElement | null) => {
  if (!el) return;
  try {
    await setControls(el);

    if (el.requestFullscreen) {
      await el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) {
      await el.webkitRequestFullscreen();
    } else if (el.msRequestFullscreen) {
      await el.msRequestFullscreen();
    } else if (el.webkitEnterFullscreen) {
      el.webkitEnterFullscreen();
    }
  } catch (e) {
    console.error("Ошибка при открытии fullscreen:", e);
  }
};

export const closeFullscreen = async (el?: FullscreenVideoElement | null) => {
  try {
    const fullscreenDocument = document as FullscreenDocument;

    if (getElement()) {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (fullscreenDocument.webkitExitFullscreen) {
        await fullscreenDocument.webkitExitFullscreen();
      } else if (fullscreenDocument.msExitFullscreen) {
        await fullscreenDocument.msExitFullscreen();
      }
    } else if (el?.webkitDisplayingFullscreen && el.webkitExitFullscreen) {
      el.webkitExitFullscreen();
    }
  } catch (e) {
    console.error("Ошибка при закрытии fullscreen:", e);
  }
};
