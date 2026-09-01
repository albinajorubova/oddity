import axios from "axios";

import { STRAPI_CONFIG } from "@shared/config";

import type { AuthResponse, User } from "../model/types";

const strapiUrl = STRAPI_CONFIG.strapiNetworkUrl;

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};

export type SignInPayload = {
  identifier: string;
  password: string;
};

export const userRegister = async (data: RegisterPayload): Promise<User> => {
  const response = await axios.post<AuthResponse>(
    `${strapiUrl}/auth/local/register`,
    data,
  );

  return response.data.user;
};

export const userSignIn = async (
  data: SignInPayload,
): Promise<{ jwt: string; user: User }> => {
  const response = await axios.post<AuthResponse>(
    `${strapiUrl}/auth/local`,
    data,
  );

  const { jwt, user } = response.data;
  const userWithRole = await getUser(jwt);

  return { jwt, user: userWithRole };
};

export const getUser = async (token: string): Promise<User> => {
  const response = await axios.get<User>(`${strapiUrl}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      populate: "role",
    },
  });

  return response.data;
};
