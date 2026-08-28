"use client";

import clsx from "clsx";

import { ROUTES } from "@shared/config";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { StyledButton } from "@shared/ui/styled-button";

import { useLogin } from "../model/use-login";

import s from "./login-form.module.scss";

export type LoginFormProps = {
  className?: string;
};

export const LoginForm = (props: LoginFormProps) => {
  const { className } = props;
  const { register, errors, onSubmit, rootError, isLoading } = useLogin();

  return (
    <form className={clsx(s.root, className)} onSubmit={onSubmit} noValidate>
      <Input
        {...register("email")}
        type="email"
        autoComplete="email"
        placeholder="Email"
        scheme="line"
        error={errors.email?.message}
      />

      <Input
        {...register("password")}
        type="password"
        autoComplete="current-password"
        placeholder="Password"
        scheme="line"
        error={errors.password?.message}
      />

      {rootError && <p className={clsx(s.error, "typo-p2")}>{rootError}</p>}

      <StyledButton
        type="submit"
        variant="primary"
        size="m"
        colorScheme="dark"
        disabled={isLoading}
      >
        {isLoading ? "SIGNING IN…" : "SIGN IN"}
      </StyledButton>

      <p className={clsx(s.footer, "typo-micro")}>
        No account?{" "}
        <Button href={ROUTES.join} className={s.link}>
          Join
        </Button>
      </p>
    </form>
  );
};

LoginForm.displayName = "LoginForm";
