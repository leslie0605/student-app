
import React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { cn } from '@/lib/utils';
import { Home } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-magic-light to-white px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold mb-4 text-magic-purple">404</h1>
        <p className="text-xl text-magic-dark mb-6">Oops! This page seems to have vanished into thin air</p>
        <p className="text-muted-foreground mb-8">
          The magic spell you're looking for doesn't exist. Let's take you back to the Academy.
        </p>
        <button
          onClick={() => navigate('/')}
          className={cn(
            "py-3 px-6 rounded-lg font-medium transition-all-200 shadow-md",
            "bg-gradient-to-r from-magic-blue to-magic-purple text-white",
            "hover:shadow-lg hover:translate-y-[-2px]",
            "active:translate-y-[0px]",
            "flex items-center gap-2 mx-auto"
          )}
        >
          <Home className="h-5 w-5" />
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
