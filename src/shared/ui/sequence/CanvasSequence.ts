import { calculateSizeImage } from "@shared/utils/calculate-size-image";
import { loaderAllImages } from "@shared/utils/loaders/image";
import { gsap } from "gsap";

type CanvasRenderOptions = {
  canvas: HTMLCanvasElement;
  images: string[];
  defaultIndex?: number;
};

type CalcRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export default class CanvasRender {
  public ref: HTMLCanvasElement;
  public images: string[];

  public ctx: CanvasRenderingContext2D;

  public currentIndex: number;
  private setIndex: number | null;
  private isResize: boolean;

  private width: number;
  private height: number;
  private calc: CalcRect;

  public frameCount: number;
  private textures: Array<HTMLImageElement | null>;

  public isLoaded: boolean;

  private options: CanvasRenderOptions;

  constructor(options: CanvasRenderOptions) {
    this.ref = options.canvas;
    this.images = options.images;

    const ctx = this.ref.getContext("2d");
    if (!ctx) {
      throw new Error("2D context is not supported or canvas is not available");
    }

    this.ctx = ctx;

    this.currentIndex = options?.defaultIndex ?? 0;
    this.setIndex = null;
    this.isResize = false;

    this.width = this.ref.offsetWidth;
    this.height = this.ref.offsetHeight;
    this.calc = { left: 0, top: 0, width: 0, height: 0 };

    this.frameCount = options.images.length - 1;
    this.textures = [];

    this.isLoaded = false;

    this.options = options;
  }

  onLoadedAll: () => void = () => {};

  init = (): void => {
    loaderAllImages(
      this.options.images,
      0,
      (allTextures) => {
        this.textures = allTextures;
      },
      ({ texture, index }) => {
        if (index === this.currentIndex) {
          this.textures[this.currentIndex] = texture;
          this.isLoaded = true;
          this._resize();
          this.addEventListeners();
          this.start();
        }
      },
    );
  };

  _resize = (): void => {
    const { devicePixelRatio } = window;

    this.width = this.ref.offsetWidth;
    this.height = this.ref.offsetHeight;

    this.ref.width = this.width * devicePixelRatio;
    this.ref.height = this.height * devicePixelRatio;

    this.ctx.scale(devicePixelRatio, devicePixelRatio);

    this.ref.style.width = "100%";
    this.ref.style.height = "100%";

    const texture = this.textures?.[this.currentIndex]; // ожидается, что к этому моменту текстура уже загружена

    this.calc = calculateSizeImage(
      this.width,
      this.height,
      {
        orig: {
          width: texture?.naturalWidth || 0,
          height: texture?.naturalHeight || 0,
        },
      },
      true,
    ) as CalcRect;

    this.isResize = true;
  };

  onChangeProgress = (progress: number | string): void => {
    const textureCount =
      this.textures.length - 1 === 0 ? 0 : this.textures.length - 1;
    this.currentIndex = Math.ceil(textureCount * Number(progress));
  };

  updateImage = (): void => {
    const curTexture = this.textures[this.currentIndex];
    if (!curTexture) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    this.ctx.drawImage(
      curTexture,
      this.calc.left,
      this.calc.top,
      this.calc.width,
      this.calc.height,
    );
  };

  render = (): void => {
    if (this.setIndex !== this.currentIndex || this.isResize) {
      this.updateImage();
      this.setIndex = this.currentIndex;
    }

    this.isResize = false;
  };

  start = (): void => {
    gsap.ticker.add(this.render);
  };

  stop = (): void => {
    gsap.ticker.add(this.render);
  };

  destroy = (): void => {
    gsap.ticker.remove(this.render);
    this.removeEventListeners();
  };

  addEventListeners = (): void => {
    window.addEventListener("resize", this._resize);
  };

  removeEventListeners = (): void => {
    window.removeEventListener("resize", this._resize);
  };
}
