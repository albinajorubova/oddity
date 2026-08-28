"use client";

import clsx from "clsx";

import { ROUTES } from "@shared/config";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { StyledButton } from "@shared/ui/styled-button";

import { useRegister } from "../model/use-register";

import s from "./register-form.module.scss";

export type RegisterFormProps = {
  className?: string;
};

export const RegisterForm = (props: RegisterFormProps) => {
  const { className } = props;
  const { register, errors, onSubmit, rootError, isSuccess, isLoading } =
    useRegister();

  if (isSuccess) {
    return (
      <div className={clsx(s.root, className)}>
        <p className={clsx(s.success, "typo-p1")}>
          Account created. Sign in to continue.
        </p>
        <StyledButton
          href={ROUTES.login}
          variant="primary"
          size="m"
          colorScheme="dark"
        >
          SIGN IN
        </StyledButton>
      </div>
    );
  }

  return (
    <form className={clsx(s.root, className)} onSubmit={onSubmit} noValidate>
      <Input
        {...register("username")}
        type="text"
        autoComplete="username"
        placeholder="Username"
        scheme="line"
        error={errors.username?.message}
      />

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
        autoComplete="new-password"
        placeholder="Password"
        scheme="line"
        error={errors.password?.message}
      />

      <Input
        {...register("passwordConfirmation")}
        type="password"
        autoComplete="new-password"
        placeholder="Confirm password"
        scheme="line"
        error={errors.passwordConfirmation?.message}
      />

      {rootError && <p className={clsx(s.error, "typo-p2")}>{rootError}</p>}

      <StyledButton
        type="submit"
        variant="primary"
        size="m"
        colorScheme="dark"
        disabled={isLoading}
      >
        {isLoading ? "CREATING…" : "CREATE ACCOUNT"}
      </StyledButton>

      <p className={clsx(s.footer, "typo-micro")}>
        Already have an account?{" "}
        <Button href={ROUTES.login} className={s.link}>
          Sign in
        </Button>
      </p>
    </form>
  );
};

RegisterForm.displayName = "RegisterForm";
