"use client";

import clsx from "clsx";

import { Container } from "@shared/ui/container";
import { ADMIN_PROFILE_STUB } from "@/_pages/admin/model";

import { AddToArchive, LibrarySection, ProfileHeader } from "./sections";

import s from "./admin-page.module.scss";

export type AdminPageProps = {
  className?: string;
};

export const AdminPage = (props: AdminPageProps) => {
  const { className } = props;
  const profile = ADMIN_PROFILE_STUB;

  return (
    <main className={clsx(s.root, className)}>
      <Container className={s.inner}>
        <ProfileHeader role={profile.role} established={profile.established} />
        <AddToArchive />
        <LibrarySection cards={profile.cards} />
      </Container>
    </main>
  );
};

AdminPage.displayName = "AdminPage";
