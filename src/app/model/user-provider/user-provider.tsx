"use client";

import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";
import { useRouter } from "next/router";

import type { User } from "@entities/user";

import { ROUTES } from "@shared/config";

type UserContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  applyAuthUser: (user: User) => void;
  logout: () => Promise<void>;
};

const UserContext = createContext<UserContextValue | null>(null);

export type UserProviderProps = PropsWithChildren<{
  user?: User | null;
  userIsAuthenticated?: boolean;
}>;

export const UserProvider = (props: UserProviderProps) => {
  const {
    children,
    user: initialUser = null,
    userIsAuthenticated = false,
  } = props;
  const router = useRouter();

  const [user, setUser] = useState<User | null>(initialUser);
  const [isAuthenticated, setIsAuthenticated] = useState(userIsAuthenticated);

  useEffect(() => {
    setUser(initialUser);
    setIsAuthenticated(userIsAuthenticated);
  }, [initialUser, userIsAuthenticated]);

  const applyAuthUser = useCallback((nextUser: User) => {
    setUser(nextUser);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    await axios.post("/api/auth/logout");
    setUser(null);
    setIsAuthenticated(false);
    await router.push(ROUTES.home);
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      setUser,
      applyAuthUser,
      logout,
    }),
    [user, isAuthenticated, applyAuthUser, logout],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextValue => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }

  return context;
};
