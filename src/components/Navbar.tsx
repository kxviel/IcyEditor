import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const auth = useAuth();
  return (
    <header>
      <nav className="flex h-[70px] gap-2 bg-slate-600 px-6 py-2 text-lg">
        <Link
          to="/"
          activeProps={{
            className: "font-bold",
          }}
          activeOptions={{ exact: true }}
        >
          Home
        </Link>{" "}
        <Link
          to="/builder"
          activeProps={{
            className: "font-bold",
          }}
        >
          Builder
        </Link>
        {!auth.isLogged() && (
          <Link
            to="/login"
            activeProps={{
              className: "font-bold",
            }}
          >
            LOGIN PAGE
          </Link>
        )}
        {auth.isLogged() && <Button onClick={auth.signOut}>Logout</Button>}
      </nav>
    </header>
  );
};

export default Navbar;
