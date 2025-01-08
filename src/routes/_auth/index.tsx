import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="p-2">
      <h1>I AM "/"</h1>
    </div>
  );
}
