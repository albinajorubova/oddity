"use client";

import { useDataStore } from "@app/model/data-store/hooks/use-data-store";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { Content } from "@widgets/content";

import { Link } from "@shared/ui/link";
import { MediaImage } from "@shared/ui/media-image";
import type { HomePageProps } from "@/_pages/home/model/schemas";

import styles from "./home-page.module.scss";

export const HomePage = () => {
  const homePage = useDataStore((store) => store.homePage) as HomePageProps;

  // console.log(homePage.content);

  return (
    <main className={styles.root}>
      {homePage.media && <MediaImage source={homePage.media} />}
      {homePage.content && <BlocksRenderer content={homePage.content} />}
      <Content title={homePage.title}>
        <p>- Изображение</p>
        <p>- Кнопки</p>
        <p>- Типографика (компонент и классы)</p>
        <p>- Видео </p>
        <p>- Плеер</p>
        <p>- Аккордион</p>
        <p>- Слайдер</p>
      </Content>

      <Content title="Формы">
        <p>- Инпуты</p>
        <p>- Radio</p>
        <p>- Checkbox</p>
        <p>- File</p>
        <p>- Форма</p>
      </Content>

      <Content title="Анимация">
        <p>- Базовая анимация</p>
        <p>- Анимация по скроллу</p>
        <p>- Стики анимация</p>
        <p>- WebGL</p>
        <p>- Canvas</p>
        <p>- Sequence</p>
      </Content>

      <Content title="Набор библиотек">
        <p>
          Валидация -{" "}
          <Link href="https://zod.dev/" target="_blank">
            Zod
          </Link>
        </p>
        <p>
          Формы -{" "}
          <Link href="https://react-hook-form.com/" target="_blank">
            React Hook forms
          </Link>
        </p>
        <p>
          Маски -{" "}
          <Link
            href="https://github.com/eduardoborges/use-mask-input"
            target="_blank"
          >
            Use mask input
          </Link>
        </p>
        <p>
          Store -{" "}
          <Link href="https://zustand-demo.pmnd.rs/" target="_blank">
            Zustand
          </Link>
        </p>
        <p>
          Анимация -{" "}
          <Link href="https://gsap.com/" target="_blank">
            Gsap
          </Link>{" "}
          /{" "}
          <Link href="https://motion.dev/" target="_blank">
            Motion
          </Link>
        </p>
        <p>
          Scroll -{" "}
          <Link
            href="https://github.com/darkroomengineering/lenis"
            target="_blank"
          >
            Lenis
          </Link>
        </p>
        <p>
          WEBGL -{" "}
          <Link href="https://r3f.docs.pmnd.rs/" target="_blank">
            React Three Fiber
          </Link>{" "}
          /{" "}
          <Link href="https://oframe.github.io/ogl/" target="_blank">
            OGL
          </Link>
        </p>
        <p>
          Базовый слайдер - <Link href="https://swiperjs.com/">Swiper</Link>
        </p>
      </Content>
    </main>
  );
};

HomePage.displayName = "HomePage";
