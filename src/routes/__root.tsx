import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

import { AuthContext } from "@/hooks/useAuth";
import RootModal from "@/components/RootModal";

interface MyRouterContext {
  auth: AuthContext;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <main>
      <Toaster position="top-right" richColors theme="light" closeButton />
      <Outlet />
      <RootModal />
    </main>
  );
}
