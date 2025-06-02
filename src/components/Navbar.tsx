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
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Logo from "@/assets/Logo.svg";
import { useNavigate, useLocation } from "@tanstack/react-router";
import SavePaper from "@/features/Builder/SavePaper";
import Stepper from "@/components/ui/stepper";
import AvatarPlaceholder from "@/assets/avatarImg.svg";
import { useState } from "react";
import { useModalStore } from "@/store/useModalStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

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

  const isExamTypePage = pathname === "/exam-type";

  const handleBackToDashboard = () => {
    navigate({ to: "/", search: { page: 1 } });
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

  return (
    <header className="h-[72px] w-full border-b border-gray-200 bg-white">
      <nav className="mx-auto flex h-full max-w-screen-xl items-center justify-between gap-2 px-8">
        {/* Logo or Back Button */}
        <div className="flex items-center">
          {isExamTypePage ? (
            <Button
              variant="ghost"
              onClick={handleBackToDashboard}
              className="flex items-center gap-2 text-gray-600 text-primary hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
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

        {/* User Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={AvatarPlaceholder} alt="User avatar" />
              </Avatar>
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
