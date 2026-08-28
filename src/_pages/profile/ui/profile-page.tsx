"use client";

import { useUser } from "@app/model/user-provider";
import clsx from "clsx";

import { isAdmin } from "@entities/user";

import { ROUTES } from "@shared/config";
import { Button } from "@shared/ui/button";
import { Container } from "@shared/ui/container";

import s from "./profile-page.module.scss";

export type ProfilePageProps = {
  className?: string;
};

const formatEstablished = (createdAt?: string): string | null => {
  if (!createdAt) return null;

  const year = new Date(createdAt).getFullYear();
  return Number.isNaN(year) ? null : String(year);
};

export const ProfilePage = (props: ProfilePageProps) => {
  const { className } = props;
  const { user } = useUser();

  if (!user) {
    return null;
  }

  const roleLabel = user.role?.name?.toUpperCase() ?? "MEMBER";
  const established = formatEstablished(user.createdAt);

  return (
    <main className={clsx(s.root, className)}>
      <Container className={s.inner}>
        <header className={s.header}>
          <h1 className={clsx(s.title, "typo-h1")}>PROFILE</h1>
          <p className={clsx(s.kicker, "typo-micro")}>
            {roleLabel}
            {established ? ` · EST. ${established}` : ""}
          </p>
        </header>

        <dl className={s.details}>
          <div className={s.row}>
            <dt className={clsx(s.label, "typo-micro")}>Username</dt>
            <dd className={clsx(s.value, "typo-p1")}>{user.username}</dd>
          </div>
          <div className={s.row}>
            <dt className={clsx(s.label, "typo-micro")}>Email</dt>
            <dd className={clsx(s.value, "typo-p1")}>{user.email}</dd>
          </div>
        </dl>

        {isAdmin(user) && (
          <Button
            href={ROUTES.admin}
            className={clsx(s.adminLink, "typo-caption")}
          >
            Go to admin desk →
          </Button>
        )}
      </Container>
    </main>
  );
};

ProfilePage.displayName = "ProfilePage";
