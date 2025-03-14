import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Logo from "@/assets/Logo.svg";
import { useNavigate, useLocation } from "@tanstack/react-router";
import SavePaper from "@/features/Builder/SavePaper";
import { useAuth } from "@/hooks/useAuth";
import Stepper from "@/components/ui/stepper";

const allowedStepperRoutes = [
  "/builder/manual-selection",
  "/builder/auto-selection",
  "/preview",
];

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  console.log(pathname);

  return (
    <header className="h-[72px] w-full border border-b border-gray-200">
      <nav className="mx-auto flex h-full max-w-screen-xl items-center justify-between px-8">
        <div
          className="hover:cursor-pointer"
          onClick={() => navigate({ to: "/" })}
        >
          <img src={Logo} alt="logo" />
        </div>

        {allowedStepperRoutes.includes(pathname) && (
          <div className="flex flex-1 justify-center">
            <Stepper />
          </div>
        )}

        {!["/builder", "/preview"].includes(pathname) && (
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="px-3"
              onClick={() => navigate({ to: "/users" })}
            >
              View Users
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="px-3">Logout</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Do you want to logout?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={logout}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {pathname === "/preview" && <SavePaper />}
      </nav>
    </header>
  );
};

export default Navbar;
