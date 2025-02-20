export type User = {
  id: number;
  EMAIL: string;
  MOBILE: string;
  SCHOOL_ID: string;
  UNAME: string;
  school: string;
  city: string;
  state: string;
};

export const useAuth = () => {
  const getUser = (): User => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  };

  const signInWithGoogle = (user?: any) => {
    console.log(user);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("user", JSON.stringify(user));
  };

  const signIn = (user: User & { PASSWORD?: string }) => {
    //Temporary
    const tempDataWithoutPassword = user;
    delete tempDataWithoutPassword.PASSWORD;

    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("user", JSON.stringify(tempDataWithoutPassword));
  };

  const signOut = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
  };

  const isLogged = () => localStorage.getItem("isAuthenticated") === "true";

  return { signIn, signOut, isLogged, getUser, signInWithGoogle };
};

export type AuthContext = ReturnType<typeof useAuth>;
