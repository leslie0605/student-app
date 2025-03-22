import { NotificationCenter } from "@/components/ui/NotificationCenter";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <NavLink to="/" className="mr-6 flex items-center space-x-2">
            <SparklesIcon className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">{title}</span>
          </NavLink>
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
