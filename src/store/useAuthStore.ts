import { create } from "zustand";
import { persist } from "zustand/middleware";
import { env } from "@/config/env";

export type User = {
  id: number;
  STATUS: any;
  DEALER_ID: any;
  EMAIL: string;
  PASSWORD: string;
  MOBILE: string;
  SCHOOL_ID: string;
  UNAME: string;
  school: string;
  city: string;
  state: string;
  PUBLICATION_ID: any;
  SERIES_ID: any;
  IS_SUPER_ADMIN: number;
  RESTRICTED_ACCESS: number;
  token: string;
  status: string;
  isProfileCompleted: boolean;
};

type AuthState = {
  user: User | null;
  getUser: () => User | null;
  saveUser: (user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,

      getUser: () => get().user,

      saveUser: (user: User) =>
        set(() => {
          console.log(user);
          localStorage.setItem(env.AUTH_STATUS_IDENTIFIER, "true");
          localStorage.setItem(env.TOKEN_IDENTIFIER, user.token);
          return { user, isAuthenticated: true };
        }),

      logout: () => {
        set({ user: null });
        localStorage.removeItem(env.AUTH_STATUS_IDENTIFIER);
        localStorage.removeItem(env.TOKEN_IDENTIFIER);
        window.location.href = "/login";
      },
    }),
    {
      name: env.LOCALSTORAGE_IDENTIFIER,
    },
  ),
);
