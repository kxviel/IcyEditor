import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import RootModal from "@/components/RootModal";

export const Route = createRootRoute({
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
