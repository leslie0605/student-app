import { NotificationCenter } from "@/components/ui/NotificationCenter";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export function Navbar() {
  const title = "MagicalPrep"; // Define the title variable

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Sparkles className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">{title}</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {/* ... existing nav links ... */}
          </nav>
        </div>

        {/* ... existing mobile menu button ... */}

        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="flex items-center">
            <NotificationCenter />

            {/* ... existing user menu or other elements ... */}
          </div>
        </div>
      </div>
    </header>
  );
}
