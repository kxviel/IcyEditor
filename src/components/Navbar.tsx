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
import { useAuth } from "@/hooks/useAuth";
import Stepper from "@/components/ui/stepper";
import AvatarPlaceholder from "@/assets/avatarImg.svg";
import { useState } from "react";
import { useModalStore } from "@/store/useModalStore";

const allowedStepperRoutes = [
  "/builder/manual-selection",
  "/builder/auto-selection",
  "/preview",
];

const Navbar = () => {
  const { logout, getUser } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const setModal = useModalStore((state) => state.setModal);
  const [showAlert, setShowAlert] = useState(false);

  return (
    <header className="h-[72px] w-full border border-b border-gray-200">
      <nav className="mx-auto flex h-full max-w-screen-xl items-center justify-between gap-2 px-8">
        <div
          className="hover:cursor-pointer"
          onClick={() => navigate({ to: "/", search: { page: 1 } })}
        >
          <img src={Logo} alt="logo" />
        </div>

        {allowedStepperRoutes.includes(pathname) && (
          <div className="flex flex-1 items-center justify-center">
            <Stepper />
          </div>
        )}

        {pathname === "/preview" && <SavePaper />}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src={AvatarPlaceholder} alt="@kxviel" />
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {!getUser()?.isProfileCompleted && (
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
            {getUser()?.IS_SUPER_ADMIN > 0 && (
              <DropdownMenuItem>View Users</DropdownMenuItem>
            )}

            <DropdownMenuItem
              className="text-red-600"
              onClick={() => setShowAlert(true)}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {showAlert && (
          <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Do you want to logout?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    setShowAlert(false);
                    logout();
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
