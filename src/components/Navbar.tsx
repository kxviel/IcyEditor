import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logo from "@/assets/Logo.svg";
import { useNavigate, useLocation } from "@tanstack/react-router";
import SavePaper from "@/features/Builder/SavePaper";
import Stepper from "@/components/stepper";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useModalStore } from "@/store/useModalStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "./ui/button";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import AvatarPlaceholder from "@/assets/avatarImg.svg";

const allowedStepperRoutes = [
  "/builder/manual-selection",
  "/builder/auto-selection",
  "/preview",
];

const Navbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const getUser = useAuthStore((state) => state.getUser);
  const logout = useAuthStore((state) => state.logout);
  const setModal = useModalStore((state) => state.setModal);

  const [showAlert, setShowAlert] = useState(false);

  const user = getUser();

  const needBackArrow = [
    "/exam-type",
    "/builder/manual-selection",
    "/builder/auto-selection",
    "/preview",
  ].includes(pathname);

  const handleBack = () => {
    if (pathname === "/exam-type") {
      navigate({ to: "/", search: { page: 1 } });
    } else if (
      ["/builder/manual-selection", "/builder/auto-selection"].includes(
        pathname,
      )
    ) {
      navigate({ to: "/exam-type" });
    } else if (pathname === "/preview") {
      navigate({
        to: "/builder/$examId",
        params: { examId: "manual-selection" },
        search: { needPreselection: false },
      });
    }
  };

  const handleLogoClick = () => {
    navigate({ to: "/", search: { page: 1 } });
  };

  const handleLogout = () => {
    setShowAlert(false);
    logout();
  };

  const handleViewUsers = () => {
    navigate({ to: "/users", search: { page: 1 } });
  };

  let backLabel = "Back to Dashboard";

  if (pathname === "/exam-type") {
    backLabel = "Back to Dashboard";
  } else if (
    ["/builder/manual-selection", "/builder/auto-selection"].includes(pathname)
  ) {
    backLabel = "Back to Exam Type";
  } else if (pathname === "/preview") {
    backLabel = "Back to Builder";
  }

  return (
    <header className="h-[72px] w-full border-b border-gray-200 bg-white">
      <nav className="mx-auto flex h-full max-w-screen-xl items-center justify-between gap-2 px-8">
        {/* Logo or Back Button */}
        <div className="flex items-center">
          {needBackArrow ? (
            <Button
              variant="ghost"
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 text-primary hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </Button>
          ) : (
            <div className="cursor-pointer" onClick={handleLogoClick}>
              <img src={Logo} alt="logo" />
            </div>
          )}
        </div>

        {/* Stepper - only show on allowed routes */}
        {allowedStepperRoutes.includes(pathname) && (
          <div className="flex flex-1 items-center justify-center">
            <Stepper />
          </div>
        )}

        {/* Save Paper - only show on preview */}
        {pathname === "/preview" && <SavePaper />}

        <Separator className="mx-2 h-6" orientation="vertical" />

        {/* User Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="link"
              className="relative flex items-center gap-4 outline-none"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={AvatarPlaceholder} alt="User avatar" />
              </Avatar>

              <ChevronDown size={24} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {user && !user.isProfileCompleted && (
              <DropdownMenuItem
                onClick={() => {
                  setModal("COMPLETE_PROFILE", {
                    isOpen: true,
                    data: getUser(),
                  });
                }}
              >
                Complete Profile
              </DropdownMenuItem>
            )}

            {user && user.isProfileCompleted && (
              <DropdownMenuItem
                onClick={() => {
                  setModal("COMPLETE_PROFILE", {
                    isOpen: true,
                    data: getUser(),
                  });
                }}
              >
                Edit Profile
              </DropdownMenuItem>
            )}

            {user && user.IS_SUPER_ADMIN > 0 && (
              <DropdownMenuItem onClick={handleViewUsers}>
                View Users
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={() => setShowAlert(true)}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Logout Confirmation Dialog */}
        <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>
                Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </nav>
    </header>
  );
};

export default Navbar;
