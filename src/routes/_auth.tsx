import Navbar from "@/components/Navbar";
import { env } from "@/config/env";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: AuthComponent,
  beforeLoad: () => {
    const isLogged =
      localStorage.getItem(env.AUTH_STATUS_IDENTIFIER) === "true";

    if (!isLogged) {
      throw redirect({
        to: "/login",
      });
    }
  },
});

function AuthComponent() {
  return (
    <main>
      <Navbar />
      <Outlet />
    </main>
  );
}
