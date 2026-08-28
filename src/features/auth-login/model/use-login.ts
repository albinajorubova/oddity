"use client";

import { useState } from "react";
import { useUser } from "@app/model/user-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import type { User } from "@entities/user";
import { parseAuthError } from "@entities/user";

import { ROUTES } from "@shared/config";

import { type LoginFormValues, loginFormSchema } from "./schema";

export const useLogin = () => {
  const router = useRouter();
  const { applyAuthUser } = useUser();
  const [rootError, setRootError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setRootError(null);
    setIsLoading(true);

    try {
      const response = await axios.post<{ data: { user: User } }>(
        "/api/auth/login",
        {
          identifier: values.email,
          password: values.password,
        },
      );

      applyAuthUser(response.data.data.user);

      const redirectParam = router.query.redirect;
      const redirect =
        typeof redirectParam === "string" ? redirectParam : ROUTES.home;

      await router.push(redirect);
    } catch (error) {
      setRootError(parseAuthError(error, "Invalid email or password"));
    } finally {
      setIsLoading(false);
    }
  });

  return {
    register: form.register,
    errors: form.formState.errors,
    onSubmit,
    rootError,
    isLoading,
  };
};
