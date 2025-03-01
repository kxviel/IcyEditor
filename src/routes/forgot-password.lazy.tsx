import { createLazyFileRoute } from "@tanstack/react-router";
import ForgotPassword from "@/features/Auth/ForgotPassword";

export const Route = createLazyFileRoute("/forgot-password")({
  component: ForgotPassword,
});
