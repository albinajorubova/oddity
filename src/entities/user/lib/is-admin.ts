import { ADMIN_ROLE_TYPE } from "../model/constants";
import type { User } from "../model/types";

export const isAdmin = (user: User | null | undefined): boolean =>
  user?.role?.type === ADMIN_ROLE_TYPE;
