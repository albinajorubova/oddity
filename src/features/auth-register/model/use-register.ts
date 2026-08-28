"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";

import { parseAuthError } from "@entities/user";

import { type RegisterFormValues, registerFormSchema } from "./schema";

export const useRegister = () => {
  const [rootError, setRootError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setRootError(null);
    setIsLoading(true);

    try {
      await axios.post("/api/auth/register", {
        username: values.username,
        email: values.email,
        password: values.password,
      });
      setIsSuccess(true);
    } catch (error) {
      setRootError(parseAuthError(error, "Registration failed"));
    } finally {
      setIsLoading(false);
    }
  });

  return {
    register: form.register,
    errors: form.formState.errors,
    onSubmit,
    rootError,
    isSuccess,
    isLoading,
  };
};
