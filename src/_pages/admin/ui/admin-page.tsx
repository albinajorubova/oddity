"use client";

import { useEffect } from "react";
import clsx from "clsx";

import { Container } from "@shared/ui/container";
import {
  ADMIN_PROFILE_STUB,
  type AdminCard,
  useAdminCardsActions,
  useAdminCardsStore,
} from "@/_pages/admin/model";

import { AddToArchive, LibrarySection, ProfileHeader } from "./sections";

import s from "./admin-page.module.scss";

export type AdminPageProps = {
  className?: string;
  cards: AdminCard[];
};

export const AdminPage = (props: AdminPageProps) => {
  const { className, cards: initialCards } = props;
  const profile = ADMIN_PROFILE_STUB;
  const cards = useAdminCardsStore((state) => state.cards);
  const { hydrate } = useAdminCardsActions();

  useEffect(() => {
    hydrate(initialCards);
  }, [hydrate, initialCards]);

  return (
    <main className={clsx(s.root, className)}>
      <Container className={s.inner}>
        <ProfileHeader role={profile.role} established={profile.established} />
        <AddToArchive />
        <LibrarySection cards={cards} />
      </Container>
    </main>
  );
};

AdminPage.displayName = "AdminPage";
