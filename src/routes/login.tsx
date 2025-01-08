import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const auth = useAuth();
  return (
    <div>
      Hello "/login"! <Button onClick={auth.signIn}>Sign In</Button>
    </div>
  );
}
