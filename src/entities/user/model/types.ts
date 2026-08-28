export type UserRole = {
  id: number;
  name: string;
  description?: string;
  type: string;
};

export type User = {
  id: number;
  username: string;
  email: string;
  confirmed?: boolean;
  blocked?: boolean;
  createdAt?: string;
  role?: UserRole;
};

export type AuthResponse = {
  jwt: string;
  user: User;
};
