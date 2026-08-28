"use client";

import { LoginForm } from "@features/auth-login";
import clsx from "clsx";

import { Container } from "@shared/ui/container";

import s from "./login-page.module.scss";

export type LoginPageProps = {
  className?: string;
};

export const LoginPage = (props: LoginPageProps) => {
  const { className } = props;

  return (
    <main className={clsx(s.root, className)}>
      <Container className={s.inner}>
        <header className={s.header}>
          <h1 className={clsx(s.title, "typo-h1")}>SIGN IN</h1>
          <p className={clsx(s.kicker, "typo-micro")}>
            Access your ODDITY account
          </p>
        </header>
        <LoginForm />
      </Container>
    </main>
  );
};

LoginPage.displayName = "LoginPage";
