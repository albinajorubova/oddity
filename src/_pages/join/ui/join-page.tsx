"use client";

import { RegisterForm } from "@features/auth-register";
import clsx from "clsx";

import { Container } from "@shared/ui/container";

import s from "./join-page.module.scss";

export type JoinPageProps = {
  className?: string;
};

export const JoinPage = (props: JoinPageProps) => {
  const { className } = props;

  return (
    <main className={clsx(s.root, className)}>
      <Container className={s.inner}>
        <header className={s.header}>
          <h1 className={clsx(s.title, "typo-h1")}>JOIN</h1>
          <p className={clsx(s.kicker, "typo-micro")}>
            Create your ODDITY account
          </p>
        </header>
        <RegisterForm />
      </Container>
    </main>
  );
};

JoinPage.displayName = "JoinPage";
