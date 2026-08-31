"use client";

import clsx from "clsx";
import { useRouter } from "next/router";

import { Button } from "../button";
import { Container } from "../container";

import s from "./preview-banner.module.scss";

type PreviewBannerProps = {
  isDraftMode?: boolean;
};

/**
 * Компонент для отображения индикатора Preview Mode и кнопки выхода
 * Использует флаг isDraftMode, переданный из getServerSideProps
 */
export const PreviewBanner = ({ isDraftMode = false }: PreviewBannerProps) => {
  const router = useRouter();

  const handleExitPreview = async () => {
    try {
      // Получаем текущий путь для редиректа
      const currentPath = router.asPath;
      // Вызываем API route для выхода из preview mode
      await fetch(
        `/api/exit-preview?redirect=${encodeURIComponent(currentPath)}`,
      );
      // Перезагружаем страницу для применения изменений
      router.reload();
    } catch (error) {
      console.error("Error exiting preview mode:", error);
      // В случае ошибки просто редиректим
      router.push("/api/exit-preview");
    }
  };

  // Не показываем, если preview mode не активен
  if (!isDraftMode) {
    return null;
  }

  return (
    <div className={s.root}>
      <Container size="l" className={s.container}>
        <Button
          onClick={handleExitPreview}
          className={clsx(s.button, "typo-h3")}
          type="button"
        >
          Выйти из Preview
        </Button>
      </Container>
    </div>
  );
};

PreviewBanner.displayName = "PreviewBanner";
