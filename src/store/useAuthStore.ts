import { create } from "zustand";
import { persist } from "zustand/middleware";
import { env } from "@/config/env";
import { toast } from "sonner";

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
  updateUser: (user: Partial<User>) => void;
  saveUser: (user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      getUser: () => get().user,
      updateUser: (updatedUserData: Partial<User>) =>
        set((state) => {
          const currentUser = state.user;
          if (!currentUser) {
            toast.warning("No user to update");
            return state;
          }

          const updatedUser = {
            ...currentUser,
            ...updatedUserData,
            token: updatedUserData.token || currentUser.token,
          };

          localStorage.setItem(env.AUTH_STATUS_IDENTIFIER, "true");
          localStorage.setItem(
            env.TOKEN_IDENTIFIER,
            updatedUserData.token || currentUser.token,
          );

          return { user: updatedUser };
        }),
      saveUser: (user: User) =>
        set(() => {
          localStorage.setItem(env.AUTH_STATUS_IDENTIFIER, "true");
          localStorage.setItem(env.TOKEN_IDENTIFIER, user.token);
          return { user };
        }),
      logout: () => {
        set({ user: null });
        localStorage.setItem(env.AUTH_STATUS_IDENTIFIER, "true");
        localStorage.removeItem(env.TOKEN_IDENTIFIER);
        window.location.href = "/login";
      },
    }),
    {
      name: env.LOCALSTORAGE_IDENTIFIER,
    },
  ),
);
