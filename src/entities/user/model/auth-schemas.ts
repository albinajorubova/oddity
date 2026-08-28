import { z } from "zod";

export const registerPayloadSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(32, "Username must be at most 32 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginPayloadSchema = z.object({
  identifier: z.string().min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type RegisterPayloadInput = z.infer<typeof registerPayloadSchema>;
export type LoginPayloadInput = z.infer<typeof loginPayloadSchema>;
