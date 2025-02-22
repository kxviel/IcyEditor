import { Button } from "./ui/button";
import Logo from "@/assets/Logo.svg";
import AvatarImg from "@/assets/avatarImg.svg";
import { Bell, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useNavigate, useLocation } from "@tanstack/react-router";
import SavePaper from "@/features/Builder/SavePaper";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const pathname = useLocation({
    select: (l) => l.pathname,
  });

  return (
    <header className="w-full border border-b border-gray-200">
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-8">
        <div
          className="hover:cursor-pointer"
          onClick={() => navigate({ to: "/" })}
        >
          <img src={Logo} alt="logo" />
        </div>

        {pathname === "/builder" ? (
          <SavePaper />
        ) : (
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="px-3">
              <Settings />
            </Button>
            <Button variant="ghost" className="px-3">
              <Bell />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 hover:cursor-pointer">
                  <AvatarImage src={AvatarImg} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={signOut}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
