import { Button } from "./ui/button";
import Logo from "@/assets/Logo.svg";
import { Bell, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useNavigate } from "@tanstack/react-router";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full border border-b border-gray-200">
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-8">
        <div
          className="hover:cursor-pointer"
          onClick={() => navigate({ to: "/" })}
        >
          <img src={Logo} alt="logo" />
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="px-3">
            <Settings />
          </Button>
          <Button variant="ghost" className="px-3">
            <Bell />
          </Button>
          <Avatar className="hover:cursor-pointer">
            <AvatarImage src="https://github.com/kxviel.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
