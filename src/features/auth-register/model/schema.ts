import { z } from "zod";

import { registerPayloadSchema } from "@entities/user";

export const registerFormSchema = registerPayloadSchema
  .extend({
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

export type RegisterFormValues = z.infer<typeof registerFormSchema>;
