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

export const useAuth = () => {
  const getUser = (): User => {
    return JSON.parse(
      localStorage.getItem(env.LOCALSTORAGE_IDENTIFIER) || "{}",
    );
  };

  const saveUser = (user: User) => {
    console.log(user);

    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem(env.LOCALSTORAGE_IDENTIFIER, JSON.stringify(user));
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const isLogged = () => localStorage.getItem("isAuthenticated") === "true";

  return { saveUser, logout, isLogged, getUser };
};

export type AuthContext = ReturnType<typeof useAuth>;
