import Navbar from "@/components/Navbar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: AuthComponent,
  beforeLoad: ({ context, params }) => {
    const { isLogged } = context.auth;
    console.log(params);

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
