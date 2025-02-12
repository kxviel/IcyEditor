import Navbar from "@/components/Navbar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: AuthComponent,
  beforeLoad: ({ context }) => {
    const { isLogged } = context.auth;

    if (!isLogged()) {
      throw redirect({
        to: "/login",
      });
    }
  },
});

function AuthComponent() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
