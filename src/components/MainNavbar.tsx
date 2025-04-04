import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Brain, MapPin, Briefcase, Menu, X, User, LogOut } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { NotificationCenter } from "@/components/ui/NotificationCenter";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MainNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Journey", path: "/journey", icon: <MapPin className="h-5 w-5" /> },
    {
      name: "Uni Bucket",
      path: "/uni-bucket",
      icon: <Briefcase className="h-5 w-5" />,
    },
    {
      name: "Magic Tools",
      path: "/magical-inventory",
      icon: <Brain className="h-5 w-5" />,
    },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all-300",
        scrolled ? "glass-effect py-2 shadow-md" : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-magic-purple hover:text-magic-blue transition-all-200"
          >
            <span className="font-playfair font-bold text-xl sm:text-2xl">
              Magic Prep Academy
            </span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center gap-2 text-foreground hover:text-magic-purple transition-all-200 font-medium"
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>
          )}

          {/* User menu and notifications */}
          <div className="flex items-center gap-4">
            <NotificationCenter />

            {/* User menu dropdown */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-1 rounded-full hover:bg-muted focus:outline-none">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || ""} alt={user.name} />
                      <AvatarFallback>
                        {user.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    {!isMobile && (
                      <span className="font-medium text-sm">{user.name}</span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile menu button */}
            {isMobile && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden z-50 p-2 text-magic-dark"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            )}
          </div>

          {/* Mobile Navigation */}
          {isMobile && (
            <div
              className={cn(
                "fixed inset-0 glass-effect pt-20 px-6 transition-all-300 transform",
                mobileMenuOpen ? "translate-x-0" : "translate-x-full"
              )}
            >
              <div className="flex flex-col space-y-8 items-center mt-10">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="flex items-center gap-3 text-foreground hover:text-magic-purple transition-all-200 text-xl font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}

                {/* Mobile logout button */}
                {user && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 text-destructive hover:text-destructive/80 transition-all-200 text-xl font-medium"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default MainNavbar;
