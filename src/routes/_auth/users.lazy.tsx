import { createLazyFileRoute } from "@tanstack/react-router";
import UserList from "@/features/ManageUsers/UserList";

export const Route = createLazyFileRoute("/_auth/users")({
  component: () => (
    <div className="h-[calc(100vh-72px)] w-full bg-[#F9F5FF]">
      <div className="mx-auto h-full max-w-screen-xl">
        <UserList />
      </div>
    </div>
  ),
});
